const VARIANTS = {
  primary:
    "bg-ink text-paper hover:bg-ink2 disabled:hover:bg-ink",
  secondary:
    "bg-transparent text-ink border border-ink/15 hover:border-ink/30 hover:bg-ink/5",
  ghost:
    "bg-transparent text-ink/70 hover:text-ink hover:bg-ink/5",
  danger:
    "bg-rust text-paper hover:bg-rust/90",
};

export default function Button({
  children,
  onClick,
  disabled,
  loading = false,
  type = "button",
  variant = "primary",
  fullWidth = true,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-sans text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? "w-full" : ""
      } ${VARIANTS[variant]}`}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
