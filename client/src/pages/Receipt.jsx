import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const typeLabels = {
  add_money: 'Added money',
  p2p_transfer: 'Money transfer',
  qr_payment: 'QR payment',
  merchant_payment: 'Merchant payment',
  bill_payment: 'Bill payment',
  withdraw: 'Withdrawal',
};

const Receipt = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [txn, setTxn] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/transactions/${id}`)
      .then(({ data }) => setTxn(data.transaction))
      .catch((err) => setError(err.response?.data?.message || 'Could not load transaction'));
  }, [id]);

  if (error) {
    return (
      <Layout>
        <p className="text-coral text-sm">{error}</p>
      </Layout>
    );
  }

  if (!txn) {
    return (
      <Layout>
        <p className="text-sm text-ink/40">Loading…</p>
      </Layout>
    );
  }

  const isSender = txn.sender?._id === user._id;
  const other = isSender ? txn.receiver : txn.sender;
  const otherName = other?.businessName || other?.name;

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="text-ink/50 mb-4">
        <ChevronLeft size={22} />
      </button>

      <div className="rounded-xl2 bg-white shadow-card p-8 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full bg-mint/15 flex items-center justify-center text-mint-600 mb-4">
          <CheckCircle2 size={32} />
        </div>
        <p className="text-ink/50 text-sm">{isSender ? 'Paid successfully' : 'Money received'}</p>
        <p className="font-display text-3xl font-semibold mt-1">₹{txn.amount.toLocaleString('en-IN')}</p>
        {otherName && (
          <p className="text-ink/60 mt-1">
            {isSender ? 'to' : 'from'} {otherName}
          </p>
        )}
        {txn.billerName && <p className="text-ink/60 mt-1">{txn.billerName}</p>}

        <div className="w-full border-t border-dashed border-ink/15 my-6" />

        <div className="w-full space-y-3 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-ink/40">Reference ID</span>
            <span className="font-mono">{txn.referenceId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/40">Type</span>
            <span className="capitalize">{typeLabels[txn.type] || txn.type}</span>
          </div>
          {txn.consumerNumber && (
            <div className="flex justify-between">
              <span className="text-ink/40">Consumer number</span>
              <span>{txn.consumerNumber}</span>
            </div>
          )}
          {txn.note && (
            <div className="flex justify-between">
              <span className="text-ink/40">Note</span>
              <span>{txn.note}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-ink/40">Date & time</span>
            <span>
              {new Date(txn.createdAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/40">Status</span>
            <span className="text-mint-600 font-medium capitalize">{txn.status}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Receipt;
