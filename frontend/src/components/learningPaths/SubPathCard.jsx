import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiCheckCircle, FiClock, FiBarChart2, FiArrowLeft } from 'react-icons/fi';
import { getLevelBadge } from '../../data/learningPathsData';

const SubPathCard = ({ subPath, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const levelBadge = getLevelBadge(subPath.level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card group hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 overflow-hidden"
      style={{
        border: `1px solid ${subPath.color}30`
      }}
    >
      {/* Header */}
      <div className="p-6">
        {/* Icon & Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-5xl"
              style={{
                filter: `drop-shadow(0 0 15px ${subPath.color}99)`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {subPath.icon}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold mb-1">{subPath.title}</h3>
              <p className="text-sm text-gray-400">{subPath.titleEn}</p>
            </div>
          </div>
          
          {/* Level Badge */}
          <span
            className={`badge badge-${levelBadge.color} text-xs px-3 py-1`}
          >
            {levelBadge.text}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {subPath.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs mb-4">
          <div className="flex items-center gap-1 text-gray-400">
            <FiClock size={14} />
            <span>{subPath.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <FiBarChart2 size={14} />
            <span>{subPath.relatedCoursesCount} دورة</span>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-primary hover:text-cyan-300 transition-colors font-semibold"
        >
          <span>{isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown size={18} />
          </motion.div>
        </button>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-6 space-y-4">
              {/* Key Points */}
              <div>
                <h4 className="text-sm font-bold mb-3 text-gray-300">
                  ✨ النقاط الرئيسية:
                </h4>
                <div className="space-y-2">
                  {subPath.keyPoints.map((point, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <FiCheckCircle
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: subPath.color }}
                        size={16}
                      />
                      <span className="text-sm text-gray-300 leading-relaxed">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${subPath.color} 0%, ${subPath.color}cc 100%)`,
                    color: 'white'
                  }}
                >
                  <span>ابدأ الآن</span>
                  <FiArrowLeft />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm border"
                  style={{
                    borderColor: subPath.color,
                    color: subPath.color
                  }}
                >
                  الدورات ذات الصلة
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 15px 40px ${subPath.color}30`
        }}
      />
    </motion.div>
  );
};

export default SubPathCard;
