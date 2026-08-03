import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

const PRESETS = [10, 25, 50, 100];

export default function AddMoney() {
  const { refreshUser } = useAuth();
  const [amount, setAmount] = useState("25");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [params] = useSearchParams();
  const status = params.get("status");

  useEffect(() => {
    if (status === "success") {
      // The webhook credits the wallet server-side and may land a moment
      // after the redirect, so poll briefly rather than trusting the
      // redirect itself.
      const interval = setInterval(refreshUser, 1500);
      const timeout = setTimeout(() => clearInterval(interval), 8000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/payment/create-checkout-session", { amount });
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't start checkout");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <h1 className="font-display font-600 text-xl mb-1">Add money</h1>
      <p className="text-muted text-sm mb-8">
        Top up with a card via Stripe. This runs in <span className="font-medium">test mode</span> —
        no real charge occurs.
      </p>

      {status === "success" && (
        <div className="mb-6 rounded-md bg-credit/10 border border-credit/30 px-4 py-3 text-sm text-credit">
          Payment confirmed. Your balance is updating…
        </div>
      )}
      {status === "cancelled" && (
        <div className="mb-6 rounded-md bg-line px-4 py-3 text-sm text-muted">
          Checkout was cancelled — no charge was made.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setAmount(String(p))}
              className={`py-2 rounded-md text-sm font-mono border transition-colors ${
                amount === String(p) ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">Custom amount (USD)</label>
          <input
            type="number"
            min="1"
            max="1000"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-line rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-debit text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-white rounded-md py-2.5 text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
        >
          {submitting ? "Redirecting…" : "Continue to Stripe Checkout"}
        </button>

        <p className="text-xs text-muted text-center">
          Test card: 4242 4242 4242 4242 · any future date · any CVC
        </p>
      </form>
    </div>
  );
}
