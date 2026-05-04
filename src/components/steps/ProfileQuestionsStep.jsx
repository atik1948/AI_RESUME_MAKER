import React from 'react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';

const ProfileQuestionsStep = ({ formData, handleChange, profileQuestions }) => {
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

  const getProfileConfig = () => {
    switch (formData.profileType) {
      case 'student':
        return {
          title: '🎓 Student Profile Details',
          description: 'Help us understand your academic background and career aspirations to create a compelling student resume.',
          color: 'from-blue-500 to-cyan-500',
          tips: [
            'Highlight relevant coursework that matches your target job',
            'Include leadership roles and volunteer experiences',
            'Quantify achievements where possible (GPA, project outcomes)',
            'Emphasize internships and practical experience'
          ]
        };
      case 'experienced':
        return {
          title: '💼 Professional Background',
          description: 'Share your professional journey and achievements to showcase your expertise and career progression.',
          color: 'from-purple-500 to-indigo-500',
          tips: [
            'Use specific numbers and metrics to quantify achievements',
            'Focus on leadership and strategic contributions',
            'Highlight industry-specific expertise and certifications',
            'Emphasize career progression and promotions'
          ]
        };
      case 'career_changer':
        return {
          title: '🔄 Career Transition Details',
          description: 'Tell us about your career change journey to highlight transferable skills and new field preparation.',
          color: 'from-green-500 to-teal-500',
          tips: [
            'Emphasize transferable skills from your previous career',
            'Show proactive steps taken to enter the new field',
            'Connect past experiences to future goals',
            'Highlight relevant training and certifications'
          ]
        };
      case 'academic':
        return {
          title: '🔬 Academic & Research Background',
          description: 'Share your research experience and academic contributions to create a comprehensive academic profile.',
          color: 'from-orange-500 to-red-500',
          tips: [
            'Include impact factors and citation counts where relevant',
            'Highlight interdisciplinary collaborations',
            'Quantify grant amounts and research outcomes',
            'Emphasize teaching and mentoring experience'
          ]
        };
      case 'creative':
        return {
          title: '🎨 Creative Professional Details',
          description: 'Showcase your creative expertise and portfolio to demonstrate your artistic and business capabilities.',
          color: 'from-pink-500 to-rose-500',
          tips: [
            'Ensure your portfolio URL is current and professional',
            'Highlight measurable project outcomes and client satisfaction',
            'Balance creative skills with business acumen',
            'Include awards and recognition'
          ]
        };
      default:
        return {
          title: 'Profile Details',
          description: 'Help us understand your background to create a targeted resume.',
          color: 'from-gray-500 to-gray-600',
          tips: []
        };
    }
  };

  const profileConfig = getProfileConfig();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${profileConfig.color} rounded-full mb-4`}>
          <span className="text-2xl">
            {formData.profileType === 'student' && '🎓'}
            {formData.profileType === 'experienced' && '💼'}
            {formData.profileType === 'career_changer' && '🔄'}
            {formData.profileType === 'academic' && '🔬'}
            {formData.profileType === 'creative' && '🎨'}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 mb-4">
          {profileConfig.title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {profileConfig.description}
        </p>
      </motion.div>

      {/* Questions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileQuestions.map((question, index) => (
          <motion.div
            key={question.key}
            variants={itemVariants}
            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6"
          >
            <div className="flex items-start space-x-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${profileConfig.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {question.label}
                  {question.required && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-200 px-2 py-1 rounded-full">Required</span>
                  )}
                </label>
                
                {question.type === 'textarea' ? (
                  <textarea
                    name={question.key}
                    placeholder={question.placeholder}
                    value={formData[question.key] || ''}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
                    rows="4"
                    required={question.required}
                  />
                ) : (
                  <Input
                    type={question.type}
                    name={question.key}
                    placeholder={question.placeholder}
                    value={formData[question.key] || ''}
                    onChange={handleChange}
                    required={question.required}
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
            <div className={`w-8 h-8 bg-gradient-to-r ${profileConfig.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1`}>
              {profileQuestions.length + 1}
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
                className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
                rows="4"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Optional. Write each reference on a new line and it will appear in the PDF.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tips Section */}
      {profileConfig.tips.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <div className={`bg-gradient-to-r ${profileConfig.color} rounded-2xl p-6 text-white shadow-xl`}>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Pro Tips for {formData.profileType === 'student' ? 'Students' : 
                           formData.profileType === 'experienced' ? 'Professionals' :
                           formData.profileType === 'career_changer' ? 'Career Changers' :
                           formData.profileType === 'academic' ? 'Academics' :
                           formData.profileType === 'creative' ? 'Creatives' : 'Your Profile'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileConfig.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/90 text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Indicator */}
      {profileQuestions.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-6 border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Completion Progress</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {profileQuestions.filter(q => formData[q.key] && formData[q.key].trim()).length} of {profileQuestions.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${profileConfig.color} h-2 rounded-full transition-all duration-500 ease-out`}
                style={{
                  width: `${(profileQuestions.filter(q => formData[q.key] && formData[q.key].trim()).length / profileQuestions.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileQuestionsStep;
