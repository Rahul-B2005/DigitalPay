import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCents } from "../utils/money.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/transactions?limit=5")
      .then((res) => setRecent(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Signature element: a physical-card-style balance display */}
      <div className="rounded-2xl bg-ink text-white p-7 mb-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0 22px, #ffffff 22px 23px)",
          }}
        />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-3">Available balance</p>
          <p className="font-mono tabular-figures text-4xl font-600 mb-6">
            {formatCents(user.balanceCents)}
          </p>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span className="font-mono">@{user.walletTag}</span>
            <span>{user.name}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-10">
        <Link
          to="/send"
          className="flex-1 text-center bg-ink text-white rounded-md py-2.5 text-sm font-medium hover:bg-black transition-colors"
        >
          Send money
        </Link>
        <Link
          to="/add-money"
          className="flex-1 text-center border border-line rounded-md py-2.5 text-sm font-medium hover:border-ink transition-colors"
        >
          Add money
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-600 text-sm">Recent activity</h2>
          <Link to="/history" className="text-xs text-accent font-medium">
            View all
          </Link>
        </div>

        {loading && <p className="text-sm text-muted">Loading…</p>}
        {!loading && recent.length === 0 && (
          <p className="text-sm text-muted">No transactions yet — send or add money to get started.</p>
        )}

        <div className="rounded-lg border border-line divide-y divide-line overflow-hidden">
          {recent.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-4 py-3 bg-surface">
              <div>
                <p className="text-sm font-medium">
                  {tx.type === "TOPUP" ? "Top-up" : tx.direction === "OUT" ? `To ${tx.counterparty.name}` : `From ${tx.counterparty.name}`}
                </p>
                <p className="text-xs text-muted">{new Date(tx.createdAt).toLocaleString()}</p>
              </div>
              <span
                className={`font-mono tabular-figures text-sm font-600 ${
                  tx.direction === "OUT" ? "text-debit" : "text-credit"
                }`}
              >
                {tx.direction === "OUT" ? "−" : "+"}
                {formatCents(tx.amountCents)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
