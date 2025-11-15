import clsx from "clsx";
import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
	to: string;
	label: string;
	icon?: React.ReactNode;
	collapsed?: boolean;
}

export default function SidebarLink({ to, label, icon, collapsed }: SidebarLinkProps) {
	return (
		<div className="relative group">
			<NavLink
				to={to}
				className={({ isActive }) =>
					clsx("group flex items-center gap-3 px-3 py-2 rounded-md font-medium transition group-hover:scale-110", isActive ? "active-link" : "non-active-link")
				}
			>
				{icon && <span className={clsx("w-5 h-5", collapsed && "mx-auto")}>{icon}</span>}

				{!collapsed && <span>{label}</span>}
			</NavLink>

			{/* Tooltip */}
			{collapsed && (
				<div
					className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-md shadow-smooth bg-foreground text-background opacity-0 group-hover:opacity-100 -hover:translate-x-1 text-sm whitespace-nowrap transition-all duration-200
        "
				>
					{label}
				</div>
			)}
		</div>
	);
}
