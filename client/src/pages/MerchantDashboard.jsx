import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

const MerchantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/merchant/dashboard')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <p className="text-sm text-ink/40">Loading…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="font-display text-2xl font-semibold mb-5">Sales dashboard</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl2 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 shadow-card">
          <p className="text-white/50 text-xs">Received today</p>
          <p className="font-display text-2xl font-semibold mt-1">
            ₹{stats.todayReceived.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-xl2 bg-white shadow-card p-5">
          <p className="text-ink/40 text-xs">All-time total</p>
          <p className="font-display text-2xl font-semibold mt-1">
            ₹{stats.totalReceived.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-soft p-4 mb-6 flex items-center justify-between">
        <span className="text-sm text-ink/60">Total payments received</span>
        <span className="font-semibold">{stats.totalPayments}</span>
      </div>

      <h2 className="font-display font-semibold text-lg mb-3">Recent payments</h2>
      <div className="space-y-2">
        {stats.recentPayments.length === 0 && (
          <p className="text-sm text-ink/40">No payments yet. Share your QR code to start receiving.</p>
        )}
        {stats.recentPayments.map((txn) => (
          <Link
            key={txn._id}
            to={`/receipt/${txn._id}`}
            className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-soft"
          >
            <div>
              <p className="font-medium text-sm">{txn.sender?.name}</p>
              <p className="text-xs text-ink/40">
                {new Date(txn.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <p className="font-semibold text-sm text-mint-600">+₹{txn.amount.toLocaleString('en-IN')}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default MerchantDashboard;
