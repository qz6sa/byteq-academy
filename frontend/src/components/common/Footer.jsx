import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin, FiSend } from 'react-icons/fi';
import { SiDiscord } from 'react-icons/si';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الدورات', path: '/courses' },
    { name: 'الخطط التعليمية', path: '/learning-paths' },
    { name: 'من نحن', path: '/about' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  const helpLinks = [
    { name: 'الأسئلة الشائعة', path: '/faq' },
    { name: 'سياسة الخصوصية', path: '/privacy' },
    { name: 'الشروط والأحكام', path: '/terms' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <FiFacebook />, url: '#', name: 'Facebook', color: '#1877f2' },
    { icon: <FiTwitter />, url: '#', name: 'Twitter', color: '#1da1f2' },
    { icon: <FiInstagram />, url: '#', name: 'Instagram', color: '#e4405f' },
    { icon: <FiLinkedin />, url: '#', name: 'LinkedIn', color: '#0a66c2' },
    { icon: <FiYoutube />, url: '#', name: 'YouTube', color: '#ff0000' },
    { icon: <SiDiscord />, url: '#', name: 'Discord', color: '#5865f2' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('يرجى إدخال بريدك الإلكتروني');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('البريد الإلكتروني غير صحيح');
      return;
    }
    
    // Simulate API call
    toast.success('تم الاشتراك بنجاح! 🎉');
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-[#0f0f0f] to-[#000] border-t border-white/10">
      <div className="container-custom py-8 md:py-10 lg:py-12 px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-4 mb-8 md:mb-10">
          
          {/* Column 1: حول ByTeq */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/imges/logo.png" 
                alt="ByTeq Academy" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-glow-primary">ByTeq Academy</h3>
                <p className="text-xs text-gray-400">أكاديمية الأمن السيبراني</p>
              </div>
            </div>
            <p className="text-gray-400 mb-5 text-sm leading-relaxed">
              منصة تعليمية عربية رائدة في الأمن السيبراني والبرمجة. نقدم دورات احترافية لتطوير مهاراتك في عالم التقنية.
            </p>
            
            {/* Social Media */}
            <h4 className="text-sm font-bold mb-3 text-gray-300">تابعنا</h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-card flex items-center justify-center 
                           hover:border-primary/50 transition-all group"
                  title={social.name}
                >
                  <span className="text-gray-400 group-hover:text-primary transition-colors">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: روابط سريعة */}
          <div>
            <h4 className="text-base font-bold mb-4 text-primary">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary 
                                   transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: المساعدة والدعم */}
          <div>
            <h4 className="text-base font-bold mb-4 text-secondary">المساعدة والدعم</h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary 
                                   transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: النشرة البريدية */}
          <div>
            <h4 className="text-base font-bold mb-4 text-accent">ابقَ على اطلاع</h4>
            <p className="text-gray-400 mb-3 text-sm leading-relaxed">
              اشترك لتصلك آخر الدورات والعروض الحصرية
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="w-full px-4 py-3 rounded-lg bg-dark-light border border-white/10 
                           focus:border-primary focus:outline-none transition-all pr-12 text-sm"
                />
                <FiSend className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              </div>
              <button
                type="submit"
                className="w-full btn-primary py-3 px-6 text-sm"
              >
                اشترك الآن
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-3">
              نحترم خصوصيتك. لن نرسل spam.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-2 pt-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          {/* Copyright */}
          <p className="text-gray-400 text-sm text-center md:text-right leading-relaxed">
            © {new Date().getFullYear()} <span className="text-primary font-bold">ByTeq Academy</span>. جميع الحقوق محفوظة.
          </p>

          {/* Legal Links */}
          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
