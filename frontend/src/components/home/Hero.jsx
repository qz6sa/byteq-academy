import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { FiPlay, FiArrowLeft } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="badge badge-primary">
                🚀 أكثر من 1000+ طالب انضموا إلينا
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-glow-primary">تعلم</span>{' '}
              <span className="bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent">
                الأمن السيبراني
              </span>
              <br />
              <span className="text-white">من الصفر</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              انضم إلى أكاديمية ByTeq واحترف مجال الأمن السيبراني والقرصنة الأخلاقية
              مع أفضل المدربين والدورات العملية التطبيقية
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/courses">
                <Button variant="primary" size="lg" icon={<FiPlay />}>
                  ابدأ التعلم الآن
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" icon={<FiArrowLeft />}>
                  اعرف المزيد
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              <div>
                <p className="text-4xl font-bold text-primary mb-1">50+</p>
                <p className="text-gray-400">دورة تدريبية</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-secondary mb-1">1000+</p>
                <p className="text-gray-400">طالب</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-success mb-1">4.9</p>
                <p className="text-gray-400">تقييم الطلاب</p>
              </div>
            </div>
          </motion.div>

          {/* Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="glass-card p-8 relative z-10"
              >
                <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-6xl animate-pulse-glow">
                      🔐
                    </div>
                    <h3 className="text-2xl font-bold text-glow-primary mb-2">
                      Cybersecurity Expert
                    </h3>
                    <p className="text-gray-400">Your Journey Starts Here</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 glass-card p-4 w-48 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center text-2xl">
                    ⚡
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">شهادة معتمدة</p>
                    <p className="font-bold">Certificate</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -left-6 glass-card p-4 w-48 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">تدريب عملي</p>
                    <p className="font-bold">Practical</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
