import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import api from '../../lib/axios';

interface AddTransactionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Entity {
  entity_id: number;
  name: string;
  type: string;
}

interface ChatItem {
  id: string;
  name: string;
  type: 'USER' | 'ENTITY';
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [payerId, setPayerId] = useState('');
  const [payeeId, setPayeeId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [myEntities, setMyEntities] = useState<Entity[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<ChatItem[]>([]);
  const [categories, setCategories] = useState<Entity[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [entitiesRes, chatListRes] = await Promise.all([
        api.get('/entities/'),
        api.get('/chat-list/')
      ]);

      const entities: Entity[] = entitiesRes.data;
      setMyEntities(entities.filter(e => ['ACCOUNT', 'WALLET'].includes(e.type)));
      setCategories(entities.filter(e => e.type === 'CATEGORY'));
      
      // Filter chat list for Users only
      const chatList: ChatItem[] = chatListRes.data;
      setConnectedUsers(chatList.filter(c => c.type === 'USER'));

    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalPayeeId = payeeId;

      // Handle Connected User selection (create Entity on the fly)
      if (payeeId.startsWith('conn_')) {
        const user = connectedUsers.find(u => u.id === payeeId);
        if (user) {
          // Check if an entity with this name already exists to avoid duplicates?
          // For now, just create a new one. Ideally backend handles this.
          const newEntityRes = await api.post('/entities/', {
            name: user.name,
            type: 'EXTERNAL_PAYEE'
          });
          finalPayeeId = newEntityRes.data.entity_id;
        }
      }

      await api.post('/transactions/', {
        payer: payerId,
        payee: finalPayeeId,
        amount: parseFloat(amount),
        description,
        mode: null, // Removed Payment Mode
        category: categoryId || null,
        date: new Date().toISOString(),
        status: 'COMPLETED'
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-6">Add Transaction</h2>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 rounded-md bg-background border border-border focus:border-primary outline-none text-2xl font-bold"
              required
              autoFocus
            />
          </div>

          {/* Source & Destination */}
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
            
            {/* From (My Accounts/Wallets) */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1">From</label>
              <select 
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none text-sm"
                required
              >
                <option value="">Select Source</option>
                {myEntities.map(e => (
                  <option key={e.entity_id} value={e.entity_id}>{e.name}</option>
                ))}
              </select>
            </div>

            <ArrowRight size={16} className="text-muted mt-4" />

            {/* To (Accounts, Wallets, Connected Users) */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1">To</label>
              <select 
                value={payeeId}
                onChange={(e) => setPayeeId(e.target.value)}
                className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none text-sm"
                required
              >
                <option value="">Select Destination</option>
                <optgroup label="My Accounts">
                  {myEntities.map(e => (
                    <option key={e.entity_id} value={e.entity_id}>{e.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Connected Users">
                  {connectedUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Category (Optional) */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Category (Optional)</label>
            <select 
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
            >
              <option value="">Select Category...</option>
              {categories.map(c => (
                <option key={c.entity_id} value={c.entity_id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full py-3 text-base"
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
