import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../ThemeToggle";

export default function Topbar() {
	const { user } = useAuth();

	return (
		<header className="bg-base text-base-foreground border-b border-base shadow-sm p-4 flex justify-between items-center transition">
			<h2 className="text-lg font-semibold">Welcome, {user?.first_name || user?.username}</h2>
			<ThemeToggle />
		</header>
	);
}
