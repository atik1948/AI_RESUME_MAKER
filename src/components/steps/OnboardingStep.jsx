import React from 'react';
import { motion } from 'framer-motion';
import { handleAiRewrite } from '../../utils/aiHelpers';
import Button from '../ui/Button';
import Input from '../ui/Input';

const OnboardingStep = ({ formData, handleChange, loading, setLoading, saveFormData }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const profileTypes = [
    {
      value: 'student',
      label: 'Student/Recent Graduate',
      icon: '🎓',
      description: 'Perfect! We\'ll focus on your education, projects, internships, and potential.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'experienced',
      label: 'Experienced Professional',
      icon: '💼',
      description: 'Great! We\'ll highlight your professional achievements, leadership, and expertise.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      value: 'career_changer',
      label: 'Career Changer',
      icon: '🔄',
      description: 'Excellent! We\'ll emphasize your transferable skills and new field preparation.',
      color: 'from-green-500 to-teal-500'
    },
    {
      value: 'academic',
      label: 'Academic/Researcher',
      icon: '🔬',
      description: 'Wonderful! We\'ll showcase your research, publications, and academic contributions.',
      color: 'from-orange-500 to-red-500'
    },
    {
      value: 'creative',
      label: 'Creative/Portfolio-based',
      icon: '🎨',
      description: 'Amazing! We\'ll feature your portfolio, creative projects, and artistic skills.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const selectedProfile = profileTypes.find(type => type.value === formData.profileType);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 mb-4">
          Welcome! Let's get started.
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tell us a bit about yourself to tailor your resume building experience and create something truly exceptional.
        </p>
      </motion.div>

      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column - Profile Type */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Profile Type
            </h3>
            
            <div className="space-y-3">
              {profileTypes.map((type) => (
                <motion.label
                  key={type.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.profileType === type.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 shadow-md'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="profileType"
                    value={type.value}
                    checked={formData.profileType === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center text-white text-lg`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{type.label}</div>
                    </div>
                    {formData.profileType === type.value && (
                      <div className="text-blue-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.label>
              ))}
            </div>
          </div>
        </motion.div>


        {/* Right Column - Basic Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <Input
                type="text"
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName || ''}
                onChange={handleChange}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              
              <Input
                type="text"
                name="targetJobTitle"
                label="Target Job Title"
                placeholder="e.g., Software Engineer, Marketing Manager"
                value={formData.targetJobTitle || ''}
                onChange={handleChange}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                }
              />

              <Input
                type="text"
                name="targetIndustry"
                label="Target Industry"
                placeholder="e.g., Technology, Healthcare, Finance, Education"
                value={formData.targetIndustry || ''}
                onChange={handleChange}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Career Goals
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-full">Optional but Recommended</span>
                </label>
                <textarea
                  name="careerGoals"
                  placeholder="Briefly describe your career goals and what you hope to achieve in your next role..."
                  value={formData.careerGoals || ''}
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
                  rows="3"
                />
              </div>

              {/* <div className="pt-4">
                <Button
                  onClick={() => handleAiRewrite(
                    formData.fullName || '',
                    'Format this name professionally and correctly capitalize it',
                    formData,
                    () => {},
                    saveFormData,
                    setLoading,
                    'fullName'
                  )}
                  variant="outline"
                  size="sm"
                  disabled={loading || !formData.fullName}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Formatting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Format Name
                    </>
                  )}
                </Button>
              </div> */}
            </div>
          </div>
        </motion.div>


      </div>

      {/* Selected Profile Info */}
      {selectedProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className={`bg-gradient-to-r ${selectedProfile.color} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {selectedProfile.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{selectedProfile.label} Profile</h3>
                <p className="text-white/90">{selectedProfile.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OnboardingStep;
