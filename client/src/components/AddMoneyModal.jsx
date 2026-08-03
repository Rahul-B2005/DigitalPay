import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

const quickAmounts = [500, 1000, 2000, 5000];

const AddMoneyModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/wallet/add-money', { amount: Number(amount) });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-ink/40 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-lg">Add money</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink/60 mb-1.5">Amount</label>
            <div className="flex items-center rounded-xl border border-ink/10 px-4 py-3">
              <span className="text-ink/40 mr-2">₹</span>
              <input
                type="number"
                min="1"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full outline-none text-lg font-medium"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {quickAmounts.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setAmount(String(a))}
                className="rounded-lg bg-sand px-3 py-1.5 text-sm font-medium text-indigo-900"
              >
                ₹{a}
              </button>
            ))}
          </div>

          {error && <p className="text-coral text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-950 text-white font-semibold py-3.5 hover:bg-indigo-900 transition-colors disabled:opacity-60"
          >
            {loading ? 'Adding…' : 'Add to wallet'}
          </button>
          <p className="text-xs text-ink/40 text-center">Simulated top-up for demo purposes — no real bank is charged.</p>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyModal;
