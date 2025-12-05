import React from 'react';
import { ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Transaction {
  transaction_id: number;
  payer: any;
  payee: any;
  amount: string;
  description: string;
  date: string;
  status: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center text-muted mt-10">
        <p>No transactions found.</p>
        <p className="text-sm">Click "Add Transaction" to create one.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={16} className="text-green-500" />;
      case 'PENDING': return <Clock size={16} className="text-yellow-500" />;
      case 'REJECTED': return <XCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div key={tx.transaction_id} className="card p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground flex items-center gap-2">
              {tx.payer?.name || `Entity ${tx.payer}`} <ArrowRight size={14} className="text-muted" /> {tx.payee?.name || `Entity ${tx.payee}`}
            </span>
            <span className="text-sm text-muted">{tx.description || "No description"}</span>
            <span className="text-xs text-muted mt-1">{new Date(tx.date).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-foreground">₹{parseFloat(tx.amount).toLocaleString('en-IN')}</span>
            <span className="text-xs flex items-center gap-1 mt-1">
              {getStatusIcon(tx.status)} {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
