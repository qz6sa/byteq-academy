import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiAward, FiTrendingUp } from 'react-icons/fi';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    {
      icon: <FiUsers className="text-4xl" />,
      number: 1250,
      label: 'طالب نشط',
      gradient: 'from-primary to-cyan-400',
      delay: 0,
    },
    {
      icon: <FiBookOpen className="text-4xl" />,
      number: 85,
      label: 'دورة تدريبية',
      gradient: 'from-secondary to-purple-400',
      delay: 0.1,
    },
    {
      icon: <FiAward className="text-4xl" />,
      number: 950,
      label: 'شهادة صادرة',
      gradient: 'from-accent to-pink-400',
      delay: 0.2,
    },
    {
      icon: <FiTrendingUp className="text-4xl" />,
      number: 98,
      suffix: '%',
      label: 'نسبة الرضا',
      gradient: 'from-success to-green-400',
      delay: 0.3,
    },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ stat, isInView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = stat.number;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.number]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: stat.delay }}
      className="glass-card group hover:scale-105 transition-transform duration-300"
    >
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}>
        {stat.icon}
      </div>
      <h3 className="text-4xl font-bold mb-2">
        <span className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
          {count.toLocaleString()}
          {stat.suffix}
        </span>
      </h3>
      <p className="text-gray-400">{stat.label}</p>
    </motion.div>
  );
};

export default Stats;
