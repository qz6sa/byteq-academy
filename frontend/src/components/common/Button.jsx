import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'btn-gradient-primary text-white shadow-lg shadow-primary/30',
    secondary: 'btn-gradient-secondary text-white shadow-lg shadow-secondary/30',
    accent: 'btn-gradient-accent text-white shadow-lg shadow-accent/30',
    success: 'bg-success text-black shadow-lg shadow-success/30 hover:shadow-success/50',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-600/30 hover:bg-red-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && <div className="spinner" />}
      {icon && !loading && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && !loading && iconPosition === 'right' && <span>{icon}</span>}
    </motion.button>
  );
};

export default Button;
