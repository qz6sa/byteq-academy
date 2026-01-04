import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      className={`glass-card ${className}`}
      whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0, 212, 255, 0.3)' } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
