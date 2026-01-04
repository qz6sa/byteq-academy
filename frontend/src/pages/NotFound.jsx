import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiBookOpen, FiTarget, FiHelpCircle, FiMail, FiSearch } from 'react-icons/fi';
import { useState } from 'react';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const quickLinks = [
    { icon: FiHome, title: 'الرئيسية', desc: 'العودة للصفحة الرئيسية', path: '/', color: '#00d4ff' },
    { icon: FiBookOpen, title: 'الدورات', desc: 'تصفح جميع الدورات', path: '/courses', color: '#7b2cbf' },
    { icon: FiTarget, title: 'الخطط التعليمية', desc: 'اختر مسارك التعليمي', path: '/learning-paths', color: '#ff006e' },
    { icon: FiHelpCircle, title: 'مركز المساعدة', desc: 'الأسئلة الشائعة', path: '/faq', color: '#06ffa5' },
    { icon: FiMail, title: 'تواصل معنا', desc: 'احصل على المساعدة', path: '/contact', color: '#ffbe0b' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center relative overflow-hidden">
      
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container-custom py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-8"
          >
            <div className="text-[200px] md:text-[300px] font-black leading-none text-gradient opacity-20">
              404
            </div>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
            className="text-8xl mb-8 -mt-32"
          >
            🔍
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-glow-primary"
          >
            الصفحة غير موجودة
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            عذراً! الصفحة التي تبحث عنها غير موجودة 😕
          </motion.p>

          {/* Explanation Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto glass-card p-8 mb-12"
          >
            <p className="text-lg font-bold mb-4 text-primary">
              يبدو أنك تائه في الفضاء السيبراني! 🚀
            </p>
            <p className="text-gray-300 mb-4">قد يكون السبب:</p>
            <ul className="text-gray-400 text-right space-y-2">
              <li>• الرابط قديم أو تم حذفه</li>
              <li>• خطأ في كتابة العنوان</li>
              <li>• الصفحة انتقلت لمكان آخر</li>
            </ul>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-xl mx-auto mb-12"
          >
            <p className="text-lg font-bold mb-4">أو ابحث عما تريد:</p>
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن الدورات..."
                className="w-full px-12 py-4 rounded-xl bg-dark-light border border-white/10 
                         focus:border-primary focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 btn-primary px-6 py-2"
              >
                بحث
              </button>
            </form>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-2xl font-bold mb-8">روابط سريعة</h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className="block glass-card p-6 hover:border-primary/50 transition-all group"
                  >
                    <link.icon
                      className="text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform"
                      style={{ color: link.color }}
                    />
                    <h4 className="font-bold text-lg mb-2" style={{ color: link.color }}>
                      {link.title}
                    </h4>
                    <p className="text-sm text-gray-400">{link.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 max-w-2xl mx-auto glass-card p-6 bg-warning/10 border-warning/30"
          >
            <p className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
              <span className="text-2xl">💡</span>
              هل تعلم؟
            </p>
            <p className="text-gray-300">
              خطأ 404 يعني "Not Found" - وهو أحد أشهر أكواد HTTP. تم اختيار الرقم 404 
              بشكل عشوائي في أوائل الإنترنت، وأصبح الآن رمزاً عالمياً للصفحات المفقودة!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
