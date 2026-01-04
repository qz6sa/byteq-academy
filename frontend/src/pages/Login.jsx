import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-glow-primary mb-2">تسجيل الدخول</h1>
            <p className="text-gray-400">أهلاً بعودتك إلى ByTeq Academy</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<FiMail />}
              required
            />

            <Input
              label="كلمة المرور"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<FiLock />}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="form-checkbox" />
                <span>تذكرني</span>
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              تسجيل الدخول
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-400 text-sm">أو</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400">
            <p>
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-primary hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 bg-primary/10 border-primary/30">
          <p className="text-sm text-gray-300 mb-2 font-semibold">حساب تجريبي للمدير:</p>
          <p className="text-xs text-gray-400">البريد: admin@byteqacademy.com</p>
          <p className="text-xs text-gray-400">كلمة المرور: admin123456</p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
