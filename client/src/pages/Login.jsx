import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        <div className="flex items-center gap-2 mb-10">
          <div className="h-10 w-10 rounded-xl bg-mint flex items-center justify-center font-display font-bold text-indigo-950 text-lg">
            D
          </div>
          <span className="font-display font-semibold text-2xl text-white tracking-tight">DigitalPay</span>
        </div>

        <h1 className="font-display text-3xl font-semibold text-white mb-2">Welcome back</h1>
        <p className="text-white/50 mb-8">Log in to send money, pay bills, and more.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Email or phone number</label>
            <input
              type="text"
              required
              value={form.emailOrPhone}
              onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mint"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mint"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-coral text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-mint text-indigo-950 font-semibold py-3.5 mt-2 hover:bg-mint-400 transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-white/50 text-sm text-center mt-8">
          New here?{' '}
          <Link to="/register" className="text-mint font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
