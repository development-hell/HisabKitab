import { CheckCircle, Clock, Users, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/axios";

interface Summary {
	totalConnections: number;
	pendingRequests: number;
	acceptedConnections: number;
	rejectedConnections: number;
}

export default function Dashboard() {
	const { user } = useAuth();

	const [summary, setSummary] = useState<Summary>({
		totalConnections: 0,
		pendingRequests: 0,
		acceptedConnections: 0,
		rejectedConnections: 0,
	});

	const [showBanner, setShowBanner] = useState<boolean>(true);

	const dismissBanner = () => {
		setShowBanner(false);
		localStorage.setItem("welcome_banner_hidden", "true");
	};

	useEffect(() => {
		const fetchSummary = async () => {
			try {
				const res = await api.get("connections/");
				const data = res.data;

				setSummary({
					totalConnections: data.length,
					pendingRequests: data.filter((c: any) => c.status === "pending").length,
					acceptedConnections: data.filter((c: any) => c.status === "accepted").length,
					rejectedConnections: data.filter((c: any) => c.status === "rejected").length,
				});
			} catch (err) {
				console.error("Failed to load connections", err);
			}
		};

		fetchSummary();
	}, []);

	return (
		<div className="space-y-6 p-6">
			<h1 className="text-3xl font-semibold text-foreground tracking-tight">Dashboard Overview</h1>
			{/* ============================
          DISMISSIBLE WELCOME BANNER
      ============================ */}
			{showBanner && (
				<div
					className="
          relative rounded-xl shadow-smooth p-6 text-white
          bg-linear-to-r from-primary to-accent
          flex items-start justify-between overflow-hidden
        "
				>
					<div>
						<h2 className="text-xl font-semibold mb-1">Welcome back, {user?.first_name || user?.username}!</h2>
						<p className="opacity-90 text-sm">Here’s a quick summary of your activity.</p>
					</div>

					{/* Dismiss Button */}
					<button onClick={dismissBanner} className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 transition">
						<X size={18} className="text-white" />
					</button>
				</div>
			)}

			{/* ============================
          DASHBOARD COUNTERS
      ============================ */}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{/* Total Connections */}
				<div className="card">
					<div className="card-title">
						<span className="card-title-text">Total Connections</span>
						<Users className="text-primary" size={22} />
					</div>
					<p className="card-value text-primary">{summary.totalConnections}</p>
				</div>

				{/* Pending */}
				<div className="card">
					<div className="card-title">
						<span className="card-title-text">Pending Requests</span>
						<Clock className="text-muted" size={22} />
					</div>
					<p className="card-value text-muted">{summary.pendingRequests}</p>
				</div>

				{/* Accepted */}
				<div className="card">
					<div className="card-title">
						<span className="card-title-text">Accepted</span>
						<CheckCircle className="text-accent" size={22} />
					</div>
					<p className="card-value text-accent">{summary.acceptedConnections}</p>
				</div>

				{/* Rejected */}
				<div className="card">
					<div className="card-title">
						<span className="card-title-text">Rejected</span>
						<XCircle className="text-danger" size={22} />
					</div>
					<p className="card-value text-danger">{summary.rejectedConnections}</p>
				</div>
			</div>
		</div>
	);
}
