# 🎨 ByTeq Academy Frontend - دليل البناء الكامل

## ✅ ما تم إنجازه:
- ✅ إنشاء مشروع Vite + React
- ✅ تثبيت جميع المكتبات (React Router, Axios, Tailwind, Framer Motion، إلخ)
- ✅ إعداد Tailwind CSS مع الألوان والتدرجات
- ✅ إنشاء هيكل المجلدات الكامل
- ✅ إعداد Axios مع جميع API Endpoints
- ✅ CSS الشامل مع Glassmorphism والتأثيرات

---

## 📂 الملفات المتبقية (إنشاؤها يدوياً):

### 1️⃣ Context & State Management

#### `src/context/AuthContext.jsx`
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.data);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.data);
      toast.success('مرحباً بك! 🎉');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.data);
      toast.success('تم التسجيل بنجاح! 🎉');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('تم تسجيل الخروج');
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateMe(data);
      setUser(response.data);
      toast.success('تم تحديث الملف الشخصي');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

### 2️⃣ Common Components

#### `src/components/common/Button.jsx`
```jsx
import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
}) => {
  const variants = {
    primary: 'btn-gradient-primary',
    secondary: 'btn-gradient-secondary',
    accent: 'btn-gradient-accent',
    success: 'bg-gradient-to-r from-success to-green-400',
    danger: 'bg-gradient-to-r from-danger to-red-500',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent',
    ghost: 'bg-transparent hover:bg-white/10',
  };

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-8 text-base',
    lg: 'py-4 px-10 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-xl font-bold transition-all duration-300
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading ? (
        <div className="spinner w-5 h-5 border-2" />
      ) : (
        <>
          {Icon && <Icon className="text-xl" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
```

#### `src/components/common/Input.jsx`
```jsx
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  success,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold mb-2 text-gray-300">
          {label}
          {required && <span className="text-danger mr-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="text-xl" />
          </div>
        )}
        
        <input
          type={isPassword && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            input-glass
            ${Icon ? 'pr-12' : ''}
            ${isPassword ? 'pl-12' : ''}
            ${error ? 'border-danger focus:ring-danger' : ''}
            ${success ? 'border-success focus:ring-success' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-danger text-sm mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      
      {success && (
        <p className="text-success text-sm mt-1 flex items-center gap-1">
          <span>✓</span> {success}
        </p>
      )}
    </div>
  );
};

export default Input;
```

#### `src/components/common/Card.jsx`
```jsx
import { motion } from 'framer-motion';

const Card = ({ children, hover = true, className = '', onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className={`glass-card p-6 ${hover ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
```

---

### 3️⃣ Navbar Component

#### `src/components/common/Navbar.jsx`
```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiBook, FiAward, FiLogOut, FiSettings } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الدورات', path: '/courses' },
    { name: 'من نحن', path: '/about' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow-primary">
              <span className="text-2xl font-bold">B</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-glow-primary">ByTeq Academy</h1>
              <p className="text-xs text-gray-400">أكاديمية الأمن السيبراني</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-primary transition-colors font-semibold"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl hover:shadow-glow-primary transition-all"
                >
                  <img
                    src={user?.profile?.avatar || '/default-avatar.png'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-primary"
                  />
                  <span className="font-semibold">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-56 glass-card rounded-xl shadow-card-hover p-2"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiUser className="text-primary" />
                        <span>الملف الشخصي</span>
                      </Link>
                      <Link
                        to="/my-courses"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiBook className="text-primary" />
                        <span>دوراتي</span>
                      </Link>
                      <Link
                        to="/certificates"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiAward className="text-primary" />
                        <span>شهاداتي</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FiSettings className="text-primary" />
                          <span>لوحة التحكم</span>
                        </Link>
                      )}
                      <hr className="my-2 border-white/10" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-danger/10 rounded-lg transition-colors w-full text-danger"
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
                  <button className="px-6 py-2 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                    تسجيل الدخول
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn-gradient-primary">
                    إنشاء حساب
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-primary"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="my-2 border-white/10" />
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="block px-4 py-3 hover:bg-white/5 rounded-lg">
                      الملف الشخصي
                    </Link>
                    <Link to="/my-courses" className="block px-4 py-3 hover:bg-white/5 rounded-lg">
                      دوراتي
                    </Link>
                    <Link to="/certificates" className="block px-4 py-3 hover:bg-white/5 rounded-lg">
                      شهاداتي
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-3 hover:bg-white/5 rounded-lg">
                        لوحة التحكم
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-right px-4 py-3 hover:bg-danger/10 rounded-lg text-danger"
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-3">
                      <button className="w-full border-2 border-primary text-primary py-2 rounded-xl">
                        تسجيل الدخول
                      </button>
                    </Link>
                    <Link to="/register" className="block px-4 py-3">
                      <button className="w-full btn-gradient-primary">
                        إنشاء حساب
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## 📝 **الملفات المتبقية:**

بسبب الحجم الكبير جداً (60+ ملف متبقي)، سأعطيك:

1. ✅ **الأساسيات جاهزة** (API, Context, Navbar, Button, Input, Card)
2. 📦 **كيفية الإكمال:**

### خطوات سريعة للإكمال:

```bash
# 1. أنشئ App.jsx مع React Router
# 2. أنشئ الصفحات الأساسية (Home, Courses, Login, Register)
# 3. أنشئ components المنزل (Hero, FeaturedCourses, Stats)
# 4. أنشئ CourseCard و CourseList
# 5. استمر بالترتيب حسب الأولوية
```

### أهم الصفحات للبدء:

1. **App.jsx** - Router رئيسي
2. **Home.jsx** - الصفحة الرئيسية
3. **Login.jsx** و **Register.jsx**
4. **Courses.jsx** - عرض الدورات
5. **CourseDetails.jsx** - تفاصيل الدورة

هل تريدني أن أستمر بإنشاء الملفات المتبقية؟ سأحتاج لتقسيمها على عدة استجابات.

---

## 🚀 تشغيل المشروع:

```bash
cd "C:\Users\sndja\OneDrive\Desktop\ByTeq Academy\frontend"
npm run dev
```

سيفتح على: http://localhost:5173
