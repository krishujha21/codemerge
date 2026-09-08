import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  MapPin,
  CalendarDays,
  Trophy,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = () => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teams', label: 'All Teams', icon: Users },
    { to: '/shortlisted', label: 'Shortlisted', icon: ClipboardList },
    { to: '/checkin', label: 'Check-In', icon: MapPin },
    { to: '/attendance?day=1', label: 'Day 1', icon: CalendarDays },
    { to: '/attendance?day=2', label: 'Day 2', icon: CalendarDays },
    { to: '/attendance?day=3', label: 'Day 3', icon: CalendarDays },
    { to: '/finals', label: 'Finals', icon: Trophy },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary tracking-wide">CodeMerge 2025</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu}></div>
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-surface border-r border-border">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <h1 className="text-xl font-bold text-primary">CodeMerge</h1>
              <button onClick={toggleMobileMenu} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      onClick={toggleMobileMenu}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-surface/50 backdrop-blur-sm z-10">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 -ml-2 mr-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block text-slate-400 text-sm font-medium">
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="flex items-center text-sm font-medium text-slate-400 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-400/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
