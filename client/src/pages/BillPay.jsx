import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PinModal from '../components/PinModal';

const categoryLabels = {
  mobile_recharge: 'Mobile recharge',
  electricity: 'Electricity bill',
  dth: 'DTH recharge',
  gas: 'Gas bill',
  water: 'Water bill',
  broadband: 'Broadband bill',
  fastag: 'FASTag recharge',
};

const BillPay = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'mobile_recharge';
  const [billers, setBillers] = useState([]);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [payError, setPayError] = useState('');
  const [paying, setPaying] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/bills/billers?category=${category}`).then(({ data }) => setBillers(data.billers));
    setSelectedBiller(null);
    setSelectedPlanPrice(null);
    setAmount('');
  }, [category]);

  const handleSelectPlan = (plan) => {
    setSelectedPlanPrice(plan.price);
    setAmount(String(plan.price));
  };

  const handleConfirmPin = async (pin) => {
    setPaying(true);
    setPayError('');
    try {
      const { data } = await api.post('/bills/pay', {
        billerId: selectedBiller._id,
        consumerNumber,
        amount: Number(amount),
        pin,
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
      <div className="flex items-center gap-2 mb-5">
        {selectedBiller && (
          <button onClick={() => setSelectedBiller(null)} className="text-ink/50">
            <ChevronLeft size={22} />
          </button>
        )}
        <h1 className="font-display text-2xl font-semibold">{categoryLabels[category] || 'Pay bill'}</h1>
      </div>

      {!selectedBiller && (
        <div className="space-y-2">
          {billers.map((b) => (
            <button
              key={b._id}
              onClick={() => setSelectedBiller(b)}
              className="w-full flex items-center justify-between bg-white rounded-xl px-4 py-3.5 shadow-soft"
            >
              <span className="font-medium text-sm">{b.name}</span>
              <span className="text-xs text-ink/40">
                ₹{b.minAmount}–₹{b.maxAmount}
              </span>
            </button>
          ))}
          {billers.length === 0 && <p className="text-sm text-ink/40">No billers available in this category yet.</p>}
        </div>
      )}

      {selectedBiller && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white shadow-soft p-4">
            <p className="font-medium">{selectedBiller.name}</p>
            <p className="text-xs text-ink/40">
              Amount range ₹{selectedBiller.minAmount}–₹{selectedBiller.maxAmount}
            </p>
          </div>

          <div>
            <label className="block text-sm text-ink/60 mb-1.5">
              {category === 'mobile_recharge' ? 'Mobile number' : 'Consumer / account number'}
            </label>
            <input
              type="text"
              required
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="w-full rounded-xl border border-ink/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-900"
            />
          </div>

          {selectedBiller.plans && selectedBiller.plans.length > 0 && (
            <div>
              <label className="block text-sm text-ink/60 mb-1.5">Choose a plan</label>
              <div className="space-y-2">
                {selectedBiller.plans.map((plan) => (
                  <button
                    key={plan.price}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-3 shadow-soft text-left transition ${
                      selectedPlanPrice === plan.price
                        ? 'bg-indigo-900 text-white'
                        : 'bg-white text-ink'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm">₹{plan.price}</p>
                      <p className={`text-xs ${selectedPlanPrice === plan.price ? 'text-white/70' : 'text-ink/50'}`}>
                        {[plan.data, plan.calls, plan.sms, plan.validity].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    {plan.description && (
                      <span
                        className={`text-[10px] font-semibold uppercase rounded-full px-2 py-1 ${
                          selectedPlanPrice === plan.price ? 'bg-white/20 text-white' : 'bg-mint/30 text-indigo-900'
                        }`}
                      >
                        {plan.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-ink/60 mb-1.5">
              {selectedBiller.plans?.length > 0 ? 'Or enter custom amount' : 'Amount'}
            </label>
            <div className="flex items-center rounded-xl border border-ink/10 px-4 py-3">
              <span className="text-ink/40 mr-2">₹</span>
              <input
                type="number"
                min={selectedBiller.minAmount}
                max={selectedBiller.maxAmount}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setSelectedPlanPrice(null);
                }}
                placeholder="0"
                className="w-full outline-none text-lg font-medium"
              />
            </div>
          </div>

          <button
            onClick={() => setShowPin(true)}
            disabled={!consumerNumber || !amount || Number(amount) <= 0}
            className="w-full rounded-xl bg-mint text-indigo-950 font-semibold py-3.5 disabled:opacity-50"
          >
            Proceed to pay
          </button>
        </div>
      )}

      {showPin && (
        <PinModal
          amountLabel={`Pay ₹${Number(amount).toLocaleString('en-IN')} for ${selectedBiller.name}`}
          onClose={() => setShowPin(false)}
          onConfirm={handleConfirmPin}
          loading={paying}
          error={payError}
        />
      )}
    </Layout>
  );
};

export default BillPay;
