import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
	return (
		<nav className="w-full flex items-center justify-between px-8 py-4 shadow-smooth bg-surface text-base">
			<h1 className="text-2xl font-bold text-primary">
				<Link to="/home">HisabKitab</Link>
			</h1>

			<div className="flex items-center gap-6">
				<Link className="font-medium hover:text-primary transition" to="/home#features">
					Features
				</Link>
				<Link className="font-medium hover:text-primary transition" to="/login">
					Login
				</Link>
				<Link to="/register" className="btn btn-primary m-0">
					Get Started
				</Link>
				<ThemeToggle />
			</div>
		</nav>
	);
}
