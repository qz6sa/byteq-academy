import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RecentList = ({ title, items, linkText, linkTo, renderItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-glow-primary">{title}</h3>
        {linkTo && (
          <Link to={linkTo} className="text-primary hover:text-cyan-400 text-sm transition-colors">
            {linkText} ←
          </Link>
        )}
      </div>
      
      {items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">لا توجد بيانات</p>
      )}
    </motion.div>
  );
};

export default RecentList;
