import { useId, useState } from "react";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoFocus = false,
  autoComplete,
}) {
  const [revealed, setRevealed] = useState(false);
  const id = useId();
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">{label}</span>
      <div className="relative mt-2">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border bg-white/70 px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 outline-none transition focus:ring-2 ${
            error
              ? "border-rust/50 focus:border-rust focus:ring-rust/20"
              : "border-ink/15 focus:border-gold focus:ring-gold/30"
          } ${isPassword ? "pr-16" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="absolute inset-y-0 right-0 flex items-center px-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink/40 transition hover:text-ink"
          >
            {revealed ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 font-sans text-xs text-rust">{error}</p>}
    </label>
  );
}
