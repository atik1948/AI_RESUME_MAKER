import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const AIAssistant = ({
  isVisible,
  onClose,
  suggestions = [],
  loading = false,
  onApplySuggestion,
  onGenerateMore,
  fieldType,
  context = {},
  title = "AI Assistant",
  subtitle = "Click on any suggestion to apply it",
  autoClose = false,
  enableBatch = true
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  // Auto-close copied notification
  useEffect(() => {
    if (copiedIndex !== null) {
      const timer = setTimeout(() => setCopiedIndex(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  const handleApplySuggestion = (suggestion, index) => {
    setSelectedSuggestion(index);
    onApplySuggestion(suggestion);
    
    // Mark as applied
    setAppliedSuggestions(prev => new Set([...prev, index]));
    
    // Visual feedback
    setTimeout(() => {
      setSelectedSuggestion(null);
    }, 1000);

    // Auto-close if enabled
    if (autoClose) {
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  const handleGenerateMore = async () => {
    setIsGeneratingMore(true);
    try {
      await onGenerateMore();
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleClearAll = () => {
    setAppliedSuggestions(new Set());
    // Could also trigger clearing suggestions in parent component
  };

  const getAppliedCount = () => appliedSuggestions.size;

  const handleCopySuggestion = async (suggestion, index) => {
    try {
      await navigator.clipboard.writeText(suggestion.text || suggestion);
      setCopiedIndex(index);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getFieldTypeIcon = () => {
    switch (fieldType) {
      case 'responsibilities':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'projectDescription':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'summary':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'skills':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
    }
  };

  const getSuggestionQuality = (suggestion) => {
    const text = suggestion.text || suggestion;
    const wordCount = text.split(' ').length;
    const hasNumbers = /\d/.test(text);
    const hasActionVerbs = /^(Led|Developed|Implemented|Created|Managed|Increased|Decreased|Improved|Built|Designed|Coordinated|Executed|Achieved|Delivered)/i.test(text);
    
    let quality = 'Good';
    let color = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    
    if (fieldType === 'responsibilities') {
      if (hasNumbers && hasActionVerbs && wordCount >= 8) {
        quality = 'Excellent';
        color = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      } else if (hasActionVerbs && wordCount >= 5) {
        quality = 'Great';
        color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      }
    } else if (fieldType === 'summary') {
      if (wordCount >= 40 && wordCount <= 80) {
        quality = 'Excellent';
        color = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      } else if (wordCount >= 25) {
        quality = 'Great';
        color = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      }
    }
    
    return { quality, color };
  };

  if (!isVisible) return null;
  if (typeof document === 'undefined') return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          layoutId="ai-assistant"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                  {getFieldTypeIcon()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-purple-100 text-sm">{subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {enableBatch && suggestions.length > 0 && (
                  <div className="flex items-center space-x-2 mr-4">
                    <span className="text-white/80 text-sm">
                      {getAppliedCount()}/{suggestions.length} applied
                    </span>
                    {getAppliedCount() > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-white/60 hover:text-white/80 text-xs underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                )}
                <Button
                  onClick={handleGenerateMore}
                  size="sm"
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading || isGeneratingMore}
                >
                  {loading || isGeneratingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>
                        {suggestions.length > 0 ? '🚀 Generate More' : '✨ Generate'}
                      </span>
                    </>
                  )}
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading && suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    AI is crafting suggestions...
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Analyzing your profile and generating personalized content
                  </p>
                </div>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No suggestions yet
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Click "Generate More" to get AI-powered suggestions for your content
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Context Info */}
                {(context.jobTitle || context.company) && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Generating suggestions for:
                    </h4>
                    <div className="text-blue-800 dark:text-blue-200 text-sm">
                      {context.jobTitle && <span className="font-medium">{context.jobTitle}</span>}
                      {context.jobTitle && context.company && <span> at </span>}
                      {context.company && <span className="font-medium">{context.company}</span>}
                      {context.degree && <span className="font-medium">{context.degree}</span>}
                      {context.name && <span className="font-medium">{context.name}</span>}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => {
                    const { quality, color } = getSuggestionQuality(suggestion);
                    const isSelected = selectedSuggestion === index;
                    const isCopied = copiedIndex === index;
                    const isApplied = appliedSuggestions.has(index);
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative group p-4 rounded-xl border transition-all duration-200 ${
                          isApplied
                            ? 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
                            : isSelected 
                            ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700'
                            : 'bg-gray-50 dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        }`}
                      >
                        {/* Quality Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                              {quality}
                            </span>
                            {isApplied && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Applied
                              </span>
                            )}
                          </div>
                          {suggestion.style && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {suggestion.style}
                            </span>
                          )}
                        </div>

                        {/* Suggestion Text */}
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                          {suggestion.text || suggestion}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleApplySuggestion(suggestion, index)}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              disabled={isSelected}
                            >
                              {isSelected ? (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Applied!</span>
                                </div>
                              ) : (
                                'Apply'
                              )}
                            </Button>
                            <Button
                              onClick={() => handleCopySuggestion(suggestion, index)}
                              variant="outline"
                              size="sm"
                              className="text-gray-600 dark:text-gray-400"
                            >
                              {isCopied ? (
                                <div className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Copied</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  <span>Copy</span>
                                </div>
                              )}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {(suggestion.text || suggestion).split(' ').length} words
                          </div>
                        </div>

                        {/* Applied checkmark overlay */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-neutral-700 px-6 py-4 border-t border-gray-200 dark:border-neutral-600">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>💡 Tip: These suggestions are tailored to your profile</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Powered by AI</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default AIAssistant;
