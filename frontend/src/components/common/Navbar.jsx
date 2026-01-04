import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiBookmark, FiAward, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الخطط التعليمية', path: '/learning-paths' },
    { name: 'الدورات', path: '/courses' },
    ...(user ? [{ name: 'دوراتي', path: '/my-courses' }] : []),
    ...(user ? [{ name: 'شهاداتي', path: '/certificates' }] : []),
  ];

  const userMenuItems = [
    { name: 'الملف الشخصي', path: '/profile', icon: <FiUser /> },
    { name: 'دوراتي', path: '/my-courses', icon: <FiBookmark /> },
    { name: 'شهاداتي', path: '/certificates', icon: <FiAward /> },
    ...(user?.role === 'admin' ? [{ name: 'لوحة التحكم', path: '/admin', icon: <FiSettings /> }] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-card rounded-none border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/imges/logo.png" 
              alt="ByTeq Academy" 
              className="w-40 h-40 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-glow-primary">ByTeq Academy</h1>
              <p className="text-xs text-gray-400">أكاديمية الأمن السيبراني</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  text-lg font-medium transition-all duration-300
                  ${
                    location.pathname === link.path
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-300 hover:text-primary'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 glass-card p-3 hover:border-primary/50 transition-all"
                >
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-right">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role === 'admin' ? 'مدير' : 'طالب'}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-64 glass-card"
                    >
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <span className="text-primary">{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-500 transition-colors border-t border-white/10"
                      >
                        <FiLogOut />
                        <span>تسجيل الخروج</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    إنشاء حساب
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-white/10"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block py-3 px-4 rounded-lg mb-2
                    ${location.pathname === link.path ? 'bg-primary/20 text-primary' : 'text-gray-300'}
                  `}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="border-t border-white/10 my-4 pt-4">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 text-gray-300 hover:text-primary"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/20 text-red-500 rounded-lg"
                  >
                    <FiLogOut />
                    <span>تسجيل الخروج</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      تسجيل الدخول
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      إنشاء حساب
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
