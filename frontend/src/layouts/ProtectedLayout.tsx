import { Navigate, Outlet, useLocation } from "react-router-dom";
// FIX: Use correct relative paths for imports
import { useAuth } from "../hooks/useAuth";
import AppLayout from "./AppLayout";
import ProtectedSkeleton from "../components/ProtectedSkeleton";

export default function ProtectedLayout() {
	// FIX: Removed the extra '_' typo after the destructuring
	const { user, loading } = useAuth();
	const location = useLocation();

	if (loading) return <ProtectedSkeleton />;

	if (!user) {
		const next = location.pathname + location.search;
		return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
	}

	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}