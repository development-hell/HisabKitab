import { useState } from "react";
import PayeeList from "./PayeeList";
import PayeeDetails from "./PayeeDetails";

export default function PayeesPage() {
  const [selectedPayee, setSelectedPayee] = useState<number | null>(null);

  return (
    <div className="flex h-full bg-base text-base">
      
      {/* LEFT PANEL */}
      <div
        className={`
          border-r border-base bg-surface h-full
          md:w-1/3 w-full
          md:block
          ${selectedPayee ? "hidden md:block" : "block"}
        `}
      >
        <PayeeList onSelect={setSelectedPayee} selected={selectedPayee} />
      </div>

      {/* RIGHT PANEL — Payee details / actions */}
      <div
        className={`
          flex-1 h-full bg-surface overflow-y-auto
          ${selectedPayee ? "block" : "hidden md:block"}
        `}
      >
        <PayeeDetails payeeId={selectedPayee} onBack={() => setSelectedPayee(null)} />
      </div>

    </div>
  );
}
