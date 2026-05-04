import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSmartAutocompleteSuggestions } from '../../utils/enhancedAIHelpers';

const SmartInput = ({
  value = '',
  onChange,
  onFocus,
  onBlur,
  placeholder = '',
  fieldType = 'general',
  context = {},
  enableAI = true,
  className = '',
  multiline = false,
  rows = 3,
  ...props
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced AI suggestion fetch
  useEffect(() => {
    if (!enableAI || !value || value.length < 10) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const aiSuggestions = await getSmartAutocompleteSuggestions(value, fieldType, context);
        setSuggestions(aiSuggestions || []);
        setShowSuggestions(aiSuggestions && aiSuggestions.length > 0);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // 1 second debounce

    setDebounceTimer(timer);

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [value, fieldType, context, enableAI]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          applySuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const applySuggestion = (suggestion) => {
    const newValue = suggestion.text || suggestion;
    onChange({
      target: {
        value: newValue,
        name: props.name
      }
    });
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    onChange(e);
    setSelectedIndex(-1);
  };

  const handleFocus = (e) => {
    if (onFocus) onFocus(e);
    // Don't auto-show suggestions on focus
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
    if (onBlur) onBlur(e);
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      <InputComponent
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        className={`w-full p-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800 resize-none ${className}`}
        {...props}
      />

      {/* AI Loading Indicator */}
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-xl max-h-60 overflow-y-auto"
          >
            <div className="p-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  AI Suggestions
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
                </div>
              </div>
              
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => applySuggestion(suggestion)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-150 ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {suggestion.text || suggestion}
                      </p>
                      {suggestion.confidence && (
                        <div className="mt-1 flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.round(suggestion.confidence * 100)}% match
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-2 text-xs text-gray-400">
                      {index === selectedIndex && (
                        <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                          Enter
                        </kbd>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
              
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-neutral-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  ↑↓ Navigate • Enter to apply • Esc to close
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartInput;
