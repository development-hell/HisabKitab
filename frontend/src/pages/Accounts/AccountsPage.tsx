import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../lib/axios';
import AccountList from './AccountList';
import AddAccountModal from './AddAccountModal';

interface Entity {
  entity_id: string;
  name: string;
  type: string;
  current_balance: string;
}

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // Fetch all entities and filter for ACCOUNT and WALLET types
      // Ideally backend should support filtering, but for now we fetch all chat-list items?
      // No, chat-list is for chats. We should use the EntityViewSet list endpoint.
      // GET /api/entities/ ?
      const response = await api.get('/entities/');
      const allEntities = response.data;
      const accountEntities = allEntities.filter((e: Entity) => 
        e.type === 'ACCOUNT' || e.type === 'WALLET' || e.type === 'CASH' // Assuming CASH is a type or subtype? SRS says Type: Account (Bank, Credit Card, Cash)
      );
      // Wait, SRS says Type is ACCOUNT, EXTERNAL_PAYEE, CATEGORY, WALLET.
      // So "Cash" is just an ACCOUNT with a name "Cash"? Or is there a subtype?
      // SRS 5.2: "I want to add a new Account (Type: Bank Account, Credit Card, Cash)."
      // But Entity Model only has ACCOUNT.
      // Let's assume for now we just filter by type=ACCOUNT and type=WALLET.
      setAccounts(accountEntities);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAccountAdded = () => {
    fetchAccounts();
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
        <h1 className="text-xl font-semibold text-foreground">Accounts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Account
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-muted mt-10">Loading accounts...</div>
        ) : (
          <AccountList accounts={accounts} />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddAccountModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAccountAdded}
        />
      )}
    </div>
  );
};

export default AccountsPage;
