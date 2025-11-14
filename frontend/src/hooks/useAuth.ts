import { useContext } from "react";
// FIX: Use an absolute path alias (common in Vite) instead of a relative path
// This should resolve the "Could not resolve" error.
import AuthContext  from "../context/AuthContext";

/**
 * NEW FILE
 * This is the custom hook that components will use to access the auth state.
 * It's in a separate file to comply with React Fast Refresh (HMR) rules.
 */
export const useAuth = () => {
	const context = useContext(AuthContext);

	// FIX: Removed the 'import.meta.env.DEV' check to resolve the build warning.
	// The production-safe check is the most important part.
	if (!context) {
		// Throw error in production
		throw new Error("useAuth must be used within an AuthProvider");
	}

	// The context can be null during the initial render or if not wrapped,
	// so the check is important.
	return context!; // We use '!' to assure TypeScript we've handled the null case.
};