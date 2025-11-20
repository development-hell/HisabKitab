import { useState } from "react";
import ContactDetails from "./ContactDetails";
import ContactList from "./ContactList";

export default function ContactsPage() {
	const [selectedContact, setSelectedContact] = useState<string | null>(null);

	return (
		<div className="flex h-full bg-base text-base">
			{/* LEFT PANEL */}
			<div
				className={`
          border-r border-base bg-surface h-full
          md:w-1/3 w-full
          md:block
          ${selectedContact ? "hidden md:block" : "block"}
        `}
			>
				<ContactList onSelect={setSelectedContact} selected={selectedContact} />
			</div>

			{/* RIGHT PANEL */}
			<div
				className={`
          flex-1 h-full bg-surface overflow-y-auto
          ${selectedContact ? "block" : "hidden md:block"}
        `}
			>
				<ContactDetails contactId={selectedContact} onBack={() => setSelectedContact(null)} />
			</div>
		</div>
	);
}
