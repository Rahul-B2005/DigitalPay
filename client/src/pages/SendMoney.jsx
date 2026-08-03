import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PinModal from '../components/PinModal';

const SendMoney = () => {
  const [identifier, setIdentifier] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [payError, setPayError] = useState('');
  const [paying, setPaying] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleLookup = async (e) => {
    e.preventDefault();
    setLookupError('');
    setRecipient(null);
    setLookingUp(true);
    try {
      const { data } = await api.get(`/users/lookup/${encodeURIComponent(identifier)}`);
      setRecipient(data.user);
    } catch (err) {
      setLookupError(err.response?.data?.message || 'User not found');
    } finally {
      setLookingUp(false);
    }
  };

  const handleConfirmPin = async (pin) => {
    setPaying(true);
    setPayError('');
    try {
      const { data } = await api.post('/payments/transfer', {
        recipient: identifier,
        amount: Number(amount),
        pin,
        note,
      });
      await refreshUser();
      navigate(`/receipt/${data.transaction._id}`);
    } catch (err) {
      setPayError(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold mb-5">Send money</h1>

      {!recipient && (
        <form onSubmit={handleLookup} className="space-y-3">
          <label className="block text-sm text-ink/60">Recipient's phone or email</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="9876543210 or name@example.com"
              className="flex-1 rounded-xl border border-ink/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-900"
            />
            <button
              type="submit"
              disabled={lookingUp}
              className="rounded-xl bg-indigo-950 text-white px-4 flex items-center justify-center disabled:opacity-60"
            >
              <Search size={18} />
            </button>
          </div>
          {lookupError && <p className="text-coral text-sm">{lookupError}</p>}
        </form>
      )}

      {recipient && (
        <div className="space-y-5">
          <div className="rounded-xl bg-white shadow-soft p-4 flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: recipient.avatarColor || '#1B2166' }}
            >
              {(recipient.businessName || recipient.name).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium">{recipient.businessName || recipient.name}</p>
              <p className="text-xs text-ink/40">{recipient.phone}</p>
            </div>
            <button
              onClick={() => {
                setRecipient(null);
                setIdentifier('');
              }}
              className="text-xs text-indigo-900 font-medium"
            >
              Change
            </button>
          </div>

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

          <div>
            <label className="block text-sm text-ink/60 mb-1.5">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              className="w-full rounded-xl border border-ink/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-900"
            />
          </div>

          <button
            onClick={() => setShowPin(true)}
            disabled={!amount || Number(amount) <= 0}
            className="w-full rounded-xl bg-mint text-indigo-950 font-semibold py-3.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Proceed to pay <ArrowRight size={18} />
          </button>
        </div>
      )}

      {showPin && (
        <PinModal
          amountLabel={`Pay ₹${Number(amount).toLocaleString('en-IN')} to ${recipient.businessName || recipient.name}`}
          onClose={() => setShowPin(false)}
          onConfirm={handleConfirmPin}
          loading={paying}
          error={payError}
        />
      )}
    </Layout>
  );
};

export default SendMoney;
