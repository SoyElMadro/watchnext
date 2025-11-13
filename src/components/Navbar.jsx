import { Link, useLocation } from 'react-router-dom';
import { Film, List, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/lists', label: 'Mis Listas', icon: List },
];

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 z-30 w-full backdrop-blur-md bg-gray-900/80 border-b border-gray-800"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="Inicio">
            <img
              src="/icons/logo.png"
              alt="WatchNext logo"
              className="w-10 h-10 rounded-md object-cover"
            />
            <span className="lg:text-2xl font-bold text-white tracking-tight">
              WatchNext
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${isActive(to)
                  ? 'text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/70'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className='max-md:text-sm'>{label}</span>

                {/* Active underline indicator */}
                {isActive(to) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
