import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import BrandPanel from "../components/BrandPanel.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/user/signin`, { username, password });
      localStorage.setItem("token", res.data.token);
      showToast(`Welcome back, ${res.data.user.firstName}.`, "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign in. Check your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm animate-rise">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Sign in to Ledger</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <InputField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ada.lovelace"
              autoFocus
              autoComplete="username"
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              error={error}
            />

            <Button type="submit" loading={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center font-sans text-sm text-ink/60">
            New to Ledger?{" "}
            <Link to="/signup" className="font-medium text-ink underline decoration-gold underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
