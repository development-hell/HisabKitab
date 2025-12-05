import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../lib/axios';

interface AddAccountModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface PaymentMode {
  mode_id: number;
  name: string;
  app_key: string;
  supports_wallet: boolean;
  linked_entity: number | null;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('ACCOUNT'); // ACCOUNT or WALLET
  const [balance, setBalance] = useState('');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('');
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === 'WALLET') {
      fetchPaymentModes();
    }
  }, [type]);

  const fetchPaymentModes = async () => {
    try {
      const response = await api.get('/payment-modes/');
      // Filter only those that support wallets and are NOT already linked
      const walletModes = response.data.filter((mode: PaymentMode) => 
        mode.supports_wallet && mode.linked_entity === null
      );
      setPaymentModes(walletModes);
    } catch (err) {
      console.error("Failed to fetch payment modes", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'WALLET') {
        if (!selectedPaymentMode) {
          setError("Please select a payment mode for this wallet.");
          setLoading(false);
          return;
        }
        // Smart Setup Flow
        await api.post(`/payment-modes/${selectedPaymentMode}/create-wallet/`);
      } else {
        // Standard Account Flow
        await api.post('/entities/', {
          name,
          type: 'ACCOUNT',
          current_balance: parseFloat(balance) || 0
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Add New Account</h2>
        
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Account Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
            >
              <option value="ACCOUNT">Bank Account / Cash</option>
              <option value="WALLET">Digital Wallet (Smart Setup)</option>
            </select>
          </div>

          {/* Wallet Flow */}
          {type === 'WALLET' ? (
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Link to Payment Mode</label>
              <select 
                value={selectedPaymentMode} 
                onChange={(e) => setSelectedPaymentMode(e.target.value)}
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
              >
                <option value="">Select a Payment Mode...</option>
                {paymentModes.map(mode => (
                  <option key={mode.mode_id} value={mode.mode_id}>
                    {mode.name} ({mode.app_key})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted mt-1">
                Only unlinked payment modes that support wallets are shown.
              </p>
            </div>
          ) : (
            /* Standard Flow */
            <>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Account Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. HDFC Bank, My Cash"
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Opening Balance (₹)</label>
                <input 
                  type="number" 
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full mt-2"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
