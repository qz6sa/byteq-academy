import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiBookOpen, FiUsers, FiStar, FiGrid, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const sidebarLinks = [
    { name: 'لوحة التحكم', path: '/admin', icon: <FiHome /> },
    { name: 'الدورات', path: '/admin/courses', icon: <FiBookOpen /> },
    { name: 'التصنيفات', path: '/admin/categories', icon: <FiGrid /> },
    { name: 'المستخدمين', path: '/admin/users', icon: <FiUsers /> },
    { name: 'المراجعات', path: '/admin/reviews', icon: <FiStar /> },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e]">
      {/* Sidebar */}
      <aside className="w-64 glass-card rounded-none border-l border-white/10 h-screen sticky top-0">
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold">B</span>
            </div>
            <div>
              <h2 className="font-bold text-glow-primary">ByTeq Admin</h2>
              <p className="text-xs text-gray-400">لوحة التحكم</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${
                        isActive
                          ? 'bg-primary/20 text-primary border-r-4 border-primary'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <FiLogOut />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
