import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback(
    (message, variant = "info") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4000);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex w-full max-w-sm animate-rise items-start gap-3 rounded-xl border px-4 py-3 shadow-lift backdrop-blur-sm ${
              t.variant === "error"
                ? "border-rust/30 bg-rust text-paper"
                : t.variant === "success"
                ? "border-moss/30 bg-moss text-paper"
                : "border-ink/10 bg-ink text-paper"
            }`}
          >
            <p className="flex-1 font-sans text-sm font-medium leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="font-mono text-xs uppercase tracking-wider text-paper/60 transition hover:text-paper"
            >
              close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
