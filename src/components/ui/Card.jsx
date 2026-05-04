import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Card = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  border = true,
  hover = true,
  gradient = false,
  glow = false,
  glass = false,
  interactive = false,
  className = '',
  ...props
}, ref) => {
  // Variant styles
  const variants = {
    default: 'bg-white border-gray-200 dark:bg-neutral-800 dark:border-neutral-700',
    elevated: 'bg-white border-gray-100 dark:bg-neutral-800 dark:border-neutral-700',
    outlined: 'bg-transparent border-gray-300 dark:border-neutral-600',
    filled: 'bg-gray-50 border-gray-200 dark:bg-neutral-900 dark:border-neutral-700',
    primary: 'bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800',
    success: 'bg-green-50 border-green-200 dark:bg-green-900/50 dark:border-green-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/50 dark:border-yellow-800',
    danger: 'bg-red-50 border-red-200 dark:bg-red-900/50 dark:border-red-800',
    dark: 'bg-gray-900 border-gray-700 text-white',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border-gray-200 dark:from-blue-900/50 dark:via-neutral-800 dark:to-purple-900/50 dark:border-neutral-700'
  };

  // Size styles (affects overall dimensions)
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'w-full'
  };

  // Padding styles
  const paddings = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-10'
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  };

  // Shadow styles
  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  // Hover effects
  const hoverEffects = {
    lift: 'hover:shadow-xl hover:-translate-y-1',
    glow: 'hover:shadow-2xl hover:shadow-blue-500/10',
    scale: 'hover:scale-[1.02]',
    border: 'hover:border-blue-300',
    subtle: 'hover:shadow-lg hover:shadow-gray-500/10'
  };

  // Glass morphism effect
  const glassEffect = 'backdrop-blur-xl bg-white/70 border-white/20 shadow-xl dark:bg-neutral-800/70 dark:border-neutral-700/20';

  // Glow effects
  const glowEffects = {
    blue: 'shadow-blue-500/25 hover:shadow-blue-500/40',
    purple: 'shadow-purple-500/25 hover:shadow-purple-500/40',
    green: 'shadow-green-500/25 hover:shadow-green-500/40',
    yellow: 'shadow-yellow-500/25 hover:shadow-yellow-500/40',
    red: 'shadow-red-500/25 hover:shadow-red-500/40'
  };

  // Build className
  const baseClasses = 'relative transition-all duration-300 ease-out';
  const variantClasses = glass ? glassEffect : (gradient ? variants.gradient : variants[variant] || variants.default);
  const sizeClasses = sizes[size] || '';
  const paddingClasses = paddings[padding] || paddings.md;
  const roundedClasses = roundedStyles[rounded] || roundedStyles.lg;
  const shadowClasses = shadowStyles[shadow] || shadowStyles.md;
  const borderClasses = border ? 'border' : 'border-0';
  const hoverClasses = hover ? (typeof hover === 'string' ? hoverEffects[hover] : hoverEffects.subtle) : '';
  const glowClasses = glow ? (typeof glow === 'string' ? glowEffects[glow] : glowEffects.blue) : '';
  const interactiveClasses = interactive ? 'cursor-pointer select-none' : '';

  const cardClasses = `
    ${baseClasses}
    ${variantClasses}
    ${sizeClasses}
    ${paddingClasses}
    ${roundedClasses}
    ${shadowClasses}
    ${borderClasses}
    ${hoverClasses}
    ${glowClasses}
    ${interactiveClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Animation variants
  const motionVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: interactive ? {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    } : {},
    tap: interactive ? {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: 'easeInOut'
      }
    } : {}
  };

  return (
    <motion.div
      ref={ref}
      className={cardClasses}
      variants={motionVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {/* Gradient overlay for enhanced visual appeal */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-purple-500/5 rounded-inherit pointer-events-none" />
      )}
      
      {/* Glow effect background */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-inherit opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm pointer-events-none" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Interactive ripple effect */}
      {interactive && (
        <div className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      )}
    </motion.div>
  );
});

Card.displayName = 'Card';

// Card Header Component
const CardHeader = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 pb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

// Card Title Component
const CardTitle = forwardRef(({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  >
    {children}
  </Component>
));

CardTitle.displayName = 'CardTitle';

// Card Description Component
const CardDescription = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

// Card Content Component
const CardContent = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`${className}`}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

// Card Footer Component
const CardFooter = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div
    ref={ref}
    className={`flex items-center pt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Export all components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };