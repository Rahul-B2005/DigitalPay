import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const businessCategories = ['retail', 'grocery', 'food', 'fashion', 'electronics', 'services', 'other'];

const Register = () => {
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    businessCategory: 'retail',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...form, role });
      login(data.user, data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center font-display font-bold text-indigo-950 text-lg">
            D
          </div>
          <span className="font-display font-semibold text-2xl text-white tracking-tight">DigitalPay</span>
        </div>

        <h1 className="font-display text-3xl font-semibold text-white mb-2">Create account</h1>
        <p className="text-white/50 mb-6">Get a wallet with ₹500 welcome balance.</p>

        <div className="flex rounded-xl bg-white/10 p-1 mb-6">
          {['user', 'merchant'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                role === r ? 'bg-mint text-indigo-950' : 'text-white/60'
              }`}
            >
              {r === 'user' ? 'Personal' : 'Merchant'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mint"
          />
          <input
            type="email"
            required
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mint"
          />
          <input
            type="tel"
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mint"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mint"
          />

          {role === 'merchant' && (
            <>
              <input
                type="text"
                required
                placeholder="Business name"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mint"
              />
              <select
                value={form.businessCategory}
                onChange={(e) => setForm({ ...form, businessCategory: e.target.value })}
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-mint capitalize"
              >
                {businessCategories.map((c) => (
                  <option key={c} value={c} className="text-ink">
                    {c}
                  </option>
                ))}
              </select>
            </>
          )}

          {error && <p className="text-coral text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-mint text-indigo-950 font-semibold py-3.5 mt-2 hover:bg-mint-400 transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-white/50 text-sm text-center mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-mint font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
