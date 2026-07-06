// layouts/MainLayout.jsx
// Shared shell for all authenticated pages: top bar with logo, simple nav
// links, and logout. Rendered once via a layout route so individual pages
// (Dashboard, Subjects, SubjectDetail, ...) don't each re-implement it.
//
// This is intentionally minimal — the full Navbar (profile image,
// notifications) and Sidebar (full nav with icons) are their own modules
// later in the build plan and will replace/extend this.

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiZap, FiLogOut, FiGrid, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
  }`;

export default function MainLayout() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('You have been logged out.', 'info');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <FiZap className="text-white" size={18} />
            </div>
            <span className="font-bold text-slate-800 hidden sm:inline">
              Student Learning Dashboard
            </span>
          </div>

          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <FiGrid size={15} />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>
            <NavLink to="/subjects" className={navLinkClass}>
              <FiBookOpen size={15} />
              <span className="hidden sm:inline">Subjects</span>
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-lg px-3.5 py-2 transition shrink-0"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
