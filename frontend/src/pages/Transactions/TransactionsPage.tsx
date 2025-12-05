import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../lib/axios';
import TransactionList from './TransactionList';
import AddTransactionModal from './AddTransactionModal';

interface Transaction {
  transaction_id: number;
  payer: any;
  payee: any;
  amount: string;
  description: string;
  date: string;
  status: string;
  mode: number | null;
  category: number | null;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionAdded = () => {
    fetchTransactions();
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-muted mt-10">Loading transactions...</div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddTransactionModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
