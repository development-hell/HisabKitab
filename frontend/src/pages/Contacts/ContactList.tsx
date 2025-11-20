import { Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface ChatListItem {
	id: string;
	name: string;
	type: "USER" | "ENTITY";
	status: string | null;
	avatar: string | null;
	last_message: string | null;
	updated_at: string;
}

interface ContactListProps {
	onSelect: (id: string) => void;
	selected: string | null;
}

export default function ContactList({ onSelect, selected }: ContactListProps) {
	const [contacts, setContacts] = useState<ChatListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		api
			.get("chat-list/")
			.then((res) => {
				setContacts(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch chat list", err);
				setError("Failed to load contacts.");
				setLoading(false);
			});
	}, []);

	return (
		<div className="h-full flex flex-col">
			{/* HEADER & ACTIONS */}
			<div className="p-4 border-b border-base space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="font-semibold text-xl">Contacts</h2>
					<button className="btn btn-primary p-2 h-auto rounded-md">
						<UserPlus size={18} />
					</button>
				</div>

				{/* SEARCH BAR */}
				<div className="relative">
					<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
					<input type="search" placeholder="Search contacts..." className="w-full bg-base border border-base rounded-md pl-9 pr-3 py-2 text-sm" />
				</div>
			</div>

			{/* CONTACT LIST */}
			<div className="flex-1 overflow-y-auto">
				{loading && <div className="p-4 text-center text-muted">Loading...</div>}
				{error && <div className="p-4 text-center text-danger">{error}</div>}
				
				{!loading && !error && contacts.length === 0 && (
					<div className="p-4 text-center text-muted">No contacts found.</div>
				)}

				{contacts.map((c) => (
					<div
						key={c.id}
						onClick={() => onSelect(c.id)}
						className={`
              p-4 border-base cursor-pointer transition flex items-center gap-3
              ${selected === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
            `}
					>
						{/* Avatar Placeholder */}
						<div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selected === c.id ? "bg-white text-primary" : "bg-muted text-muted-foreground"}`}>
							{c.name.charAt(0).toUpperCase()}
						</div>
						
						<div className="flex-1 min-w-0">
							<div className="font-semibold truncate">{c.name}</div>
							<div className={`text-sm truncate ${selected === c.id ? "text-primary-foreground/80" : "text-muted"}`}>
								{c.last_message || (c.type === 'USER' ? 'Connection' : 'Entity')}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
