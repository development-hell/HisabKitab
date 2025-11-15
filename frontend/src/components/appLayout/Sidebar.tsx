import clsx from "clsx";
import { Home, Link as LinkIcon, LogOut, Menu, Settings, User, Users, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<>
			{/* Mobile Button */}
			<button
				onClick={() => setMobileOpen(!mobileOpen)}
				className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground shadow-smooth"
			>
				{mobileOpen ? <X size={20} /> : <Menu size={20} />}
			</button>

			<aside
				className={clsx(
					"fixed md:static inset-y-0 left-0 shadow-lg flex flex-col transition-all duration-300 z-40",
					"bg-sidebar text-sidebar border-r border-base",
					collapsed ? "w-20" : "w-64",
					mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
				)}
			>
				{/* Header */}
				<div className={clsx("flex items-center justify-between border-b border-base p-4", collapsed && "justify-center")}>
					{!collapsed && (
						<h1 className="text-2xl font-bold text-primary">
							<Link to="/home">HisabKitab</Link>
						</h1>
					)}

					<button onClick={() => setCollapsed(!collapsed)} className="hidden md:flex p-2 rounded-md hover:bg-muted transition">
						{collapsed ? <Menu size={20} /> : <X size={20} />}
					</button>
				</div>

				{/* Links */}
				<nav className="flex-1 p-4 space-y-3">
					<SidebarLink to="/dashboard" label="Dashboard" icon={<Home />} collapsed={collapsed} />
					<SidebarLink to="/payees" label="Payees" icon={<Users />} collapsed={collapsed} />
					<SidebarLink to="/connections" label="Connections" icon={<LinkIcon />} collapsed={collapsed} />
				</nav>
				<nav className="p-4 space-y-3">
					<SidebarLink to="/profile" label="Profile" icon={<User />} collapsed={collapsed} />
					<SidebarLink to="/settings" label="Settings" icon={<Settings />} collapsed={collapsed} />
				</nav>

				{/* Logout */}
				<button onClick={handleLogout} className={clsx("btn btn-danger")}>
					<LogOut size={18} />
					{!collapsed && <span>Logout</span>}
				</button>
			</aside>

			{/* Mobile Overlay */}
			{mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden" />}
		</>
	);
}
