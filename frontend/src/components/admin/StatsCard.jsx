import { motion } from 'framer-motion';

const StatsCard = ({ icon, title, value, subtitle, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card group hover:scale-105 transition-transform duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform duration-300`}>
          {icon}
        </div>
        {subtitle && (
          <span className="text-success text-sm font-semibold">
            {subtitle}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </p>
    </motion.div>
  );
};

export default StatsCard;
