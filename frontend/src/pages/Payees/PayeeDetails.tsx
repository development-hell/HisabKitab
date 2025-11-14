import { ArrowLeft } from "lucide-react";

interface Props {
  payeeId: number | null;
  onBack: () => void;
}

export default function PayeeDetails({ payeeId, onBack }: Props) {
  if (!payeeId) {
    return (
      <div className="h-full flex items-center justify-center text-muted">
        Select a Payee to continue…
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
        <span className="font-semibold text-lg">Payee #{payeeId}</span>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Payee #{payeeId}</h2>

        <p className="text-muted">Here you can show financial actions, reports, payments etc.</p>

        <button className="btn-primary rounded-md px-4 py-2">Send Money</button>
        <button className="btn-accent rounded-md px-4 py-2">View Transactions</button>
        <button className="btn-danger rounded-md px-4 py-2">Remove Payee</button>
      </div>

    </div>
  );
}
