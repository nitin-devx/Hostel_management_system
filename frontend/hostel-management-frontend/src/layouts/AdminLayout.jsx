import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/index.js';
import {
  FiHome, FiList, FiGrid, FiUsers, FiLogOut, FiShield, FiMenu, FiX, FiCheckSquare
} from 'react-icons/fi';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard',    to: ROUTES.ADMIN_DASHBOARD,    icon: FiHome },
  { label: 'Hostels',      to: ROUTES.ADMIN_HOSTELS,      icon: FiGrid },
  { label: 'Rooms',        to: ROUTES.ADMIN_ROOMS,        icon: FiList },
  { label: 'Applications', to: ROUTES.ADMIN_APPLICATIONS, icon: FiCheckSquare },
  { label: 'Students',     to: ROUTES.ADMIN_STUDENTS,     icon: FiUsers },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN); };

  const SidebarContent = () => (
    <>
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <FiShield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">HostelMS</span>
        </div>
        <p className="text-xs text-primary-600 font-medium mt-0.5 ml-9">Admin Panel</p>
      </div>

      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-primary-600 font-medium">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <FiLogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-100 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-end px-4 py-4">
              <button onClick={() => setSidebarOpen(false)}><FiX className="w-5 h-5" /></button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <FiMenu className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-900">HostelMS Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;