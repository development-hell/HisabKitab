import { Outlet } from "react-router-dom";
import Footer from "../components/mainLayout/Footer";
import Navbar from "../components/mainLayout/Navbar";

export default function MainLayout() {
	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground">
			<Navbar />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
