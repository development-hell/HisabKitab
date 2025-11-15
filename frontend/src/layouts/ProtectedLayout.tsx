import { Navigate, Outlet, useLocation } from "react-router-dom";
import ProtectedSkeleton from "../components/ProtectedSkeleton";
import { useAuth } from "../hooks/useAuth";
import AppLayout from "./AppLayout";

export default function ProtectedLayout() {
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
