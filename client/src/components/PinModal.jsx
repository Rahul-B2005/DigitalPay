import { useState } from 'react';
import { X } from 'lucide-react';

const PinModal = ({ title = 'Enter wallet PIN', amountLabel, onClose, onConfirm, loading, error }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(pin);
  };

  return (
    <div className="fixed inset-0 z-30 bg-ink/40 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>
        {amountLabel && <p className="text-ink/50 text-sm mb-5">{amountLabel}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            required
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="• • • •"
            className="w-full text-center tracking-[0.6em] text-2xl font-semibold rounded-xl border border-ink/10 py-4 outline-none focus:ring-2 focus:ring-indigo-900"
          />

          {error && <p className="text-coral text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="w-full rounded-xl bg-indigo-950 text-white font-semibold py-3.5 hover:bg-indigo-900 transition-colors disabled:opacity-60"
          >
            {loading ? 'Processing…' : 'Confirm & pay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PinModal;
