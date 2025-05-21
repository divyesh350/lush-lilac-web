import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  onClick, 
  to, 
  disabled,
  fullWidth,
  icon: Icon,
  iconPosition = 'right',
  ...props 
}) => {
  const baseClasses = "px-6 py-3 rounded-button font-medium transition-all duration-300 btn-hover flex items-center whitespace-nowrap";
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return "bg-primary hover:bg-[#D4B6D0] text-white";
      case 'secondary':
        return "bg-secondary hover:bg-[#FFD2E5] text-white";
      case 'outline':
        return "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white";
      case 'light':
        return "bg-light-pink hover:bg-[#FFD2E5] text-dark-purple";
      case 'pastel':
        return "bg-[#F9F0F7] hover:bg-[#E8D5E4] text-dark-purple";
      case 'transparent':
        return "bg-transparent text-primary hover:bg-[#F9F0F7]";
      default:
        return "bg-primary hover:bg-[#D4B6D0] text-white";
    }
  };

  const buttonClasses = `${baseClasses} ${getVariantClasses()} ${fullWidth ? 'w-full justify-center' : ''} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className={children ? 'mr-2' : ''} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={children ? 'ml-2' : ''} />}
    </>
  );

  const buttonMotion = {
    tap: { scale: 0.95 },
    hover: { y: -2, boxShadow: '0 5px 15px rgba(232, 213, 228, 0.5)' }
  };

  // If 'to' prop is provided, render a Link
  if (to) {
    return (
      <motion.div 
        whileTap={buttonMotion.tap}
        whileHover={buttonMotion.hover}
        className="inline-block"
      >
        <Link to={to} className={buttonClasses} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  // Otherwise render a button
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled && buttonMotion.tap}
      whileHover={!disabled && buttonMotion.hover}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button; 