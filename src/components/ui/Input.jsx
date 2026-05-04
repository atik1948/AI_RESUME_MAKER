import React, { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = forwardRef(({
  type = 'text',
  variant = 'default',
  size = 'md',
  label,
  placeholder,
  helperText,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  clearable = false,
  loading = false,
  animated = true,
  floating = false,
  rounded = 'md',
  shadow = false,
  className = '',
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Track value state for floating labels
  useEffect(() => {
    setHasValue(value && value.toString().length > 0);
  }, [value]);

  // Variant styles
    const variants = {
      default: {
        base: 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100 dark:placeholder-gray-400',
        focus: 'border-blue-500 bg-white text-gray-900 dark:bg-neutral-800 dark:text-gray-100 dark:border-blue-400',
        error: 'border-red-500 bg-white text-gray-900 dark:bg-neutral-800 dark:text-gray-100 dark:border-red-400',
        success: 'border-green-500 bg-white text-gray-900 dark:bg-neutral-800 dark:text-gray-100 dark:border-green-400'
      },
      filled: {
        base: 'border-transparent bg-gray-100 text-gray-900 placeholder-gray-500 dark:bg-neutral-700 dark:text-gray-100 dark:placeholder-gray-400',
        focus: 'bg-white border-blue-500 text-gray-900 dark:bg-neutral-600 dark:text-gray-100 dark:border-blue-400',
        error: 'bg-red-50 border-red-500 text-gray-900 dark:bg-red-900/50 dark:text-gray-100 dark:border-red-400',
        success: 'bg-green-50 border-green-500 text-gray-900 dark:bg-green-900/50 dark:text-gray-100 dark:border-green-400'
      },
      outlined: {
        base: 'border-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-500 dark:border-neutral-700 dark:text-gray-100 dark:placeholder-gray-400',
        focus: 'border-blue-500 bg-transparent text-gray-900 dark:bg-transparent dark:text-gray-100 dark:border-blue-400',
        error: 'border-red-500 bg-transparent text-gray-900 dark:bg-transparent dark:text-gray-100 dark:border-red-400',
        success: 'border-green-500 bg-transparent text-gray-900 dark:bg-transparent dark:text-gray-100 dark:border-green-400'
      },
      underlined: {
        base: 'border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-500 rounded-none px-0 dark:border-neutral-700 dark:text-gray-100 dark:placeholder-gray-400',
        focus: 'border-blue-500 bg-transparent text-gray-900 dark:bg-transparent dark:text-gray-100 dark:border-blue-400',
        error: 'border-red-500 bg-transparent text-gray-900 dark:bg-transparent dark:text-gray-100 dark:border-red-400',
        success: 'border-green-500 bg-transparent text-gray-900 dark:bg-transparent dark:text-gray-100 dark:border-green-400'
      }
    };
  // Size styles
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
    xl: 'px-4 py-3.5 text-lg'
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

  // Get variant configuration
  const variantConfig = variants[variant] || variants.default;
  
  // Determine current state styles
  let stateStyles = variantConfig.base;
  if (error) {
    stateStyles = variantConfig.error;
  } else if (success) {
    stateStyles = variantConfig.success;
  } else if (focused) {
    stateStyles = variantConfig.focus;
  }

  // Build input classes
  const inputClasses = `
    w-full border transition-all duration-200 focus:outline-none
    ${stateStyles}
    ${sizes[size] || sizes.md}
    ${roundedStyles[rounded] || roundedStyles.md}
    ${shadow ? 'shadow-sm focus:shadow-md' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-neutral-900' : ''}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${clearable && hasValue ? 'pr-10' : ''}
    ${loading ? 'pr-10' : ''}
    ${floating ? 'placeholder-transparent' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Handle focus events
  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  // Handle clear button
  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  // Clear button
  const ClearButton = () => (
    <button
      type="button"
      onClick={handleClear}
      className="text-gray-400 hover:text-gray-600 transition-colors duration-200 dark:text-gray-500 dark:hover:text-gray-300"
      tabIndex={-1}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );

  // Floating label animation variants
  const labelVariants = {
    default: {
      top: '50%',
      fontSize: '0.875rem',
      color: '#6B7280',
      transform: 'translateY(-50%)'
    },
    focused: {
      top: '0%',
      fontSize: '0.75rem',
      color: error ? '#EF4444' : success ? '#10B981' : '#3B82F6',
      transform: 'translateY(-50%)'
    }
  };

  return (
    <div className="w-full">
      {/* Regular Label */}
      {label && !floating && (
        <motion.label
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-700 dark:text-red-300' : success ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animated ? 0.2 : 0 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={`h-4 w-4 ${
              error ? 'text-red-400' : success ? 'text-green-400' : focused ? 'text-blue-400' : 'text-gray-400 dark:text-gray-500'
            } transition-colors duration-200`}>
              {icon}
            </div>
          </div>
        )}

        {/* Input Field */}
        <motion.input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={floating ? ' ' : placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          initial={animated ? { opacity: 0, scale: 0.95 } : false}
          animate={animated ? { opacity: 1, scale: 1 } : false}
          transition={animated ? { duration: 0.2 } : false}
          {...props}
        />

        {/* Floating Label */}
        {floating && label && (
          <motion.label
            className="absolute left-3 pointer-events-none transition-all duration-200 origin-left"
            variants={labelVariants}
            animate={focused || hasValue ? 'focused' : 'default'}
            style={{
              background: variant === 'filled' ? 'transparent' : 'white',
              padding: focused || hasValue ? '0 4px' : '0'
            }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Right Side Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          {/* Loading Spinner */}
          {loading && <LoadingSpinner />}
          
          {/* Clear Button */}
          {clearable && hasValue && !loading && <ClearButton />}
          
          {/* Right Icon */}
          {icon && iconPosition === 'right' && !loading && !(clearable && hasValue) && (
            <div className={`h-4 w-4 ${
              error ? 'text-red-400' : success ? 'text-green-400' : focused ? 'text-blue-400' : 'text-gray-400 dark:text-gray-500'
            } transition-colors duration-200`}>
              {icon}
            </div>
          )}

          {/* Success/Error Icons */}
          {(success || error) && !loading && (
            <div className={`h-4 w-4 ${success ? 'text-green-400' : 'text-red-400'}`}>
              {success ? (
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Focus Ring Animation */}
        <AnimatePresence>
          {focused && animated && (
            <motion.div
              className="absolute inset-0 rounded-inherit border-2 border-blue-500 pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text / Error Message */}
      <AnimatePresence mode="wait">
        {(helperText || error || success) && (
          <motion.div
            className={`mt-2 text-xs ${
              error ? 'text-red-600 dark:text-red-300' : success ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'
            }`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {error || (success && typeof success === 'string' ? success : helperText)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
const Textarea = forwardRef(({
  variant = 'default',
  size = 'md',
  label,
  placeholder,
  helperText,
  error,
  success,
  disabled = false,
  required = false,
  rows = 4,
  resize = 'vertical',
  animated = true,
  rounded = 'md',
  shadow = false,
  className = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  // Variant styles (same as Input)
  const variants = {
    default: {
      base: 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100 dark:placeholder-gray-400',
      focus: 'border-blue-500 ring-blue-500',
      error: 'border-red-500 ring-red-500',
      success: 'border-green-500 ring-green-500'
    },
    filled: {
      base: 'border-transparent bg-gray-100 text-gray-900 placeholder-gray-500 dark:bg-neutral-700 dark:text-gray-100 dark:placeholder-gray-400',
      focus: 'bg-white border-blue-500 ring-blue-500 dark:bg-neutral-800',
      error: 'bg-red-50 border-red-500 ring-red-500 dark:bg-red-900/50',
      success: 'bg-green-50 border-green-500 ring-green-500 dark:bg-green-900/50'
    },
    outlined: {
      base: 'border-2 border-gray-300 bg-transparent text-gray-900 placeholder-gray-500 dark:border-neutral-700 dark:text-gray-100 dark:placeholder-gray-400',
      focus: 'border-blue-500 ring-0',
      error: 'border-red-500 ring-0',
      success: 'border-green-500 ring-0'
    }
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Resize styles
  const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  // Get variant configuration
  const variantConfig = variants[variant] || variants.default;
  
  // Determine current state styles
  let stateStyles = variantConfig.base;
  if (error) {
    stateStyles = variantConfig.error;
  } else if (success) {
    stateStyles = variantConfig.success;
  } else if (focused) {
    stateStyles = variantConfig.focus;
  }

  // Build textarea classes
  const textareaClasses = `
    w-full border transition-all duration-200 focus:outline-none focus:ring-1
    ${stateStyles}
    ${sizes[size] || sizes.md}
    ${roundedStyles[rounded] || roundedStyles.md}
    ${resizeStyles[resize] || resizeStyles.vertical}
    ${shadow ? 'shadow-sm focus:shadow-md' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-neutral-900' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <motion.label
          className={`block text-sm font-medium mb-2 ${
            error ? 'text-red-700 dark:text-red-300' : success ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animated ? 0.2 : 0 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Textarea */}
      <motion.textarea
        ref={ref}
        className={textareaClasses}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        initial={animated ? { opacity: 0, scale: 0.95 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : false}
        transition={animated ? { duration: 0.2 } : false}
        {...props}
      />

      {/* Helper Text / Error Message */}
      <AnimatePresence mode="wait">
        {(helperText || error || success) && (
          <motion.div
            className={`mt-2 text-xs ${
              error ? 'text-red-600 dark:text-red-300' : success ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'
            }`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {error || (success && typeof success === 'string' ? success : helperText)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

// Export components
Input.Textarea = Textarea;

export default Input;
export { Textarea };