import React from 'react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';

const ProfessionalDetailsStep = ({ formData, handleChange }) => {
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

  const getProfileSpecificFields = () => {
    switch (formData.profileType) {
      case 'student':
        return [
          { key: 'careerGoals', label: 'Career Goals & Aspirations', type: 'textarea', placeholder: 'What are your short-term and long-term career goals?', required: true },
          { key: 'targetIndustries', label: 'Target Industries', type: 'text', placeholder: 'e.g., Technology, Healthcare, Finance, Consulting', required: true },
          { key: 'preferredWorkStyle', label: 'Preferred Work Style', type: 'text', placeholder: 'e.g., Remote, Hybrid, On-site, Travel', required: false },
          { key: 'relocationWillingness', label: 'Relocation Willingness', type: 'text', placeholder: 'e.g., Willing to relocate, Remote only, Local opportunities', required: false }
        ];
      case 'experienced':
        return [
          { key: 'careerObjectives', label: 'Career Objectives', type: 'textarea', placeholder: 'What are your next career goals and aspirations?', required: true },
          { key: 'targetRoles', label: 'Target Roles/Positions', type: 'text', placeholder: 'e.g., Senior Manager, Director, VP, C-level', required: true },
          { key: 'preferredCompanySize', label: 'Preferred Company Size', type: 'text', placeholder: 'e.g., Startup, Mid-size, Enterprise, Fortune 500', required: false },
          { key: 'industryPreferences', label: 'Industry Preferences', type: 'text', placeholder: 'e.g., Technology, Healthcare, Finance, Consulting', required: false }
        ];
      case 'career_changer':
        return [
          { key: 'motivationForChange', label: 'Motivation for Career Change', type: 'textarea', placeholder: 'What drives your desire to change careers?', required: true },
          { key: 'targetIndustry', label: 'Target Industry', type: 'text', placeholder: 'e.g., Technology, Healthcare, Finance, Education', required: true },
          { key: 'timelineForTransition', label: 'Timeline for Transition', type: 'text', placeholder: 'e.g., Immediate, 3-6 months, 6-12 months', required: true },
          { key: 'supportingActivities', label: 'Supporting Activities', type: 'textarea', placeholder: 'Courses, certifications, networking, side projects', required: false }
        ];
      case 'academic':
        return [
          { key: 'researchInterests', label: 'Research Interests & Focus Areas', type: 'textarea', placeholder: 'Your primary and secondary research interests', required: true },
          { key: 'collaborationPreferences', label: 'Collaboration Preferences', type: 'text', placeholder: 'e.g., Interdisciplinary, International, Industry partnerships', required: false },
          { key: 'fundingSources', label: 'Funding Sources & Grants', type: 'textarea', placeholder: 'Types of funding you\'ve received or are seeking', required: false },
          { key: 'publicationGoals', label: 'Publication & Impact Goals', type: 'textarea', placeholder: 'Your goals for publications and research impact', required: false }
        ];
      case 'creative':
        return [
          { key: 'creativeVision', label: 'Creative Vision & Style', type: 'textarea', placeholder: 'Describe your unique creative vision and style', required: true },
          { key: 'targetAudience', label: 'Target Audience/Client Base', type: 'text', placeholder: 'e.g., Corporate, Non-profit, Individual clients, Agencies', required: true },
          { key: 'creativeProcess', label: 'Creative Process & Methodology', type: 'textarea', placeholder: 'How do you approach creative projects?', required: false },
          { key: 'industryTrends', label: 'Industry Trends & Innovations', type: 'textarea', placeholder: 'How do you stay current with industry trends?', required: false }
        ];
      default:
        return [
          { key: 'careerGoals', label: 'Career Goals', type: 'textarea', placeholder: 'What are your career objectives?', required: true },
          { key: 'targetIndustries', label: 'Target Industries', type: 'text', placeholder: 'Industries you\'re interested in', required: true }
        ];
    }
  };

  const profileFields = getProfileSpecificFields();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 mb-4">
          Professional Details
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Help us understand your professional aspirations and preferences to create a more targeted and impactful resume.
        </p>
      </motion.div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileFields.map((field, index) => (
          <motion.div
            key={field.key}
            variants={itemVariants}
            className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6 ${
              field.type === 'textarea' ? 'md:col-span-2' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                {index + 1}
              </div>
              <div className="flex-1">
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {field.label}
                  {field.required && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-200 px-2 py-1 rounded-full">Required</span>
                  )}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.key}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
                    rows="4"
                    required={field.required}
                  />
                ) : (
                  <Input
                    type={field.type}
                    name={field.key}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6 md:col-span-2"
        >
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
              {profileFields.length + 1}
            </div>
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                References
              </label>
              <textarea
                name="referencesText"
                placeholder={`Enter one reference per line\nExample: John Doe | Senior Manager | ABC Ltd | +8801XXXXXXXXX | john@example.com`}
                value={formData.referencesText || ''}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
                rows="4"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Optional. Write each reference on a new line and it will appear in the PDF.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Professional Context */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why This Matters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">Helps AI generate more targeted and relevant content</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">Creates a more personalized professional summary</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">Improves resume alignment with target roles</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">Enhances overall resume impact and relevance</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-6 border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Completion Progress</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {profileFields.filter(field => formData[field.key] && formData[field.key].trim()).length} of {profileFields.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(profileFields.filter(field => formData[field.key] && formData[field.key].trim()).length / profileFields.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfessionalDetailsStep;
