// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";
// Import the base URL from axios.ts to keep it consistent
import { API_BASE_URL } from "./axios";

const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";
const USER_KEY = "user"; // Key for storing user object in localStorage

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const saveTokens = (access: string, refresh: string) => {
	localStorage.setItem(ACCESS_KEY, access);
	localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
	localStorage.removeItem(ACCESS_KEY);
	localStorage.removeItem(REFRESH_KEY);
	localStorage.removeItem(USER_KEY);
};

/**
 * NEW: Saves the user object to localStorage.
 * This is used for instant session restoration on page refresh.
 */
export const saveUser = (user: any) => {
	localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * NEW: Gets the user object from localStorage.
 * This is called by AuthContext to instantly restore the user.
 */
export const getSavedUser = () => {
	const user = localStorage.getItem(USER_KEY);
	try {
		return user ? JSON.parse(user) : null;
	} catch (e) {
		console.error("Could not parse saved user.", e);
		return null;
	}
};

/** OPTIONAL: decode token to check exp */
export const isAccessTokenExpired = (token?: string) => {
	if (!token) return true;
	try {
		const payload: any = jwtDecode(token);
		const now = Math.floor(Date.now() / 1000);
		return payload.exp && payload.exp <= now + 5;
	} catch {
		return true;
	}
};

/**
 * Logout locally and perform a hard redirect to login.
 * This is called by the interceptor when a refresh fails.
 */
export function logoutAndRedirect(next?: string) {
	clearTokens();
	const loginUrl = "/login" + (next ? `?next=${encodeURIComponent(next)}` : "");
	// Full redirect to ensure all state (including axios interceptors) is cleared
	window.location.href = loginUrl;
}

/**
 * Refresh access token using refresh token.
 * Returns new access token string or null.
 *
 * FIX: This now uses fetch with the *correct* full API URL,
 * preventing a circular dependency with the axios instance.
 */
export async function refreshAccessToken(): Promise<string | null> {
	const refresh = getRefreshToken();
	if (!refresh) {
		console.error("No refresh token found.");
		return null;
	}

	// Use the consistent URL from axios.ts
	const refreshUrl = `${API_BASE_URL}token/refresh/`;

	try {
		const res = await fetch(refreshUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh }),
		});

		if (!res.ok) {
			const text = await res.text().catch(() => "Refresh failed");
			console.error("Refresh token request failed:", text);
			return null; // Return null on failure
		}

		const data = await res.json();
		const newAccess = data.access;
		// Assume refresh token is still valid (simple-jwt just returns access)
		saveTokens(newAccess, refresh);
		return newAccess;
	} catch (error) {
		console.error("Error during token refresh:", error);
		return null; // Return null on network error
	}
}