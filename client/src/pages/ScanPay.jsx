import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PinModal from '../components/PinModal';

const ScanPay = () => {
  const [tab, setTab] = useState('scan');
  const [myQr, setMyQr] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [payError, setPayError] = useState('');
  const [paying, setPaying] = useState(false);
  const scannerRef = useRef(null);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === 'myqr' && !myQr) {
      api.get('/wallet/my-qr').then(({ data }) => setMyQr(data));
    }
  }, [tab]);

  useEffect(() => {
    if (tab !== 'scan' || scanResult) return;

    const qr = new Html5Qrcode('qr-reader');
    scannerRef.current = qr;

    qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 220 },
      (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);
          if (parsed.qrCodeId) {
            setScanResult(parsed);
            qr.stop().catch(() => {});
          }
        } catch {
          setScanError('That QR code is not a valid DigitalPay payment code');
        }
      },
      () => {}
    ).catch(() => setScanError('Camera access denied. Please allow camera permissions.'));

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [tab, scanResult]);

  const handleConfirmPin = async (pin) => {
    setPaying(true);
    setPayError('');
    try {
      const { data } = await api.post('/payments/qr-pay', {
        qrCodeId: scanResult.qrCodeId,
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
      <h1 className="font-display text-2xl font-semibold mb-5">Scan & pay</h1>

      <div className="flex rounded-xl bg-white shadow-soft p-1 mb-5">
        {[
          { key: 'scan', label: 'Scan a code' },
          { key: 'myqr', label: 'My QR code' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setScanResult(null);
              setScanError('');
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-indigo-950 text-white' : 'text-ink/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'scan' && !scanResult && (
        <div className="rounded-xl overflow-hidden bg-black">
          <div id="qr-reader" className="w-full" />
          {scanError && <p className="text-coral text-sm p-3 bg-white">{scanError}</p>}
        </div>
      )}

      {tab === 'scan' && scanResult && (
        <div className="space-y-4">
          <p className="text-sm text-ink/60">Paying to a DigitalPay account. Enter amount to continue.</p>
          <div className="flex items-center rounded-xl border border-ink/10 px-4 py-3">
            <span className="text-ink/40 mr-2">₹</span>
            <input
              type="number"
              min="1"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full outline-none text-lg font-medium"
            />
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-full rounded-xl border border-ink/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-900"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setScanResult(null)}
              className="flex-1 rounded-xl border border-ink/10 font-semibold py-3.5"
            >
              Rescan
            </button>
            <button
              onClick={() => setShowPin(true)}
              disabled={!amount || Number(amount) <= 0}
              className="flex-1 rounded-xl bg-mint text-indigo-950 font-semibold py-3.5 disabled:opacity-50"
            >
              Pay now
            </button>
          </div>
        </div>
      )}

      {tab === 'myqr' && (
        <div className="rounded-xl bg-white shadow-card p-8 flex flex-col items-center">
          {myQr ? (
            <img src={myQr.qrDataUrl} alt="Your payment QR code" className="h-56 w-56" />
          ) : (
            <div className="h-56 w-56 flex items-center justify-center text-ink/30">Loading…</div>
          )}
          <p className="text-sm text-ink/50 mt-4 text-center">
            Share this code so others can pay you directly to your DigitalPay wallet.
          </p>
        </div>
      )}

      {showPin && (
        <PinModal
          amountLabel={`Pay ₹${Number(amount).toLocaleString('en-IN')}`}
          onClose={() => setShowPin(false)}
          onConfirm={handleConfirmPin}
          loading={paying}
          error={payError}
        />
      )}
    </Layout>
  );
};

export default ScanPay;
