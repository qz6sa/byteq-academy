import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTarget, FiZap, FiUsers, FiAward, FiTrendingUp, FiStar, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

const About = () => {
  const stats = [
    { icon: FiUsers, number: '10,000+', label: 'طالب نشط', color: '#00d4ff' },
    { icon: FiAward, number: '50+', label: 'دورة تدريبية', color: '#7b2cbf' },
    { icon: FiStar, number: '4.8/5', label: 'تقييم الطلاب', color: '#ffbe0b' },
    { icon: FiTrendingUp, number: '85%', label: 'معدل الإكمال', color: '#06ffa5' },
  ];

  const offerings = [
    {
      icon: '🎓',
      title: 'مسارات تعليمية متكاملة',
      points: [
        'البرمجة (Frontend، Backend، Full-Stack، Mobile، AI)',
        'الأمن السيبراني (Pentesting، Blue Team، DevSecOps، Malware Analysis)',
        'الشبكات (CCNA، Network Security، Cloud Networking)'
      ]
    },
    {
      icon: '💻',
      title: 'محتوى عملي وواقعي',
      points: [
        'دورات شاملة من المبتدئ إلى المحترف',
        'مشاريع عملية حقيقية',
        'امتحانات واختبارات تفاعلية',
        'شهادات معتمدة'
      ]
    },
    {
      icon: '🤝',
      title: 'دعم مستمر',
      points: [
        'مجتمع تعليمي نشط',
        'دعم فني متواصل',
        'تحديثات دورية للمحتوى'
      ]
    }
  ];

  const features = [
    { icon: '✅', title: 'محتوى عربي أصيل', desc: 'دورات مصممة خصيصاً للمتحدثين بالعربية' },
    { icon: '✅', title: 'خبراء متخصصون', desc: 'محتوى من ممارسين فعليين في المجال' },
    { icon: '✅', title: 'تعلم عملي', desc: 'نركز على المهارات الحقيقية المطلوبة في سوق العمل' },
    { icon: '✅', title: 'مرونة كاملة', desc: 'تعلم بالسرعة التي تناسبك' },
    { icon: '✅', title: 'أسعار مناسبة', desc: 'استثمر في مستقبلك بأقل تكلفة' },
  ];

  const values = [
    { icon: '⭐', title: 'الجودة أولاً', desc: 'نلتزم بتقديم محتوى عالي الجودة ومحدث دائماً' },
    { icon: '💎', title: 'الشفافية', desc: 'نؤمن بالوضوح في التعامل مع طلابنا' },
    { icon: '🚀', title: 'الابتكار', desc: 'نواكب أحدث التقنيات وأفضل الممارسات' },
    { icon: '🤝', title: 'المجتمع', desc: 'نبني مجتمعاً تعليمياً داعماً ومتفاعلاً' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow-primary"
            >
              من نحن
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-gradient"
            >
              نحن ByTeq - بوابتك لعالم الأمن السيبراني والتكنولوجيا
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              منصة تعليمية عربية رائدة في تدريس الأمن السيبراني، البرمجة، والشبكات
            </motion.p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 bg-black/20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 md:p-8 rounded-xl"
              >
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">رؤيتنا</h3>
                <p className="text-gray-300 leading-relaxed">
                  أن نكون المنصة العربية الرائدة في تعليم الأمن السيبراني والبرمجة، ونساهم في بناء جيل من الخبراء القادرين على حماية العالم الرقمي.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 md:p-8 rounded-xl"
              >
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-secondary">رسالتنا</h3>
                <p className="text-gray-300 leading-relaxed">
                  نوفر تعليماً عالي الجودة في مجالات الأمن السيبراني، البرمجة، والشبكات باللغة العربية، من خلال محتوى عملي ومنهجي يواكب أحدث التطورات التقنية.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-10 text-center rounded-xl"
            >
              <div className="text-5xl mb-6">⭐</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-glow-secondary">قصتنا</h2>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                انطلقت ByTeq من إيمان عميق بأن التعليم التقني يجب أن يكون متاحاً للجميع. في عالم يتزايد فيه التهديد السيبراني يوماً بعد يوم، أدركنا الحاجة الماسة لتدريب جيل جديد من خبراء الأمن السيبراني الناطقين بالعربية. بدأنا برؤية واضحة: تقديم محتوى تعليمي عربي احترافي يضاهي أفضل المنصات العالمية، مع التركيز على الجانب العملي والمهارات الحقيقية التي يحتاجها سوق العمل.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 bg-black/20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-glow-primary"
            >
              ماذا نقدم؟
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
              {offerings.map((offering, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 md:p-8 rounded-xl hover:border-primary/50 transition-all"
                >
                  <div className="text-5xl mb-4">{offering.icon}</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-primary">{offering.title}</h3>
                  <ul className="space-y-3">
                    {offering.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                        <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why ByTeq */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-glow-secondary"
            >
              لماذا ByTeq؟
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-5 md:p-6 flex items-start gap-4 rounded-xl hover:border-secondary/50 transition-all"
                >
                  <span className="text-2xl md:text-3xl">{feature.icon}</span>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-2 text-white">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-black/20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 md:p-8 text-center rounded-xl hover:scale-105 transition-transform"
                >
                  <stat.icon className="text-4xl md:text-5xl mx-auto mb-3 md:mb-4" style={{ color: stat.color }} />
                  <div className="text-2xl md:text-4xl font-bold mb-2" style={{ color: stat.color }}>
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-glow-primary"
            >
              قيمنا
            </motion.h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-5 md:p-6 text-center rounded-xl hover:border-primary/50 transition-all"
                >
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">{value.icon}</div>
                  <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-primary">{value.title}</h4>
                  <p className="text-gray-400 text-xs md:text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-20" />
          
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">انضم إلينا</h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                سواء كنت مبتدئاً تريد دخول عالم التقنية، أو محترفاً تسعى لتطوير مهاراتك، ByTeq هي وجهتك الصحيحة.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/register" className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2 hover:gap-3 transition-all">
                  ابدأ الآن
                  <FiArrowLeft />
                </Link>
                <Link to="/courses" className="glass-card px-8 py-4 text-lg hover:border-primary/50 transition-all rounded-lg">
                  تصفح الدورات
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
