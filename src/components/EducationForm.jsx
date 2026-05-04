import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from './ui/Input';
import Button from './ui/Button';
import { AIAssistant } from './ui';
import { generateEnhancedAiSuggestions, analyzeContent } from '../utils/enhancedAIHelpers';
import { generateAiSuggestions, cleanAiResponse } from '../utils/aiHelpers';

const EducationForm = ({ education, index, handleChange, handleRemove, handleAiRewrite, loading, formData = {} }) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState(null);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Real-time content analysis
  useEffect(() => {
    if (education.coursework) {
      const analysis = analyzeContent(education.coursework, 'coursework', formData.targetJobTitle);
      setContentAnalysis(analysis);
    }
  }, [education.coursework, formData.targetJobTitle]);

  const handleGenerateSuggestions = async () => {
    if (!education.degree) {
      alert("Please fill in your Degree/Field of Study to get relevant suggestions.");
      return;
    }
    
    // If we already have suggestions, just open the dialog
    if (aiSuggestions.length > 0) {
      setShowAIAssistant(true);
      return;
    }
    
    setSuggestionsLoading(true);
    setShowAIAssistant(true);
    
    try {
      const suggestions = await generateEnhancedAiSuggestions('coursework', education, {
        numOptions: 4,
        targetJobTitle: formData.targetJobTitle || '',
        profileType: formData.profileType || '',
        industry: formData.industryExperience || ''
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback to basic suggestions
      const basicSuggestions = await generateAiSuggestions('coursework', education);
      setAiSuggestions(basicSuggestions.map(text => ({ text, type: 'coursework' })));
    }
    setSuggestionsLoading(false);
  };

  const handleGenerateMoreSuggestions = async () => {
    setSuggestionsLoading(true);
    
    try {
      const newSuggestions = await generateEnhancedAiSuggestions('coursework', education, {
        numOptions: 3,
        targetJobTitle: formData.targetJobTitle || '',
        profileType: formData.profileType || '',
        industry: formData.industryExperience || '',
        existingSuggestions: aiSuggestions,
        appendMode: true
      });
      setAiSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating more suggestions:', error);
    }
    setSuggestionsLoading(false);
  };

  const handleAISuggestion = (suggestion) => {
    const suggestionText = cleanAiResponse(suggestion.text || suggestion, 'coursework');
    const currentCoursework = cleanAiResponse(education.coursework || '', 'coursework');
    const newCoursework = currentCoursework ? `${currentCoursework}, ${suggestionText}` : suggestionText;
    const event = {
      target: {
        name: 'coursework',
        value: newCoursework
      }
    };
    handleChange(event, index, 'education');
    // Don't close the assistant anymore to allow multiple selections
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education #{index + 1}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Academic background and achievements</p>
          </div>
        </div>
        {index > 0 && (
          <Button
            onClick={() => handleRemove(index)}
            variant="destructive"
            size="sm"
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove
          </Button>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School/University */}
        <div className="md:col-span-2">
          <Input
            type="text"
            name="school"
            label="School/University"
            placeholder="e.g., Harvard University, MIT, Stanford University"
            value={education.school || ''}
            onChange={(e) => handleChange(e, index, 'education')}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>

        {/* Degree */}
        <div className="md:col-span-2">
          <Input
            type="text"
            name="degree"
            label="Degree/Field of Study"
            placeholder="e.g., Bachelor of Science in Computer Science, MBA"
            value={education.degree || ''}
            onChange={(e) => handleChange(e, index, 'education')}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            }
          />
        </div>

        {/* Date Range */}
        <Input
          type="text"
          name="startDate"
          label="Start Date"
          placeholder="e.g., Sep 2018, Fall 2018"
          value={education.startDate || ''}
          onChange={(e) => handleChange(e, index, 'education')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <Input
          type="text"
          name="endDate"
          label="End Date"
          placeholder="e.g., May 2022, Present, Expected 2024"
          value={education.endDate || ''}
          onChange={(e) => handleChange(e, index, 'education')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* GPA */}
        <Input
          type="text"
          name="gpa"
          label="GPA (Optional)"
          placeholder="e.g., 3.8/4.0, 3.75, Magna Cum Laude"
          value={education.gpa || ''}
          onChange={(e) => handleChange(e, index, 'education')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />

        {/* Coursework */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Relevant Coursework or Honors (Optional)
            </label>
            <div className="flex space-x-2">
              <Button
                onClick={handleGenerateSuggestions}
                size="sm"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={suggestionsLoading}
              >
                {suggestionsLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>✨ AI Suggest</span>
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleAiRewrite(index)}
                size="sm"
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rewriting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>🔄 AI Rewrite</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          <textarea
            name="coursework"
            placeholder="e.g., Data Structures, Machine Learning, Dean's List, Summa Cum Laude, Relevant projects or academic achievements"
            value={education.coursework || ''}
            onChange={(e) => handleChange(e, index, 'education')}
            className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
            rows="3"
          />
        </div>
      </div>

      {/* Enhanced AI Assistant */}
      <AIAssistant
        isVisible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        suggestions={aiSuggestions}
        loading={suggestionsLoading}
        onApplySuggestion={handleAISuggestion}
        onGenerateMore={handleGenerateMoreSuggestions}
        fieldType="coursework"
        context={{
          degree: education.degree,
          school: education.school,
          targetRole: formData.targetJobTitle
        }}
        title="AI-Powered Coursework Suggestions"
        subtitle={`Relevant coursework suggestions for ${education.degree || 'your field of study'}`}
        autoClose={false}
        enableBatch={true}
      />

      {/* Education Tips */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Education Tips
        </h4>
        <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <li>• Include GPA if 3.5 or higher</li>
          <li>• List relevant coursework that matches your target job</li>
          <li>• Include academic honors, awards, or distinctions</li>
          <li>• For recent graduates, education should come before experience</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default EducationForm;
