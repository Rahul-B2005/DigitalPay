const ENTRIES = [
  { name: "A. Rao", amount: "+ 2,400.00", dir: "in" },
  { name: "S. Iyer", amount: "- 850.00", dir: "out" },
  { name: "M. Chen", amount: "+ 1,120.50", dir: "in" },
  { name: "K. Osei", amount: "- 300.00", dir: "out" },
  { name: "P. Nair", amount: "+ 6,000.00", dir: "in" },
  { name: "R. Fields", amount: "- 75.25", dir: "out" },
  { name: "D. Alavi", amount: "+ 940.00", dir: "in" },
  { name: "L. Grant", amount: "- 1,250.00", dir: "out" },
];

function Row({ entry }) {
  return (
    <div className="flex items-center justify-between border-b border-paper/10 py-3.5">
      <div className="flex items-center gap-3">
        <span
          className={`h-1.5 w-1.5 rounded-full ${entry.dir === "in" ? "bg-moss" : "bg-rust"}`}
        />
        <span className="font-sans text-sm text-paper/70">{entry.name}</span>
      </div>
      <span
        className={`font-mono text-sm font-medium ${
          entry.dir === "in" ? "text-gold2" : "text-paper/50"
        }`}
      >
        {entry.amount}
      </span>
    </div>
  );
}

export default function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-ink lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.15]" />

      <div className="relative">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-paper">Ledger</span>
        </div>
        <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-paper/50">
          Every rupee that moves through your account, recorded the moment it happens.
        </p>
      </div>

      <div className="relative mt-10 flex-1 overflow-hidden rounded-2xl border border-paper/10 bg-white/[0.03] px-6 py-2">
        <p className="border-b border-paper/10 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/30">
          Live passbook
        </p>
        <div className="relative h-64 overflow-hidden">
          <div className="animate-ticker absolute inset-x-0 top-0">
            {[...ENTRIES, ...ENTRIES].map((e, i) => (
              <Row key={i} entry={e} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent" />
        </div>
      </div>

      <p className="relative mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/30">
        Built with MERN — MongoDB · Express · React · Node
      </p>
    </div>
  );
}
