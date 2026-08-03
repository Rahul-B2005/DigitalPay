import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "./Avatar.jsx";

const navLinkClass = ({ isActive }) =>
  `font-sans text-sm font-medium transition ${
    isActive ? "text-ink" : "text-ink/50 hover:text-ink"
  }`;

export default function Appbar({ firstName }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  }

  return (
    <div className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-8">
          <span className="font-display text-xl font-semibold text-ink">Ledger</span>
          <nav className="hidden items-center gap-6 sm:flex">
            <NavLink to="/dashboard" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/activity" className={navLinkClass}>
              Activity
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-sans text-sm text-ink/70 sm:inline">Hi, {firstName}</span>
          <Avatar name={firstName || "?"} />
          <button
            onClick={handleLogout}
            className="font-sans text-sm font-medium text-ink/60 underline decoration-ink/20 underline-offset-4 transition hover:text-rust"
          >
            Log out
          </button>
        </div>
      </div>
      <nav className="flex items-center gap-6 border-t border-ink/5 px-4 py-2.5 sm:hidden">
        <NavLink to="/dashboard" end className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/activity" className={navLinkClass}>
          Activity
        </NavLink>
      </nav>
    </div>
  );
}
