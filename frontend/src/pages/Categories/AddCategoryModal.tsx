import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../lib/axios';

interface AddCategoryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/entities/', {
        name,
        type: 'CATEGORY',
        current_balance: 0 // Categories don't hold balance usually, but model requires it? Default is 0.
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create category.");
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
        
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Category Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Food, Transport, Rent"
              className="w-full p-2 rounded-md bg-background border border-border focus:border-primary outline-none"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full mt-2"
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
