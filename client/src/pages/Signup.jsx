import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import BrandPanel from "../components/BrandPanel.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      const res = await axios.post(`${API_BASE_URL}/user/signup`, {
        firstName,
        lastName,
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      showToast(`Account created — welcome, ${res.data.user.firstName}.`, "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm animate-rise">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">Open an account</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Join Ledger</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ada"
                autoFocus
                autoComplete="given-name"
              />
              <InputField
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Lovelace"
                autoComplete="family-name"
              />
            </div>
            <InputField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ada.lovelace"
              autoComplete="username"
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              error={error}
            />

            <Button type="submit" loading={loading}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center font-sans text-sm text-ink/60">
            Already have an account?{" "}
            <Link to="/signin" className="font-medium text-ink underline decoration-gold underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
