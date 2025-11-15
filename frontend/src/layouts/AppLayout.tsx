import Footer from "../components/appLayout/Footer";
import Sidebar from "../components/appLayout/Sidebar";
import Topbar from "../components/appLayout/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen bg-base text-base transition-colors duration-300">
			<Sidebar />
			<div className="flex-1 flex flex-col">
				<Topbar />
				<main className="flex-1 overflow-y-auto">{children}</main>
				<Footer />
			</div>
		</div>
	);
}
