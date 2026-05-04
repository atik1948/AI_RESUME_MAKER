import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  showLabel = false,
  label = '',
  animated = true,
  striped = false,
  pulse = false,
  gradient = false,
  glow = false,
  rounded = 'full',
  className = '',
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();

  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Animate value changes
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  // Size styles
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
    '2xl': 'h-8'
  };

  // Variant styles
  const variants = {
    primary: {
      bg: 'bg-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/50'
    },
    secondary: {
      bg: 'bg-gray-600',
      gradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
      glow: 'shadow-gray-500/50'
    },
    success: {
      bg: 'bg-green-600',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
      glow: 'shadow-green-500/50'
    },
    warning: {
      bg: 'bg-yellow-600',
      gradient: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      glow: 'shadow-yellow-500/50'
    },
    danger: {
      bg: 'bg-red-600',
      gradient: 'bg-gradient-to-r from-red-500 to-pink-600',
      glow: 'shadow-red-500/50'
    },
    info: {
      bg: 'bg-cyan-600',
      gradient: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/50'
    }
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  // Get variant colors
  const variantColors = variants[variant] || variants.primary;

  // Build classes
  const containerClasses = `
        relative w-full bg-gray-200 dark:bg-neutral-700 overflow-hidden
    ${sizes[size] || sizes.md}
    ${roundedStyles[rounded] || roundedStyles.full}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const progressClasses = `
    h-full transition-all duration-500 ease-out relative overflow-hidden
    ${gradient ? variantColors.gradient : variantColors.bg}
    ${glow ? `shadow-lg ${variantColors.glow}` : ''}
    ${pulse ? 'animate-pulse' : ''}
    ${roundedStyles[rounded] || roundedStyles.full}
  `.trim().replace(/\s+/g, ' ');

  // Striped pattern
  const stripedPattern = striped ? (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%] animate-[progressPulse_2s_linear_infinite]" />
  ) : null;

  // Animation variants
  const progressVariants = {
    initial: { width: '0%' },
    animate: { 
      width: `${displayValue}%`,
      transition: {
        duration: animated ? 0.8 : 0,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Sparkle effect for high values
  const SparkleEffect = () => (
    displayValue > 90 ? (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: '0%', 
              y: '50%', 
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: '100%', 
              y: ['50%', '20%', '80%', '50%'],
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    ) : null
  );

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {(showLabel && label) && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-gray-700">{label}</span>
          {showValue && (
            <span className="text-gray-600">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={containerClasses} {...props}>
        <motion.div
          className={progressClasses}
          variants={progressVariants}
          initial="initial"
          animate="animate"
        >
          {stripedPattern}
          <SparkleEffect />
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        {/* Value display inside bar */}
        {showValue && !showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-white mix-blend-difference">
              {Math.round(displayValue)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  thickness = 'md',
  showValue = true,
  animated = true,
  gradient = false,
  glow = false,
  className = '',
  children,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Animate value changes
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  // Size configurations
  const sizes = {
    xs: { size: 32, stroke: 2 },
    sm: { size: 40, stroke: 3 },
    md: { size: 56, stroke: 4 },
    lg: { size: 72, stroke: 5 },
    xl: { size: 96, stroke: 6 },
    '2xl': { size: 128, stroke: 8 }
  };

  // Thickness styles
  const thicknesses = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6
  };

  // Variant colors
  const variants = {
    primary: '#3B82F6',
    secondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4'
  };

  const config = sizes[size] || sizes.md;
  const strokeWidth = thicknesses[thickness] || thicknesses.md;
  const color = variants[variant] || variants.primary;
  
  const radius = (config.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: config.size, height: config.size }}
      {...props}
    >
      <svg
        width={config.size}
        height={config.size}
        className={`transform -rotate-90 ${glow ? 'filter drop-shadow-lg' : ''}`}
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          stroke="#E5E7EB" className="dark:stroke-neutral-600"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          stroke={gradient ? `url(#gradient-${variant})` : color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: animated ? strokeDashoffset : circumference - (percentage / 100) * circumference
          }}
          transition={{
            duration: animated ? 1 : 0,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
        
        {/* Gradient definition */}
        {gradient && (
          <defs>
            <linearGradient id={`gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          </defs>
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(displayValue)}%
          </span>
        ))}
      </div>
    </div>
  );
};

// Multi-step Progress Component
const StepProgress = ({
  steps = [],
  currentStep = 0,
  variant = 'primary',
  size = 'md',
  showLabels = true,
  animated = true,
  className = '',
  ...props
}) => {
  // Size styles
  const sizes = {
    sm: {
      circle: 'w-6 h-6 text-xs',
      line: 'h-0.5',
      text: 'text-xs'
    },
    md: {
      circle: 'w-8 h-8 text-sm',
      line: 'h-1',
      text: 'text-sm'
    },
    lg: {
      circle: 'w-10 h-10 text-base',
      line: 'h-1.5',
      text: 'text-base'
    }
  };

  // Variant colors
  const variants = {
    primary: {
      active: 'bg-blue-600 text-white border-blue-600',
      completed: 'bg-green-600 text-white border-green-600',
      pending: 'bg-gray-200 text-gray-500 border-gray-300',
      line: 'bg-blue-600'
    },
    success: {
      active: 'bg-green-600 text-white border-green-600',
      completed: 'bg-green-700 text-white border-green-700',
      pending: 'bg-gray-200 text-gray-500 border-gray-300',
      line: 'bg-green-600'
    }
  };

  const sizeConfig = sizes[size] || sizes.md;
  const variantConfig = variants[variant] || variants.primary;

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;
          
          let stepClasses = `
            ${sizeConfig.circle}
            flex items-center justify-center rounded-full border-2 font-medium
            transition-all duration-300 relative z-10
          `;
          
          if (isCompleted) {
            stepClasses += ` ${variantConfig.completed}`;
          } else if (isActive) {
            stepClasses += ` ${variantConfig.active}`;
          } else {
            stepClasses += ` ${variantConfig.pending}`;
          }

          return (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full flex items-center">
                  <div className={`flex-1 ${sizeConfig.line} bg-gray-300 ml-4`}>
                    <motion.div
                      className={`h-full ${variantConfig.line}`}
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: isCompleted ? '100%' : '0%'
                      }}
                      transition={{
                        duration: animated ? 0.5 : 0,
                        delay: animated ? index * 0.1 : 0
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Step circle */}
              <motion.div
                className={stepClasses}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: animated ? 0.3 : 0,
                  delay: animated ? index * 0.1 : 0
                }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              
              {/* Step label */}
              {showLabels && (
                <motion.div
                  className={`mt-2 text-center ${sizeConfig.text} ${
                    isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: animated ? 0.3 : 0,
                    delay: animated ? index * 0.1 + 0.2 : 0
                  }}
                >
                  <div className="font-medium">{step.title}</div>
                  {step.description && (
                    <div className="text-xs text-gray-400 mt-1">
                      {step.description}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Export components
Progress.Circular = CircularProgress;
Progress.Steps = StepProgress;

export default Progress;
export { CircularProgress, StepProgress };