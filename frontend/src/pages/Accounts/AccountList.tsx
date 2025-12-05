import React from 'react';
import { Wallet, Building2, Banknote } from 'lucide-react';

interface Entity {
  entity_id: string;
  name: string;
  type: string;
  current_balance: string;
}

interface AccountListProps {
  accounts: Entity[];
}

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  if (accounts.length === 0) {
    return (
      <div className="text-center text-muted mt-10">
        <p>No accounts found.</p>
        <p className="text-sm">Click "Add Account" to get started.</p>
      </div>
    );
  }

  const getIcon = (type: string, name: string) => {
    if (type === 'WALLET') return <Wallet className="text-blue-500" />;
    if (name.toLowerCase().includes('cash')) return <Banknote className="text-green-500" />;
    return <Building2 className="text-purple-500" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <div key={account.entity_id} className="card p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="p-3 rounded-full bg-background border border-border">
            {getIcon(account.type, account.name)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{account.name}</h3>
            <p className="text-sm text-muted">{account.type}</p>
            <p className="text-lg font-bold text-primary mt-1">
              ₹{parseFloat(account.current_balance).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountList;
