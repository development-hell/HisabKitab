import { Search, UserPlus } from "lucide-react";

interface ContactListProps {
	onSelect: (id: number) => void;
	selected: number | null;
}

const mockContacts = [
	{ id: 1, name: "Grocery Store", category: "Groceries" },
	{ id: 2, name: "Landlord", category: "Rent" },
	{ id: 3, name: "Swiggy", category: "Food" },
];

export default function ContactList({ onSelect, selected }: ContactListProps) {
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
				{mockContacts.map((c) => (
					<div
						key={c.id}
						onClick={() => onSelect(c.id)}
						className={`
              p-4 border-base cursor-pointer transition
              ${selected === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
            `}
					>
						<div className="font-semibold">{c.name}</div>
						<div className="text-sm text-muted">{c.category}</div>
					</div>
				))}
			</div>
		</div>
	);
}
