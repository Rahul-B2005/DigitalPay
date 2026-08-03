import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/send", label: "Send" },
  { to: "/add-money", label: "Add money" },
  { to: "/history", label: "History" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-surface">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-display font-700 text-lg tracking-tight">Ledger</span>
          <nav className="hidden sm:flex gap-6 text-sm font-medium">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  isActive ? "text-ink" : "text-muted hover:text-ink transition-colors"
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="font-mono text-xs text-muted hidden sm:inline">@{user.walletTag}</span>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm font-medium text-muted hover:text-debit transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
      <nav className="sm:hidden flex gap-4 px-6 pb-3 text-sm font-medium overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => (isActive ? "text-ink" : "text-muted")}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
