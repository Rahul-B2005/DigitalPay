import { useState } from 'react';
import { ShieldCheck, User as UserIcon } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetPin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/set-pin', { pin });
      await refreshUser();
      setMessage('Wallet PIN updated successfully');
      setPin('');
      setConfirmPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold mb-5">Profile</h1>

      <div className="rounded-xl bg-white shadow-soft p-5 flex items-center gap-4 mb-6">
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center text-white font-semibold text-lg"
          style={{ backgroundColor: user?.avatarColor || '#1B2166' }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-ink/40">{user?.phone}</p>
          <p className="text-sm text-ink/40">{user?.email}</p>
        </div>
      </div>

      {user?.role === 'merchant' && (
        <div className="rounded-xl bg-white shadow-soft p-5 mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-950/5 flex items-center justify-center text-indigo-900">
            <UserIcon size={20} />
          </div>
          <div>
            <p className="font-medium text-sm">{user.businessName}</p>
            <p className="text-xs text-ink/40 capitalize">{user.businessCategory} business</p>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-soft p-5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-indigo-900" />
          <h2 className="font-display font-semibold">Wallet security PIN</h2>
        </div>
        <p className="text-xs text-ink/40 mb-4">
          {user?.walletPin ? 'Update your 4-digit PIN used to authorize payments.' : 'Set a 4-digit PIN to start making payments.'}
        </p>

        <form onSubmit={handleSetPin} className="space-y-3">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="New PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full rounded-xl border border-ink/10 px-4 py-3 tracking-widest outline-none focus:ring-2 focus:ring-indigo-900"
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="Confirm PIN"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full rounded-xl border border-ink/10 px-4 py-3 tracking-widest outline-none focus:ring-2 focus:ring-indigo-900"
          />

          {error && <p className="text-coral text-sm">{error}</p>}
          {message && <p className="text-mint-600 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-950 text-white font-semibold py-3.5 disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Save PIN'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
