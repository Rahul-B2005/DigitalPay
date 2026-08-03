import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ArrowLeftRight, ScanLine, Receipt, User, LogOut, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItemsUser = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/send', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/history', label: 'History', icon: Receipt },
  { to: '/profile', label: 'Profile', icon: User },
];

const navItemsMerchant = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/merchant', label: 'Sales', icon: Store },
  { to: '/scan', label: 'Scan', icon: ScanLine },
  { to: '/history', label: 'History', icon: Receipt },
  { to: '/profile', label: 'Profile', icon: User },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = user?.role === 'merchant' ? navItemsMerchant : navItemsUser;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      <header className="sticky top-0 z-20 bg-indigo-950 text-white">
        <div className="max-w-md mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-mint flex items-center justify-center font-display font-bold text-indigo-950">
              D
            </div>
            <span className="font-display font-semibold tracking-tight text-lg">DigitalPay</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 pb-28 pt-5">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-indigo-950/10">
        <div className="max-w-md mx-auto grid grid-cols-5">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  isActive ? 'text-indigo-900' : 'text-ink/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
