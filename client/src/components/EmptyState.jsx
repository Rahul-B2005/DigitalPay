export default function EmptyState({ title, hint }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
      <p className="font-display text-base font-semibold text-ink/70">{title}</p>
      {hint && <p className="max-w-xs font-sans text-sm text-ink/40">{hint}</p>}
    </div>
  );
}
