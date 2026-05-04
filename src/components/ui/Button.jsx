import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'md',
  shadow = true,
  gradient = false,
  glow = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  // Variant styles
  const variants = {
    primary: {
      base: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 focus:ring-blue-500',
      gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500'
    },
    secondary: {
      base: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700 focus:ring-gray-500',
      gradient: 'bg-gradient-to-r from-gray-600 to-gray-800 text-white border-transparent hover:from-gray-700 hover:to-gray-900 focus:ring-gray-500'
    },
    success: {
      base: 'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 focus:ring-green-500',
      gradient: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent hover:from-green-700 hover:to-emerald-700 focus:ring-green-500'
    },
    warning: {
      base: 'bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700 hover:border-yellow-700 focus:ring-yellow-500',
      gradient: 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-transparent hover:from-yellow-700 hover:to-orange-700 focus:ring-yellow-500'
    },
    danger: {
      base: 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-500',
      gradient: 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-transparent hover:from-red-700 hover:to-pink-700 focus:ring-red-500'
    },
    outline: {
      base: 'bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300',
      gradient: 'bg-transparent text-blue-600 border-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 focus:ring-blue-500 dark:text-blue-400 dark:border-blue-400 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 dark:hover:text-blue-300'
    },
    ghost: {
      base: 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-neutral-700 dark:hover:text-gray-100',
      gradient: 'bg-transparent text-gray-700 border-transparent hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:hover:from-neutral-700 dark:hover:to-neutral-600 dark:hover:text-gray-100'
    },
    link: {
      base: 'bg-transparent text-blue-600 border-transparent hover:text-blue-700 hover:underline focus:ring-blue-500 p-0 dark:text-blue-400 dark:hover:text-blue-300',
      gradient: 'bg-transparent text-blue-600 border-transparent hover:text-blue-700 hover:underline focus:ring-blue-500 p-0 dark:text-blue-400 dark:hover:text-blue-300'
    }
  };

  // Size styles
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs font-medium',
    sm: 'px-3 py-2 text-sm font-medium',
    md: 'px-4 py-2.5 text-sm font-medium',
    lg: 'px-5 py-3 text-base font-medium',
    xl: 'px-6 py-3.5 text-base font-semibold',
    '2xl': 'px-8 py-4 text-lg font-semibold'
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };

  // Shadow styles
  const shadowStyles = {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl'
  };

  // Glow effect
  const glowStyles = {
    primary: 'hover:shadow-blue-500/25',
    secondary: 'hover:shadow-gray-500/25',
    success: 'hover:shadow-green-500/25',
    warning: 'hover:shadow-yellow-500/25',
    danger: 'hover:shadow-red-500/25'
  };

  // Build className
  const baseClasses = 'inline-flex items-center justify-center border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = variants[variant]?.[gradient ? 'gradient' : 'base'] || variants.primary.base;
  const sizeClasses = sizes[size] || sizes.md;
  const roundedClasses = roundedStyles[rounded] || roundedStyles.md;
  const shadowClasses = shadow ? (typeof shadow === 'string' ? shadowStyles[shadow] : shadowStyles.md) : '';
  const glowClasses = glow ? glowStyles[variant] || glowStyles.primary : '';
  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses}
    ${sizeClasses}
    ${roundedClasses}
    ${shadowClasses}
    ${glowClasses}
    ${widthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Animation variants
  const motionVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1, ease: 'easeInOut' }
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Ripple effect component
  const RippleEffect = () => (
    <span className="absolute inset-0 overflow-hidden rounded-inherit">
      <span className="absolute inset-0 rounded-inherit bg-white opacity-0 transition-opacity duration-300 group-active:opacity-20" />
    </span>
  );

  return (
    <motion.button
      ref={ref}
      className={`${buttonClasses} group`}
      disabled={disabled || loading}
      onClick={onClick}
      variants={motionVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      <RippleEffect />
      
      {/* Loading state */}
      {loading && (
        <span className="mr-2">
          <LoadingSpinner />
        </span>
      )}
      
      {/* Icon - Left */}
      {icon && iconPosition === 'left' && !loading && (
        <span className={`${children ? 'mr-2' : ''} flex items-center`}>
          {icon}
        </span>
      )}
      
      {/* Button content */}
      {children && (
        <span className={`flex items-center ${loading ? 'opacity-70' : ''}`}>
          {children}
        </span>
      )}
      
      {/* Icon - Right */}
      {icon && iconPosition === 'right' && !loading && (
        <span className={`${children ? 'ml-2' : ''} flex items-center`}>
          {icon}
        </span>
      )}
      
      {/* Gradient overlay for enhanced visual appeal */}
      {gradient && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
