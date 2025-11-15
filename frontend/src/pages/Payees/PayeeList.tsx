interface PayeeListProps {
	onSelect: (id: number) => void;
	selected: number | null;
}

const mockPayees = [
	{ id: 1, name: "Rohan Sharma", lastSeen: "12 min ago" },
	{ id: 2, name: "Sneha Patel", lastSeen: "1 hour ago" },
	{ id: 3, name: "Mohan Lal", lastSeen: "Yesterday" },
];

export default function PayeeList({ onSelect, selected }: PayeeListProps) {
	return (
		<div className="h-full flex flex-col">
			<div className="p-4 font-semibold border-b border-base text-xl">Payees</div>

			<div className="flex-1 overflow-y-auto">
				{mockPayees.map((p) => (
					<div
						key={p.id}
						onClick={() => onSelect(p.id)}
						className={`
              p-4 border-base cursor-pointer transition
              ${selected === p.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
            `}
					>
						<div className="font-semibold">{p.name}</div>
						<div className="text-sm text-muted">{p.lastSeen}</div>
					</div>
				))}
			</div>
		</div>
	);
}
