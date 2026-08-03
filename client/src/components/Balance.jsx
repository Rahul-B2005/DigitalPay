export default function Balance({ value, loading }) {
  const formatted =
    typeof value === "number"
      ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "0.00";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-ink px-8 py-7 text-paper shadow-card">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.08]" />
      <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-gold2/80">
        Available balance
      </p>
      {loading ? (
        <div className="relative mt-3 h-10 w-40 animate-pulse rounded-lg bg-paper/10 sm:h-12 sm:w-56" />
      ) : (
        <p className="relative mt-2 font-mono text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
          ₹{formatted}
        </p>
      )}
    </div>
  );
}
