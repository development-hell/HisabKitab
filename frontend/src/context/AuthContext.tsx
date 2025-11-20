import { createContext, useEffect, useState } from "react";
import { clearTokens, getAccessToken, getSavedUser, saveTokens, saveUser } from "../lib/auth";
import api, { resetAxiosAuthState } from "../lib/axios";

interface AuthContextType {
	user: any;
	login: (email: string, password: string) => Promise<any>;
	logout: () => void;
	loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<any>(() => getSavedUser());
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = getAccessToken();
		if (token) {
			api
				.get("users/me/")
				.then((res) => {
					saveUser(res.data);
					setUser(res.data);
				})
				.catch(() => {
					clearTokens();
					setUser(null);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			// No token, stop loading
			setLoading(false);
		}
	}, []);

	/**
	 * Login: Gets tokens, saves them, fetches user, and updates state.
	 * This is now the single source of truth for logging in.
	 */
	const login = async (email: string, password: string) => {
		const res = await api.post("token/", { email, password });
		saveTokens(res.data.access, res.data.refresh);
		const userRes = await api.get("users/me/");
		saveUser(userRes.data);
		setUser(userRes.data);
		return userRes.data;
	};

	/**
	 * Logout: Clears state, storage, and resets the Axios interceptor.
	 * This fixes the "can't log in after logout" bug.
	 */
	const logout = () => {
		clearTokens();
		setUser(null);
		resetAxiosAuthState();
	};

	return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
