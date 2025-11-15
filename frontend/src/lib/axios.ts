import axios, { type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, logoutAndRedirect, refreshAccessToken } from "./auth";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: false,
});

/**
 * Attach access token on every request if present
 */
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
	const token = getAccessToken();
	// Don't add token to auth-related paths
	if (token && !cfg.url?.includes("token")) {
		cfg.headers.Authorization = `Bearer ${token}`;
	}
	return cfg;
});

/**
 * Refresh queue helpers.
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
const subscribers: Array<(token: string | null) => void> = [];

function subscribe(cb: (token: string | null) => void) {
	subscribers.push(cb);
}
function onRefreshed(token: string | null) {
	subscribers.splice(0, subscribers.length).forEach((cb) => cb(token));
}

export function resetAxiosAuthState() {
	isRefreshing = false;
	refreshPromise = null;
	subscribers.splice(0, subscribers.length);
}

/**
 * Response interceptor that tries to refresh token on 401.
 */
api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const originalRequest = error.config;

		if (!error.response) return Promise.reject(error);

		const status = error.response.status;

		// Check for 401, not a retry, and not an auth path
		if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes("token")) {
			originalRequest._retry = true;

			// Already refreshing? Queue this request.
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					subscribe((token) => {
						if (!token) {
							reject(error); // Refresh failed
							return;
						}
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(api(originalRequest));
					});
				});
			}

			// Start refreshing
			isRefreshing = true;
			// Store the promise
			refreshPromise = refreshAccessToken().catch((err) => {
				// If refresh fails, log out
				isRefreshing = false;
				onRefreshed(null);
				logoutAndRedirect(window.location.pathname);
				return Promise.reject(err);
			});

			try {
				const newToken = await refreshPromise;
				isRefreshing = false;
				onRefreshed(newToken);

				if (!newToken) {
					return Promise.reject(error);
				}

				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
			} catch (err) {
				isRefreshing = false;
				refreshPromise = null;
				onRefreshed(null);
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
