import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GitBranch, History, Home, Cpu } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Analyze', path: '/analyze', icon: Cpu },
    { label: 'History', path: '/history', icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-indigo-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-dark-800 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold gradient-text">AI Review</span>
              <span className="text-xs text-dark-200 block -mt-0.5">Engineering Assistant</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive(item.path)
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-dark-200 hover:text-white hover:bg-dark-600/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-dark-200 hover:text-white rounded-lg hover:bg-dark-600/50 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-indigo-500/10 bg-dark-800/95 backdrop-blur-xl">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive(item.path)
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-dark-200 hover:text-white hover:bg-dark-600/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
