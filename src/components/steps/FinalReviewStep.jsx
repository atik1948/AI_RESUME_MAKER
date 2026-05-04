import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Progress from '../ui/Progress';
import TemplatePreview from '../TemplatePreview';
import { getTemplateById } from '../../templates/templateRegistry';

// Enhanced icons for better visual appeal
const SuccessIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const StatsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BulbIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

/**
 * FinalReviewStep - Modern, user-friendly final review component
 * Features: Clean UI, live CV preview, completion analysis, PDF download, and modern design
 */
const FinalReviewStep = ({ 
  formData, 
  selectedTemplate, 
  setSelectedTemplate,
  accentColor, 
  setAccentColor,
  fontStyle, 
  setFontStyle,
  fontSize, 
  setFontSize,
  sectionOrder,
  loading,
  setLoading,
  saveFormData,
  onNewResume
}) => {
  // State management
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completionScore, setCompletionScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isDownloadingRef = useRef(false);
  const [notifications, setNotifications] = useState([]);
  const [showCongratulatoryDialog, setShowCongratulatoryDialog] = useState(false);
  const activeTemplate = getTemplateById(selectedTemplate);
  
  // Refs for accessibility and functionality
  const mainContentRef = useRef(null);
  const announcementRef = useRef(null);
  const templatePreviewRef = useRef(null);
  

  // Notification system
  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  // Calculate completion metrics with enhanced scoring
  const calculateCompletionMetrics = useCallback(() => {
    if (!formData) return { score: 0, sections: [], recommendations: [] };

    const sections = [
      {
        id: 'personal',
        name: 'Personal Information',
        weight: 20,
        completed: !!(formData.fullName && formData.email && formData.phone),
        quality: formData.fullName && formData.email && formData.phone ? 100 : 
                 formData.fullName && formData.email ? 70 : 
                 formData.fullName ? 40 : 0,
        icon: '👤',
        description: 'Contact details and basic information'
      },
      {
        id: 'summary',
        name: 'Professional Summary',
        weight: 25,
        completed: !!(formData.summary && formData.summary.length > 50),
        quality: !formData.summary ? 0 :
                 formData.summary.length > 150 ? 100 :
                 formData.summary.length > 100 ? 80 :
                 formData.summary.length > 50 ? 60 : 30,
        icon: '📝',
        description: 'Professional overview and key strengths'
      },
      {
        id: 'experience',
        name: 'Work Experience',
        weight: 30,
        completed: !!(formData.experiences && formData.experiences.length > 0),
        quality: !formData.experiences || formData.experiences.length === 0 ? 0 :
                 formData.experiences.length >= 3 ? 100 :
                 formData.experiences.length >= 2 ? 80 :
                 formData.experiences.length >= 1 ? 60 : 0,
        icon: '💼',
        description: 'Professional work history and achievements'
      },
      {
        id: 'education',
        name: 'Education',
        weight: 15,
        completed: !!(formData.education && formData.education.length > 0),
        quality: !formData.education || formData.education.length === 0 ? 0 :
                 formData.education.length >= 2 ? 100 :
                 formData.education.length >= 1 ? 80 : 0,
        icon: '🎓',
        description: 'Educational background and qualifications'
      },
      {
        id: 'skills',
        name: 'Skills',
        weight: 10,
        completed: !!(formData.skills && formData.skills.length > 0),
        quality: !formData.skills || formData.skills.length === 0 ? 0 :
                 formData.skills.length >= 8 ? 100 :
                 formData.skills.length >= 5 ? 80 :
                 formData.skills.length >= 3 ? 60 : 30,
        icon: '⚡',
        description: 'Technical and soft skills'
      }
    ];

    // Calculate weighted score
    const totalWeight = sections.reduce((sum, section) => sum + section.weight, 0);
    const weightedScore = sections.reduce((sum, section) => {
      return sum + (section.quality * section.weight / 100);
    }, 0);
    const score = Math.round(weightedScore / totalWeight * 100);

    // Generate recommendations
    const recommendations = sections
      .filter(section => section.quality < 80)
      .map(section => ({
        section: section.name,
        priority: section.weight > 20 ? 'high' : section.weight > 15 ? 'medium' : 'low',
        suggestion: getRecommendation(section.id, section.quality)
      }));

    return { score, sections, recommendations };
  }, [formData]);

  // Get specific recommendations based on section and quality
  const getRecommendation = (sectionId, quality) => {
    const recommendations = {
      personal: {
        0: 'Add your full name, email, and phone number',
        40: 'Include your phone number for complete contact information',
        70: 'Consider adding your location or LinkedIn profile'
      },
      summary: {
        0: 'Write a compelling professional summary (100-200 words)',
        30: 'Expand your summary to highlight key achievements',
        60: 'Enhance your summary with specific accomplishments',
        80: 'Consider adding industry-specific keywords'
      },
      experience: {
        0: 'Add your work experience with specific achievements',
        60: 'Include more detailed job descriptions and quantifiable results',
        80: 'Add more positions or expand on current roles'
      },
      education: {
        0: 'Add your educational background',
        80: 'Consider adding relevant coursework or certifications'
      },
      skills: {
        0: 'List your relevant technical and soft skills',
        30: 'Add more skills relevant to your target role',
        60: 'Include a mix of technical and soft skills',
        80: 'Consider organizing skills by category'
      }
    };

    const sectionRecs = recommendations[sectionId];
    const qualityKey = Object.keys(sectionRecs)
      .map(Number)
      .sort((a, b) => b - a)
      .find(key => quality <= key);
    
    return sectionRecs[qualityKey] || sectionRecs[0];
  };


// Handle PDF download
const handlePDFDownload = useCallback(async () => {
  // Prevent multiple simultaneous downloads
  if (isDownloadingRef.current) {
    return;
  }

  setIsDownloading(true);
  isDownloadingRef.current = true;
  
  try {
    // Check if template preview ref is available
    if (!templatePreviewRef.current) {
      throw new Error('Template preview not available');
    }

    // Check if the template preview component has the downloadPDF method
    if (typeof templatePreviewRef.current.downloadPDF !== 'function') {
      throw new Error('Download functionality not available');
    }

    // Use the existing downloadPDF method from the TemplatePreview component
    templatePreviewRef.current.downloadPDF();
    
    // // Show success notification
    // addNotification('PDF download started!', 'success');
    
    // Show congratulatory dialog immediately after download initiation
    setShowCongratulatoryDialog(true);
    
  } catch (error) {
    console.error('PDF Download Error:', error);
    addNotification('Failed to download PDF. Please try again.', 'error');
  } finally {
    // Keep downloading state true until dialog is dismissed
    // The dialog will handle resetting isDownloading and isDownloadingRef
  }
}, [addNotification]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'f':
          event.preventDefault();
          setIsFullscreen(prev => !prev);
          break;
        default:
          break;
      }
    }
    
    if (event.key === 'Escape') {
      if (isFullscreen) setIsFullscreen(false);
    }
  }, [isFullscreen]);

  // Initialize component
  useEffect(() => {
    let isMounted = true;
    
    const initializeComponent = async () => {
      try {
        if (!isMounted) return;
        
        setHasError(false);
        setErrorMessage('');
        
        // Calculate completion metrics
        const metrics = calculateCompletionMetrics();
        
        if (!isMounted) return;
        setCompletionScore(metrics.score);
        
        // Show celebration for high scores
        if (metrics.score >= 90 && isMounted) {
          setTimeout(() => {
            if (isMounted) {
              setShowCelebration(true);
            }
          }, 1000);
        }
        
        // Announce completion status for screen readers
        if (announcementRef.current && isMounted) {
          announcementRef.current.textContent = 
            `Resume completion: ${metrics.score}%. ${metrics.recommendations.length} recommendations available.`;
        }
        
        if (isMounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('Error initializing FinalReviewStep:', error);
        if (isMounted) {
          setHasError(true);
          setErrorMessage('Unable to load resume review. Please try refreshing the page.');
        }
      }
    };

    initializeComponent();
    
    return () => {
      isMounted = false;
    };
  }, [calculateCompletionMetrics]);

  // Auto-save trigger on data changes - DISABLED
  // useEffect(() => {
  //   if (isReady && formData) {
  //     triggerAutoSave();
  //   }
  // }, [formData, selectedTemplate, accentColor, fontStyle, fontSize, isReady, triggerAutoSave]);

  // Keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Cleanup
  useEffect(() => {
    return () => {
      // Reset download state on unmount
      setIsDownloading(false);
    };
  }, []);

  // Memoized completion metrics with proper dependencies
  const completionMetrics = useMemo(() => {
    if (!formData) return { score: 0, sections: [], recommendations: [] };
    return calculateCompletionMetrics();
  }, [formData, calculateCompletionMetrics]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const celebrationVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Notification component
  const NotificationSystem = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5 }}
            className={`px-4 py-3 rounded-lg shadow-lg max-w-sm ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-2">
                {notification.type === 'success' ? '✅' :
                 notification.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              {notification.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );


  // Congratulatory Dialog
  const CongratulatoryDialog = ({ onClose, onNewResume, setIsDownloading, isDownloadingRef }) => {
    const handleContinue = () => {
      setIsDownloading(false);
      isDownloadingRef.current = false;
      onClose();
    };

    return (
      <AnimatePresence>
        {showCongratulatoryDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              {/* Animated Success Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
              >
                <motion.svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </motion.svg>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                🎉 Congratulations!
              </motion.h2>

              {/* Message */}
              <motion.p
                className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Your professional resume has been successfully downloaded!
                <br /><br />
                You're now ready to make a powerful impression and take the next step in your career journey.
                <br /><br />
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Your future success starts now! 🌟
                </span>
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <Button
                  onClick={handleContinue}
                  variant="primary"
                  size="md"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Continue
                </Button>
                <Button
                  onClick={onNewResume}
                  variant="outline"
                  size="md"
                >
                  Create Another Resume
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Celebration overlay
  const CelebrationOverlay = () => (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          variants={celebrationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setShowCelebration(false)}
        >
          <Card className="max-w-sm mx-4 text-center" padding="xl" variant="success">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Excellent Work!</h3>
            <p className="text-green-700 mb-4">
              Your resume is {completionScore}% complete and looks fantastic!
            </p>
            <Button 
              onClick={() => setShowCelebration(false)}
              variant="success"
              size="sm"
            >
              Continue
            </Button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Screen reader announcements
  const ScreenReaderAnnouncements = () => (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      <div ref={announcementRef}></div>
    </div>
  );

  // Error boundary component
  const ErrorFallback = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <Card className="max-w-md mx-auto text-center" variant="danger" padding="xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
        <p className="text-red-700 mb-4">{errorMessage}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="danger"
          size="sm"
        >
          Refresh Page
        </Button>
      </Card>
    </motion.div>
  );

  // Loading component
  const LoadingState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preparing Your Review</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing your resume for the best experience...</p>
        </div>
      </div>
    </motion.div>
  );

  // Render error state
  if (hasError) {
    return <ErrorFallback />;
  }

  // Render loading state
  if (!isReady) {
    return <LoadingState />;
  }

  return (
    <>
      <ScreenReaderAnnouncements />
      <NotificationSystem />
      <CongratulatoryDialog
        onClose={() => setShowCongratulatoryDialog(false)}
        onNewResume={onNewResume}
        setIsDownloading={setIsDownloading}
        isDownloadingRef={isDownloadingRef}
      />
      <CelebrationOverlay />
      
      {/* Enhanced Background with Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-800/10 dark:to-purple-800/10 -z-10" />
      
      <motion.div
        ref={mainContentRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full ${isFullscreen ? 'fixed inset-0 z-40 bg-white dark:bg-neutral-900' : ''}`}
        role="main"
        aria-label="Final resume review"
      >
        {/* Hero Header Section */}
        <motion.header
          variants={itemVariants}
          className="text-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
        >
          {/* Success Icon with Enhanced Animation */}
          <motion.div
            className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-full shadow-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/50 to-transparent rounded-full" />
            <motion.div
              className="absolute inset-2 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
              <motion.div
                className="text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <SuccessIcon />
              </motion.div>
            </motion.div>
            {/* Floating particles effect */}
            <motion.div
              className="absolute -inset-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    top: `${Math.sin((i * Math.PI * 2) / 6) * 40 + 50}%`,
                    left: `${Math.cos((i * Math.PI * 2) / 6) * 40 + 50}%`,
                  }}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
              transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.3 
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Main Heading with Better Typography */}
          <motion.div
            className="space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
          <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-purple-100 leading-tight px-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "backOut" }}
          >
              Resume Complete!
          </motion.h1>
            
            <motion.div
              className="flex items-center justify-center gap-2 text-xl sm:text-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <SparklesIcon />
              <TrophyIcon />
              <SparklesIcon />
            </motion.div>

          <motion.p
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
          >
              Your professional resume is crafted to perfection and ready to make an
              <span className="text-blue-600 dark:text-blue-400 font-semibold"> outstanding first impression</span>.
            <br className="hidden sm:block" />
              <span className="text-gray-500 dark:text-gray-400">Review your masterpiece and download when ready.</span>
          </motion.p>
          </motion.div>

          {/* Enhanced Completion Score Card */}
          <motion.div
            variants={itemVariants}
            className="w-full mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            <Card 
              size="full"
              className="p-8 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500" 
              gradient
              glow="blue"
              interactive
            >
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                      <StatsIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Resume Quality Overview
                    </h3>
                  </div>
                  
                  {/* Main Score Display */}
                  <motion.div
                    className="flex items-center justify-center gap-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 1.2,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                          {completionScore}
                        </span>
                        <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">%</span>
                      </div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">Overall Quality Score</p>
                    </div>
                  </motion.div>

                  {/* Status Badge */}
                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                  >
                    <motion.div
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm ${
                        completionScore >= 90 ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 text-emerald-800 dark:text-emerald-200' :
                        completionScore >= 80 ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200' :
                        completionScore >= 70 ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 text-yellow-800 dark:text-yellow-200' :
                        'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 text-orange-800 dark:text-orange-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {completionScore >= 90 ? (
                        <>🌟 Outstanding Quality! <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }}>✨</motion.span></>
                      ) : completionScore >= 80 ? (
                        <>🎯 Excellent Work! <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>👏</motion.span></>
                      ) : completionScore >= 70 ? (
                        <>📈 Very Good Progress! <span>👍</span></>
                      ) : completionScore >= 60 ? (
                        <>⚡ Good Foundation! <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity }}>💪</motion.span></>
                      ) : (
                        <>🚀 Keep Building! <span className="animate-bounce">📝</span></>
                      )}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Enhanced Progress Bar */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.6, duration: 1.2, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                  >
                    <div className="relative overflow-hidden rounded-full">
                      <Progress
                        value={completionScore}
                        variant="success"
                        size="lg"
                        animated
                        gradient
                        className="h-5 rounded-full shadow-lg"
                      />
                      {/* Sparkle effect on progress bar */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent h-5 rounded-full"
                        animate={{ x: ["-50%", "150%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Score breakdown */}
                  <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span>Poor</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </motion.div>

                {/* Quick Stats Grid */}
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.6 }}
                >
                  {completionMetrics.sections.slice(0, 4).map((section, index) => (
                    <motion.div
                      key={section.id}
                      className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2 + (index * 0.1), duration: 0.4 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="text-2xl mb-2">{section.icon}</div>
                      <div className={`text-lg font-bold ${
                        section.quality >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                        section.quality >= 60 ? 'text-amber-600 dark:text-amber-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {section.quality}%
                      </div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1">
                        {section.name.split(' ')[0]}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Key Insights */}
                <motion.div
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
                      <BulbIcon />
                    </div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">Key Insights</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0"></span>
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        {completionMetrics.sections.filter(s => s.quality >= 80).length} sections complete
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        ATS-friendly format
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></span>
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        Professional design
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        Ready for download
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Items (if any improvements needed) */}
                {completionMetrics.recommendations.length > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8, duration: 0.6 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💡</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">Quick Improvements</h4>
                        <div className="text-sm text-amber-800 dark:text-amber-200">
                          {completionMetrics.recommendations.length} suggestions available in the detailed analysis below
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.header>

        {/* Main Content Area - Enhanced Two Column Layout */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col xl:flex-row gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8"
        >
          {/* Left Column - Enhanced PDF Preview */}
          <div className="flex-1 xl:flex-[3]">
            <div className="h-full overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/10 dark:to-purple-900/10 rounded-2xl">
              {/* Enhanced Preview Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
          </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
        <motion.div
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    </motion.div>
                  <div>
                      <h3 className="font-black text-white text-xl">Live Resume Preview</h3>
                      <p className="text-blue-100 text-sm font-medium">Real-time updates • Professional formatting • ATS optimized</p>
                  </div>
                </div>
                
                  <div className="flex items-center space-x-4">
                    {/* Enhanced Download status indicator */}
                    <motion.div 
                      className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div 
                        className={`w-3 h-3 rounded-full ${
                          isDownloading ? 'bg-yellow-400' : 'bg-emerald-400'
                        }`}
                        animate={isDownloading ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-sm font-semibold text-white">
                      {isDownloading ? 'Preparing download...' : 'Ready to download'}
                    </span>
                    </motion.div>
                    
                    {/* Quality indicator */}
                    <div className="flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <TrophyIcon />
                      <span className="text-sm font-bold text-emerald-100">
                        {completionScore}% Quality
                    </span>
                    </div>
                    {activeTemplate && (
                      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-sm font-semibold text-white">
                          Template: {activeTemplate.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Enhanced PDF Preview Content */}
              <div className="bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 p-8">
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-blue-800 overflow-hidden w-full relative group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Preview glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
                  
                  <div className="relative z-10 overflow-auto w-full h-full">
                    <TemplatePreview
                      ref={templatePreviewRef}
                      selectedTemplate={selectedTemplate}
                      formData={formData}
                      accentColor={accentColor}
                      fontStyle={fontStyle}
                      fontSize={fontSize}
                      sectionOrder={sectionOrder}
                      className="w-full min-w-full"
                      autoScale={true}
                      enableInteractions={true}
                    />
                  </div>
                  
                  {/* Preview overlay with subtle pattern */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Analysis Sections */}
          <div className="xl:col-span-1">
            <div className="space-y-8">
              {/* Enhanced Completion Breakdown */}
              <Card 
                className="p-8 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-gray-800 dark:via-blue-900/10 dark:to-indigo-900/10 border-2 border-blue-100 dark:border-blue-800"
                gradient
                glow="blue"
              >
            <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-blue-200 dark:border-blue-700">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <StatsIcon />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Resume Analysis
                </h3>
                  </div>
                
                <div className="space-y-4">
                    {completionMetrics.sections.map((section, index) => (
                      <motion.div 
                        key={section.id} 
                        className="group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-600 dark:hover:to-blue-900/30 transition-all duration-300 border border-blue-100 dark:border-blue-800 group-hover:border-blue-200 dark:group-hover:border-blue-700 group-hover:shadow-lg">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className="text-2xl p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              {section.icon}
                            </motion.div>
                        <div>
                              <p className="font-bold text-gray-900 dark:text-gray-100 text-base">{section.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{section.description}</p>
                        </div>
                      </div>
                          <div className="text-right space-y-2">
                            <motion.div 
                              className={`text-2xl font-black ${
                                section.quality >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                                section.quality >= 60 ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-600 dark:text-red-400'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: (index * 0.1) + 0.3, duration: 0.4, type: "spring" }}
                            >
                          {section.quality}%
                            </motion.div>
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                              <motion.div
                                className={`h-3 rounded-full shadow-sm ${
                                  section.quality >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                                  section.quality >= 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                              'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${section.quality}%` }}
                                transition={{ delay: (index * 0.1) + 0.5, duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                      </motion.div>
                  ))}
                  </div>
                </div>
              </Card>

              {/* Enhanced Recommendations */}
              {completionMetrics.recommendations.length > 0 && (
                <Card 
                  className="p-8 shadow-2xl bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 dark:from-gray-800 dark:via-amber-900/10 dark:to-orange-900/10 border-2 border-amber-100 dark:border-amber-800"
                  gradient
                  glow="yellow"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-amber-200 dark:border-amber-700">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <BulbIcon />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Improvement Suggestions
                  </h3>
                    </div>
                  
                  <div className="space-y-4">
                    {completionMetrics.recommendations.map((rec, index) => (
                        <motion.div 
                          key={index} 
                          className={`group relative overflow-hidden rounded-2xl border-l-4 ${
                            rec.priority === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-red-500 dark:border-red-600' :
                            rec.priority === 'medium' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-500 dark:border-amber-600' :
                            'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-500 dark:border-blue-600'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="p-5">
                            <div className="flex items-start space-x-4">
                              <motion.div
                                className="text-2xl mt-1 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                                whileHover={{ scale: 1.1, rotate: 10 }}
                              >
                            {rec.priority === 'high' ? '🔴' :
                             rec.priority === 'medium' ? '🟡' : '🔵'}
                              </motion.div>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-gray-100 text-base mb-2">{rec.section}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rec.suggestion}</p>
                          </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                rec.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                                rec.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                              }`}>
                                {rec.priority.toUpperCase()}
                        </div>
                      </div>
                          </div>
                          
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </motion.div>

                {/* Enhanced Download Section */}
        <motion.div
          variants={itemVariants}
          className="text-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Download Header */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
            <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Ready to Download Your Resume?
              </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
                  Your professional resume is polished and ready! Download it in PDF format for the best compatibility and professional appearance.
              </p>
            </div>
            </motion.div>
            
            {/* Enhanced Download Button */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <Button
                variant="primary"
                  size="xl"
                onClick={handlePDFDownload}
                disabled={isDownloading}
                  gradient
                  glow
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 border-0 relative overflow-hidden group"
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    {isDownloading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                        </motion.div>
                        <span className="text-lg">Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <DownloadIcon />
                        <span className="text-lg">Download PDF Resume</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ⚡
                        </motion.span>
                      </>
                    )}
                </div>
              </Button>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Tips Section */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <BulbIcon />
                </div>
                <div className="text-left space-y-2">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Pro Tips for Success
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• PDF format ensures perfect formatting on any device</li>
                    <li>• Your resume is ATS-optimized for applicant tracking systems</li>
                    <li>• Professional design makes an excellent first impression</li>
                  </ul>
            </div>
              </div>
            </motion.div>
            
            {/* Download Stats */}
            <motion.div
              className="flex justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>High Quality PDF</span>
            </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>ATS Compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Professional Format</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default FinalReviewStep;
