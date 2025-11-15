import { Navigate } from "react-router-dom";
import ProtectedSkeleton from "./components/ProtectedSkeleton";
import { useAuth } from "./hooks/useAuth";

export default function App() {
	const { user, loading } = useAuth();

	// 1. Show a skeleton screen while the AuthContext is
	// checking if the user's token is valid.
	if (loading) {
		return <ProtectedSkeleton />;
	}

	// 2. If loading is done and a user exists, redirect to the app.
	if (user) {
		return <Navigate to="/payees" replace />;
	}

	// 3. If loading is done and there is no user, send to the landing page.
	return <Navigate to="/home" replace />;
}
