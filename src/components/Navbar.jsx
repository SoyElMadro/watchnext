import { Link, useLocation } from 'react-router-dom';
import { List, Home } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Inicio', Icon: Home },
  { to: '/lists', label: 'Mis Listas', Icon: List },
];

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 z-50 w-full glass animate-fade-up"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group" aria-label="Inicio">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <img
                src="/icons/logo.png"
                alt="WatchNext logo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-accent/20 mix-blend-overlay group-hover:bg-accent/30 transition-colors duration-300" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">WatchNext</span>
              <div className="text-[10px] text-accent-hover font-medium tracking-widest uppercase">Streaming Discovery</div>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'text-white bg-accent/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive(to) ? 'text-accent' : ''}`} />
                <span className="text-sm">{label}</span>
                {isActive(to) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
