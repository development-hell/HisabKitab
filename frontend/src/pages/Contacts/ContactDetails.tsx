import { ArrowLeft, Users } from "lucide-react";

interface Props {
	contactId: number | null;
	onBack: () => void;
}

export default function ContactDetails({ contactId, onBack }: Props) {
	if (!contactId) {
		return (
			<div className="h-full flex flex-col items-center justify-center text-muted p-6 text-center">
				<Users size={64} className="text-muted/30 mb-4" />
				<h3 className="font-semibold text-lg text-base">Select a Contact</h3>
				<p className="text-sm">Select a contact from the list to view their details and transaction history.</p>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			{/* Top Bar (only on mobile) */}
			<div className="flex items-center gap-3 p-4 border-b border-base md:hidden">
				<button onClick={onBack} className="p-2 rounded-md hover:bg-muted">
					<ArrowLeft />
				</button>
				<span className="font-semibold text-lg">Contact #{contactId}</span>
			</div>

			{/* Main Content */}
			<div className="p-6 space-y-4">
				<h2 className="text-2xl font-bold">Contact #{contactId}</h2>

				<p className="text-muted">Here you can show financial actions, reports, payments etc.</p>

				<button className="btn-primary rounded-md px-4 py-2">Send Money</button>
				<button className="btn-accent rounded-md px-4 py-2">View Transactions</button>
				<button className="btn-danger rounded-md px-4 py-2">Remove Contact</button>
			</div>
		</div>
	);
}
