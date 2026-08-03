import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const filters = [
  { key: '', label: 'All' },
  { key: 'p2p_transfer', label: 'Transfers' },
  { key: 'qr_payment', label: 'QR pay' },
  { key: 'merchant_payment', label: 'Merchant' },
  { key: 'bill_payment', label: 'Bills' },
  { key: 'add_money', label: 'Added money' },
];

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = filter ? `?type=${filter}` : '';
    api
      .get(`/transactions${query}`)
      .then(({ data }) => setTransactions(data.transactions))
      .finally(() => setLoading(false));
  }, [filter]);

  const describeTxn = (txn) => {
    const isSender = txn.sender?._id === user._id;
    const other = isSender ? txn.receiver : txn.sender;
    const name = other?.businessName || other?.name || txn.billerName || 'Wallet top-up';
    return { isSender, name };
  };

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold mb-4">Transaction history</h1>

      <div className="flex gap-2 overflow-x-auto scrollbar-none mb-5 -mx-5 px-5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-indigo-950 text-white' : 'bg-white text-ink/60 shadow-soft'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading && <p className="text-sm text-ink/40">Loading…</p>}
        {!loading && transactions.length === 0 && (
          <p className="text-sm text-ink/40">Nothing here yet.</p>
        )}
        {transactions.map((txn) => {
          const { isSender, name } = describeTxn(txn);
          return (
            <Link
              key={txn._id}
              to={`/receipt/${txn._id}`}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-soft"
            >
              <div>
                <p className="font-medium text-sm">{name}</p>
                <p className="text-xs text-ink/40">
                  {new Date(txn.createdAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <p className={`font-semibold text-sm ${isSender ? 'text-coral' : 'text-mint-600'}`}>
                {isSender ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
              </p>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};

export default History;
