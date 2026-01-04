import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiBookOpen, FiTarget } from 'react-icons/fi';
import { learningPaths } from '../data/learningPathsData.js';

const LearningPaths = () => {
  const [selectedPath, setSelectedPath] = useState('programming');
  const [selectedNode, setSelectedNode] = useState(null);

  const currentPath = learningPaths.find(p => p.id === selectedPath);

  // Reorganize paths into structured layout
  const getPathStructure = () => {
    if (selectedPath === 'cybersecurity') {
      return {
        fundamental: currentPath?.subPaths[0], // Cybersecurity Fundamentals
        tracks: currentPath?.subPaths.slice(1) // Red, Blue, DevSecOps, Malware
      };
    } else if (selectedPath === 'networking') {
      return {
        fundamental: currentPath?.subPaths[0], // Networking Fundamentals
        tracks: currentPath?.subPaths.slice(1) // Other networking paths
      };
    } else {
      return {
        fundamental: null,
        tracks: currentPath?.subPaths // All programming paths
      };
    }
  };

  const handleNodeClick = (subPath, index) => {
    setSelectedNode(selectedNode === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
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

      <div className="relative z-10 container-custom py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-glow-primary">
            مسارات التعلم التفاعلية
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            اختر مسارك واكتشف رحلتك التعليمية خطوة بخطوة 🎯
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            كل مسار مصمم بعناية ليأخذك من البداية حتى الاحتراف، مع تسلسل منطقي للمهارات والمعرفة التي تحتاجها
          </p>
        </motion.div>

        {/* Path Tabs */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {learningPaths.map((path, index) => (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedPath(path.id);
                setSelectedNode(null);
              }}
              className={`
                px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
                flex items-center gap-3 group relative overflow-hidden
                ${selectedPath === path.id 
                  ? 'bg-gradient-to-r from-primary to-cyan-400 text-white shadow-glow-primary' 
                  : 'glass-card hover:border-primary/50'
                }
              `}
              style={{
                borderColor: selectedPath === path.id ? path.color : undefined
              }}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {path.icon}
              </span>
              <span>{path.title}</span>
              {selectedPath === path.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-400/20 rounded-xl"
                  style={{ zIndex: -1 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Path Description */}
        <motion.div
          key={selectedPath}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-4xl mx-auto mb-12 p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: currentPath?.color }}>
            {currentPath?.title} - {currentPath?.titleEn}
          </h2>
          <p className="text-gray-300 text-lg mb-6">{currentPath?.description}</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <FiClock className="text-primary" />
              <span className="text-gray-400">{currentPath?.durationRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-success" />
              <span className="text-gray-400">{currentPath?.levelRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiAward className="text-warning" />
              <span className="text-gray-400">{currentPath?.totalSubPaths} مسارات فرعية</span>
            </div>
          </div>
        </motion.div>

        {/* Paths Layout */}
        <div className="relative max-w-7xl mx-auto space-y-12">
          
          {/* Fundamental Path (if exists) */}
          {getPathStructure().fundamental && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                <FiBookOpen className="text-primary" />
                <span>المسار الأساسي - إلزامي للجميع</span>
              </h3>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNodeClick(getPathStructure().fundamental, 0)}
                className="max-w-3xl mx-auto glass-card p-8 cursor-pointer border-2 hover:shadow-glow-primary transition-all"
                style={{ borderColor: getPathStructure().fundamental.color }}
              >
                <div className="flex items-center gap-6 mb-4">
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
                    style={{
                      background: `linear-gradient(135deg, ${getPathStructure().fundamental.color}60, ${getPathStructure().fundamental.color}20)`,
                      border: `3px solid ${getPathStructure().fundamental.color}`
                    }}
                  >
                    {getPathStructure().fundamental.icon}
                  </div>
                  
                  <div className="flex-1 text-right">
                    <h4 className="text-3xl font-bold mb-2" style={{ color: getPathStructure().fundamental.color }}>
                      {getPathStructure().fundamental.title}
                    </h4>
                    <p className="text-xl text-gray-400 mb-3">
                      {getPathStructure().fundamental.titleEn}
                    </p>
                    <p className="text-gray-300">
                      {getPathStructure().fundamental.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-6 flex-wrap mt-6">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-primary" />
                    <span className="text-sm text-gray-400">{getPathStructure().fundamental.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className={`text-${getPathStructure().fundamental.level === 'beginner' ? 'success' : 'warning'}`} />
                    <span className="text-sm text-gray-400">
                      {getPathStructure().fundamental.level === 'beginner' ? 'مبتدئ' : 'متوسط'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAward className="text-warning" />
                    <span className="text-sm text-gray-400">
                      {getPathStructure().fundamental.relatedCoursesCount} دورة
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Specialized Tracks */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
              <FiTarget className="text-secondary" />
              <span>
                {getPathStructure().fundamental ? 'المسارات التخصصية - اختر مسارك' : 'جميع المسارات'}
              </span>
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getPathStructure().tracks?.map((subPath, index) => {
                const actualIndex = getPathStructure().fundamental ? index + 1 : index;
                const isActive = selectedNode === actualIndex;

                return (
                  <motion.div
                    key={subPath.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => handleNodeClick(subPath, actualIndex)}
                    className="glass-card p-6 cursor-pointer border-2 transition-all group"
                    style={{
                      borderColor: isActive ? subPath.color : 'transparent',
                      boxShadow: isActive ? `0 0 40px ${subPath.color}40` : undefined
                    }}
                  >
                    {/* Icon */}
                    <div 
                      className="w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center text-4xl
                                 group-hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${subPath.color}60, ${subPath.color}20)`,
                        border: `2px solid ${subPath.color}`
                      }}
                    >
                      {subPath.icon}
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-bold text-center mb-2" style={{ color: subPath.color }}>
                      {subPath.title}
                    </h4>
                    <p className="text-center text-gray-400 text-sm mb-3">
                      {subPath.titleEn}
                    </p>

                    {/* Description */}
                    <p className="text-gray-300 text-sm text-center mb-4 line-clamp-2">
                      {subPath.description}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <FiClock className="text-primary" />
                        <span className="text-gray-400">{subPath.duration}</span>
                      </div>
                      <div className={`
                        px-2 py-1 rounded-full
                        ${subPath.level === 'beginner' ? 'bg-success/20 text-success' : 
                          subPath.level === 'intermediate' ? 'bg-warning/20 text-warning' : 
                          subPath.level === 'advanced' ? 'bg-danger/20 text-danger' : 'bg-accent/20 text-accent'}
                      `}>
                        {subPath.level === 'beginner' ? 'مبتدئ' :
                         subPath.level === 'intermediate' ? 'متوسط' :
                         subPath.level === 'advanced' ? 'متقدم' : 'خبير'}
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-primary">اضغط لعرض التفاصيل ↖</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Node Details */}
        <AnimatePresence>
          {selectedNode !== null && currentPath?.subPaths[selectedNode] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8"
            >
              <div className="max-w-4xl mx-auto glass-card p-8 border-2" 
                style={{ borderColor: currentPath.subPaths[selectedNode].color }}>
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full glass-card hover:bg-danger/20 
                           flex items-center justify-center transition-all"
                >
                  ✕
                </button>

                <div className="flex items-start gap-6 mb-6">
                  <div className="text-6xl">
                    {currentPath.subPaths[selectedNode].icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2" 
                      style={{ color: currentPath.subPaths[selectedNode].color }}>
                      {currentPath.subPaths[selectedNode].title}
                    </h3>
                    <p className="text-xl text-gray-400 mb-4">
                      {currentPath.subPaths[selectedNode].titleEn}
                    </p>
                    <p className="text-gray-300 text-lg">
                      {currentPath.subPaths[selectedNode].description}
                    </p>
                  </div>
                </div>

                {/* Key Points */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FiCheckCircle className="text-success" />
                    ماذا ستتعلم؟
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {currentPath.subPaths[selectedNode].keyPoints.map((point, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 glass-card p-4"
                      >
                        <FiCheckCircle 
                          className="mt-1 flex-shrink-0" 
                          style={{ color: currentPath.subPaths[selectedNode].color }} 
                        />
                        <p className="text-sm text-gray-300">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap">
                  <button
                    className="btn-primary flex items-center gap-2 px-8 py-3"
                    style={{
                      background: `linear-gradient(135deg, ${currentPath.subPaths[selectedNode].color}, ${currentPath.subPaths[selectedNode].color}99)`
                    }}
                  >
                    <FiCheckCircle />
                    ابدأ التعلم الآن
                  </button>
                  
                  <button className="glass-card px-8 py-3 hover:border-primary/50 transition-all flex items-center gap-2">
                    <FiAward />
                    عرض الدورات ({currentPath.subPaths[selectedNode].relatedCoursesCount})
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LearningPaths;
