import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiClock, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const inquiryTypes = [
    'استفسار عن دورة',
    'مشكلة تقنية',
    'اقتراح',
    'شراكة',
    'أخرى'
  ];

  const socialLinks = [
    { icon: '📘', name: 'Facebook', url: '#', color: '#1877f2' },
    { icon: '🐦', name: 'Twitter', url: '#', color: '#1da1f2' },
    { icon: '📸', name: 'Instagram', url: '#', color: '#e4405f' },
    { icon: '💼', name: 'LinkedIn', url: '#', color: '#0a66c2' },
    { icon: '📺', name: 'YouTube', url: '#', color: '#ff0000' },
    { icon: '💬', name: 'Discord', url: '#', color: '#5865f2' },
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!formData.type) newErrors.type = 'نوع الاستفسار مطلوب';
    if (!formData.subject.trim()) newErrors.subject = 'الموضوع مطلوب';
    if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('✅ تم إرسال رسالتك بنجاح! سنرد عليك خلال 24-48 ساعة');
      setFormData({ name: '', email: '', type: '', subject: '', message: '' });
      setErrors({});
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6 text-glow-primary"
            >
              تواصل معنا
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mb-4 text-gradient"
            >
              نحن هنا للإجابة على استفساراتك
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              سواء كان لديك سؤال عن الدورات، استفسار تقني، أو اقتراح لتحسين المنصة، فريقنا جاهز لمساعدتك.
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-8"
              >
                <h3 className="text-3xl font-bold mb-6 text-primary">أرسل رسالتك</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-white font-bold mb-2">
                      الاسم الكامل <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-dark-light border ${
                        errors.name ? 'border-danger' : 'border-white/10'
                      } focus:border-primary focus:outline-none transition-all`}
                      placeholder="أدخل اسمك الكامل"
                    />
                    {errors.name && (
                      <p className="text-danger text-sm mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white font-bold mb-2">
                      البريد الإلكتروني <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-dark-light border ${
                        errors.email ? 'border-danger' : 'border-white/10'
                      } focus:border-primary focus:outline-none transition-all`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="text-danger text-sm mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-white font-bold mb-2">
                      نوع الاستفسار <span className="text-danger">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-dark-light border ${
                        errors.type ? 'border-danger' : 'border-white/10'
                      } focus:border-primary focus:outline-none transition-all`}
                    >
                      <option value="">اختر نوع الاستفسار</option>
                      {inquiryTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-danger text-sm mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-white font-bold mb-2">
                      الموضوع <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-dark-light border ${
                        errors.subject ? 'border-danger' : 'border-white/10'
                      } focus:border-primary focus:outline-none transition-all`}
                      placeholder="موضوع الرسالة"
                    />
                    {errors.subject && (
                      <p className="text-danger text-sm mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-white font-bold mb-2">
                      الرسالة <span className="text-danger">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg bg-dark-light border ${
                        errors.message ? 'border-danger' : 'border-white/10'
                      } focus:border-primary focus:outline-none transition-all resize-none`}
                      placeholder="اكتب رسالتك هنا..."
                    />
                    {errors.message && (
                      <p className="text-danger text-sm mt-1 flex items-center gap-1">
                        <FiAlertCircle /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <FiSend />
                        إرسال الرسالة
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <div className="space-y-6">
                
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-8"
                >
                  <h3 className="text-2xl font-bold mb-6 text-primary">معلومات التواصل</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <FiMail className="text-primary text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-2">البريد الإلكتروني</h4>
                        <p className="text-gray-400">الدعم الفني: support@byteq.academy</p>
                        <p className="text-gray-400">الاستفسارات العامة: info@byteq.academy</p>
                        <p className="text-gray-400">الشراكات: partners@byteq.academy</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <FiClock className="text-success text-2xl mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white mb-2">وقت الرد</h4>
                        <p className="text-gray-400">نرد خلال 24-48 ساعة في أيام العمل</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Social Media */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-8"
                >
                  <h3 className="text-2xl font-bold mb-6 text-secondary">تابعنا على وسائل التواصل</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {socialLinks.map((social, idx) => (
                      <motion.a
                        key={idx}
                        href={social.url}
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-card p-4 text-center hover:border-primary/50 transition-all group"
                      >
                        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                          {social.icon}
                        </div>
                        <p className="text-xs text-gray-400">{social.name}</p>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-8 text-center"
                >
                  <FiCheckCircle className="text-warning text-4xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">قبل أن تراسلنا</h3>
                  <p className="text-gray-400 mb-4">
                    تحقق من صفحة الأسئلة الشائعة - قد تجد إجابة سؤالك هناك!
                  </p>
                  <a href="/faq" className="btn-primary inline-block px-6 py-3">
                    الأسئلة الشائعة
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
