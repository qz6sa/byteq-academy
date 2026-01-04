import { motion } from 'framer-motion';
import { FiArrowLeft, FiBookOpen, FiClock, FiBarChart2 } from 'react-icons/fi';

const PathCard = ({ path, onSelect, index }) => {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${path.color}15 0%, ${path.color}05 100%)`,
    borderTop: `3px solid ${path.color}`
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="glass-card group cursor-pointer hover:scale-[1.02] transition-all duration-300"
      style={gradientStyle}
      onClick={() => onSelect(path.id)}
    >
      <div className="flex items-center justify-between gap-6 p-8">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <motion.div
            className="text-7xl"
            style={{
              filter: `drop-shadow(0 0 20px ${path.color}99)`
            }}
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {path.icon}
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2 text-glow-primary">
            {path.title}
          </h2>
          <p className="text-sm text-gray-400 mb-1">
            {path.titleEn}
          </p>
          <p className="text-gray-300 mb-4 leading-relaxed">
            {path.description}
          </p>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <FiBookOpen className="text-primary" size={18} />
              <span className="text-gray-400">
                <strong className="text-white">{path.totalSubPaths}</strong> مسارات فرعية
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-secondary" size={18} />
              <span className="text-gray-400">
                <strong className="text-white">{path.durationRange}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiBarChart2 className="text-accent" size={18} />
              <span className="text-gray-400">
                <strong className="text-white">{path.levelRange}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex-shrink-0">
          <motion.button
            className="btn-gradient-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
            whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${path.color}66` }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: `linear-gradient(135deg, ${path.color} 0%, ${path.color}cc 100%)`
            }}
          >
            <span>استكشف المسار</span>
            <FiArrowLeft />
          </motion.button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          border: `2px solid ${path.color}`,
          boxShadow: `0 20px 60px ${path.color}40`
        }}
      />
    </motion.div>
  );
};

export default PathCard;
