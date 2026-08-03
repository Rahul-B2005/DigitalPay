import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import Avatar from "./Avatar.jsx";
import { SkeletonRow } from "./Skeleton.jsx";
import EmptyState from "./EmptyState.jsx";

function formatAmount(amount) {
  return Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatWhen(iso) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function Transactions({ limit }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const controller = new AbortController();

    axios
      .get(`${API_BASE_URL}/account/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then((res) => setTransactions(res.data.transactions))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const rows = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white/40">
      {loading && (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      )}
      {!loading && rows.length === 0 && (
        <EmptyState
          title="No activity yet"
          hint="Money you send or receive will show up here, newest first."
        />
      )}
      {!loading &&
        rows.map((t) => {
          const isSent = t.direction === "sent";
          const counterpartyName = `${t.counterparty.firstName} ${t.counterparty.lastName}`;
          return (
            <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={counterpartyName} size="sm" />
                <div>
                  <p className="font-sans text-sm font-medium text-ink">
                    {isSent ? `Sent to ${counterpartyName}` : `Received from ${counterpartyName}`}
                  </p>
                  <p className="font-mono text-xs text-ink/40">{formatWhen(t.createdAt)}</p>
                </div>
              </div>
              <span
                className={`font-mono text-sm font-semibold ${isSent ? "text-ink/60" : "text-moss"}`}
              >
                {isSent ? "−" : "+"}₹{formatAmount(t.amount)}
              </span>
            </div>
          );
        })}
    </div>
  );
}
