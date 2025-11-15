import { Check, Send, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/axios";

interface Connection {
	connection_id: number;
	requester: number;
	receiver: number;
	status: "pending" | "accepted" | "rejected";
	message?: string;
	requester_details?: any;
	receiver_details?: any;
}

export default function Connections() {
	const { user } = useAuth();
	const [connections, setConnections] = useState<Connection[]>([]);
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchConnections = async () => {
		try {
			const res = await api.get("connections/");
			setConnections(res.data);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchConnections();
	}, []);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const allUsers = await api.get("users/");
			const receiver = allUsers.data.find((u: any) => u.email === email);

			if (!receiver) return alert("User not found!");

			await api.post("connections/", {
				receiver: receiver.user_id,
				message,
			});

			setEmail("");
			setMessage("");
			fetchConnections();
			alert("Connection request sent!");
		} catch (err) {
			alert("Failed to send request.");
			console.error(err);
		}
	};

	const handleAction = async (id: number, action: "accept" | "reject") => {
		try {
			await api.post(`connections/${id}/${action}/`);
			fetchConnections();
		} catch (err) {
			console.error(err);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center mt-20">
				<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
			</div>
		);

	return (
		<div className="p-6 space-y-6">
			{/* PAGE HEADER */}
			<div className="flex items-center gap-3 mb-4">
				<UserPlus className="text-primary" />
				<h1 className="text-2xl font-bold text-foreground">Connections</h1>
			</div>

			{/* SEND CONNECTION REQUEST */}
			<div className="bg-surface text-surface-foreground rounded-xl shadow-smooth p-6 max-w-xl">
				<h2 className="font-semibold text-lg mb-4">Send Connection Request</h2>

				<form onSubmit={handleSend} className="space-y-3">
					<input
						type="email"
						placeholder="Enter email of user"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border border-base rounded-md px-3 py-2 bg-surface"
						required
					/>

					<textarea
						placeholder="Optional message..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="w-full border border-base rounded-md px-3 py-2 bg-surface"
					></textarea>

					<button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
						<Send size={16} /> Send Request
					</button>
				</form>
			</div>

			{/* CONNECTION LIST */}
			<div className="bg-surface text-surface-foreground rounded-xl shadow-smooth p-6 max-w-3xl">
				<h2 className="font-semibold text-lg mb-4">Your Connections</h2>

				{connections.length === 0 ? (
					<p className="text-muted text-center">No connections found.</p>
				) : (
					<ul className="divide-y divide-base">
						{connections.map((conn) => {
							console.log(conn);
							console.log(user?.user_id);
							const isRequester = conn.requester === user?.user_id;
							const person = conn.receiver;

							return (
								<li key={conn.connection_id} className="py-4 flex justify-between items-center">
									{/* USER INFO */}
									<div>
										<p className="font-medium text-foreground">
											{/*{person?.username || person?.first_name || `User #${person?.user_id}`}*/}
											{`User #${person}`}
										</p>

										<p className="text-sm text-muted capitalize">Status: {conn.status}</p>

										{conn.message && <p className="text-sm text-muted mt-1 italic">“{conn.message}”</p>}
									</div>

									{/* ACTIONS */}
									{!isRequester && conn.status === "pending" && (
										<div className="flex gap-2">
											<button onClick={() => handleAction(conn.connection_id, "accept")} className="btn btn-accent flex items-center gap-1">
												<Check size={16} /> Accept
											</button>

											<button onClick={() => handleAction(conn.connection_id, "reject")} className="btn btn-danger flex items-center gap-1">
												<X size={16} /> Reject
											</button>
										</div>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}
