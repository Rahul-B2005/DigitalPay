import Appbar from "../components/Appbar.jsx";
import Transactions from "../components/Transactions.jsx";
import useAccount from "../hooks/useAccount.js";

export default function Activity() {
  const { firstName } = useAccount();

  return (
    <div className="min-h-screen bg-paper">
      <Appbar firstName={firstName} />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/40">Activity</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Everything you've sent and received</h1>
        <p className="mt-1 font-sans text-sm text-ink/50">Showing your most recent 20 transfers.</p>

        <div className="mt-6 animate-rise">
          <Transactions />
        </div>
      </div>
    </div>
  );
}
