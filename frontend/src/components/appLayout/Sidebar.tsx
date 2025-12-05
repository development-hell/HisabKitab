import clsx from "clsx";
import { ArrowRightLeft, Home, Link as LinkIcon, LogOut, Menu, Settings, Tag, User, Users, Wallet, X } from "lucide-react";
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
					<SidebarLink to="/accounts" label="Accounts" icon={<Wallet />} collapsed={collapsed} />
					<SidebarLink to="/categories" label="Categories" icon={<Tag />} collapsed={collapsed} />
					<SidebarLink to="/transactions" label="Transactions" icon={<ArrowRightLeft />} collapsed={collapsed} />
					<SidebarLink to="/contacts" label="Contacts" icon={<Users />} collapsed={collapsed} />
					<SidebarLink to="/connections" label="Connections" icon={<LinkIcon />} collapsed={collapsed} />
				</nav>

				{/* Profile, Settings & Logout */}
				<nav className="p-4 space-y-3">
					<SidebarLink to="/profile" label="Profile" icon={<User />} collapsed={collapsed} />
					<SidebarLink to="/settings" label="Settings" icon={<Settings />} collapsed={collapsed} />

					<div className="relative group">
						<button
							onClick={handleLogout}
							className={clsx("flex items-center gap-3 px-3 py-2 rounded-md font-medium transition non-active-link text-danger w-full group-hover:scale-110")}
						>
							<span className={clsx("w-5 h-5", collapsed && "mx-auto")}>
								<LogOut size={18} />
							</span>
							{!collapsed && <span>Logout</span>}
						</button>
						{/* Tooltip */}
						{collapsed && (
							<div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-md shadow-smooth bg-foreground text-background opacity-0 group-hover:opacity-100 -hover:translate-x-1 text-sm whitespace-nowrap transition-all duration-200">
								Logout
							</div>
						)}
					</div>
				</nav>
			</aside>

			{/* Mobile Overlay */}
			{mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden" />}
		</>
	);
}
