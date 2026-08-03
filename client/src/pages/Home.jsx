import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeftRight, ScanLine, Zap, Smartphone, Tv, Flame, Droplet, Wifi, Car } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import AddMoneyModal from '../components/AddMoneyModal';

const billShortcuts = [
  { label: 'Mobile', category: 'mobile_recharge', icon: Smartphone },
  { label: 'Electricity', category: 'electricity', icon: Zap },
  { label: 'DTH', category: 'dth', icon: Tv },
  { label: 'Gas', category: 'gas', icon: Flame },
  { label: 'Water', category: 'water', icon: Droplet },
  { label: 'Broadband', category: 'broadband', icon: Wifi },
  { label: 'FASTag', category: 'fastag', icon: Car },
];

const Home = () => {
  const { user, refreshUser } = useAuth();
  const [recent, setRecent] = useState([]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadRecent = async () => {
    try {
      const { data } = await api.get('/transactions?limit=5');
      setRecent(data.transactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const describeTxn = (txn) => {
    const isSender = txn.sender?._id === user._id || txn.sender === user._id;
    const other = isSender ? txn.receiver : txn.sender;
    const name = other?.businessName || other?.name || txn.billerName || 'Wallet';
    return { isSender, name };
  };

  return (
    <Layout>
      <div className="rounded-xl2 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 shadow-card relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-mint/10" />
        <div className="absolute -right-2 top-10 h-16 w-16 rounded-full bg-mint/10" />
        <p className="text-white/50 text-sm relative">Wallet balance</p>
        <p className="font-display text-4xl font-semibold mt-1 relative">
          ₹{user?.walletBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <button
          onClick={() => setShowAddMoney(true)}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-mint text-indigo-950 text-sm font-semibold px-4 py-2 relative hover:bg-mint-400 transition-colors"
        >
          <Plus size={16} /> Add money
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Link
          to="/send"
          className="rounded-xl bg-white p-4 shadow-soft flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
        >
          <div className="h-10 w-10 rounded-lg bg-indigo-950/5 flex items-center justify-center text-indigo-900">
            <ArrowLeftRight size={20} />
          </div>
          <span className="font-medium text-sm">Send money</span>
        </Link>
        <Link
          to="/scan"
          className="rounded-xl bg-white p-4 shadow-soft flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
        >
          <div className="h-10 w-10 rounded-lg bg-indigo-950/5 flex items-center justify-center text-indigo-900">
            <ScanLine size={20} />
          </div>
          <span className="font-medium text-sm">Scan & pay</span>
        </Link>
      </div>

      <h2 className="font-display font-semibold text-lg mt-7 mb-3">Recharge & pay bills</h2>
      <div className="grid grid-cols-4 gap-3">
        {billShortcuts.map(({ label, category, icon: Icon }) => (
          <Link
            key={category}
            to={`/bills?category=${category}`}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <div className="h-14 w-14 rounded-xl bg-white shadow-soft flex items-center justify-center text-indigo-900">
              <Icon size={22} />
            </div>
            <span className="text-xs text-ink/70">{label}</span>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mt-7 mb-3">
        <h2 className="font-display font-semibold text-lg">Recent activity</h2>
        <Link to="/history" className="text-sm text-indigo-900 font-medium">
          View all
        </Link>
      </div>

      <div className="space-y-2">
        {loading && <p className="text-sm text-ink/40">Loading…</p>}
        {!loading && recent.length === 0 && (
          <p className="text-sm text-ink/40">No transactions yet. Your activity will show up here.</p>
        )}
        {recent.map((txn) => {
          const { isSender, name } = describeTxn(txn);
          return (
            <Link
              key={txn._id}
              to={`/receipt/${txn._id}`}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-soft"
            >
              <div>
                <p className="font-medium text-sm">{name}</p>
                <p className="text-xs text-ink/40 capitalize">{txn.type.replace(/_/g, ' ')}</p>
              </div>
              <p className={`font-semibold text-sm ${isSender ? 'text-coral' : 'text-mint-600'}`}>
                {isSender ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
              </p>
            </Link>
          );
        })}
      </div>

      {showAddMoney && (
        <AddMoneyModal
          onClose={() => setShowAddMoney(false)}
          onSuccess={async () => {
            await refreshUser();
            setShowAddMoney(false);
          }}
        />
      )}
    </Layout>
  );
};

export default Home;
