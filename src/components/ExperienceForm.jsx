import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from './ui/Input';
import Button from './ui/Button';
import { AIAssistant } from './ui';
import { generateEnhancedAiSuggestions, analyzeContent } from '../utils/enhancedAIHelpers';
import { generateAiSuggestions } from '../utils/aiHelpers';

const ExperienceForm = ({ experience, index, handleChange, handleRemove, handleAiRewrite, loading, formData = {} }) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState(null);
  const [suggestionStyle, setSuggestionStyle] = useState('achievement-focused');

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
    if (experience.description) {
      const analysis = analyzeContent(experience.description, 'responsibilities', formData.targetJobTitle);
      setContentAnalysis(analysis);
    }
  }, [experience.description, formData.targetJobTitle]);

  const handleGenerateSuggestions = async (style = suggestionStyle) => {
    if (!experience.jobTitle || !experience.company) {
      alert("Please fill in your Job Title and Company to get relevant suggestions.");
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
      const suggestions = await generateEnhancedAiSuggestions('responsibilities', experience, {
        numOptions: 5,
        style: style,
        targetJobTitle: formData.targetJobTitle || '',
        profileType: formData.profileType || '',
        industry: formData.industryExperience || '',
        experienceLevel: formData.yearsExperience || ''
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback to basic suggestions
      const basicSuggestions = await generateAiSuggestions('responsibilities', experience);
      setAiSuggestions(basicSuggestions.map(text => ({ text, type: 'responsibility' })));
    }
    setSuggestionsLoading(false);
  };

  const handleAISuggestion = (suggestion) => {
    const suggestionText = suggestion.text || suggestion;
    const currentDescription = experience.description || '';
    
    // Smart suggestion integration - check if it's a complete replacement or addition
    let newDescription;
    if (currentDescription.trim() === '') {
      newDescription = suggestionText.startsWith('•') ? suggestionText : `• ${suggestionText}`;
    } else {
      newDescription = suggestionText.startsWith('•') 
        ? `${currentDescription}\n${suggestionText}`
        : `${currentDescription}\n• ${suggestionText}`;
    }
    
    const event = {
      target: {
        name: 'description',
        value: newDescription
      }
    };
    handleChange(event, index, 'experience');
    // Don't close the assistant anymore to allow multiple selections
  };

  const handleGenerateMoreSuggestions = async () => {
    setSuggestionsLoading(true);
    
    try {
      const newSuggestions = await generateEnhancedAiSuggestions('responsibilities', experience, {
        numOptions: 3,
        style: suggestionStyle,
        targetJobTitle: formData.targetJobTitle || '',
        profileType: formData.profileType || '',
        industry: formData.industryExperience || '',
        experienceLevel: formData.yearsExperience || '',
        existingSuggestions: aiSuggestions,
        appendMode: true
      });
      setAiSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating more suggestions:', error);
    }
    setSuggestionsLoading(false);
  };

  const getContentQualityIndicator = () => {
    if (!contentAnalysis) return null;

    const { wordCount, hasActionVerbs, hasMetrics, suggestions } = contentAnalysis;
    let quality = 'Good';
    let color = 'text-green-600';

    if (hasActionVerbs && hasMetrics && wordCount > 50) {
      quality = 'Excellent';
      color = 'text-purple-600';
    } else if (hasActionVerbs && wordCount > 30) {
      quality = 'Great';
      color = 'text-blue-600';
    } else if (wordCount < 20) {
      quality = 'Needs Work';
      color = 'text-red-600';
    }

    return { quality, color, suggestions };
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
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience #{index + 1}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Professional work experience</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
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
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div className="md:col-span-2">
          <Input
            type="text"
            name="jobTitle"
            label="Job Title"
            placeholder="e.g., Senior Software Engineer, Product Manager, Marketing Specialist"
            value={experience.jobTitle || ''}
            onChange={(e) => handleChange(e, index, 'experience')}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            }
          />
        </div>

        {/* Company */}
        <div className="md:col-span-2">
          <Input
            type="text"
            name="company"
            label="Company"
            placeholder="e.g., Google, Microsoft, Apple, Startup Inc."
            value={experience.company || ''}
            onChange={(e) => handleChange(e, index, 'experience')}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <Input
            type="text"
            name="location"
            label="Location"
            placeholder="e.g., San Francisco, CA, Remote, New York, NY"
            value={experience.location || ''}
            onChange={(e) => handleChange(e, index, 'experience')}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>

        {/* Date Range */}
        <Input
          type="text"
          name="startDate"
          label="Start Date"
          placeholder="e.g., Jan 2020, January 2020"
          value={experience.startDate || ''}
          onChange={(e) => handleChange(e, index, 'experience')}
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
          placeholder="e.g., Dec 2023, Present"
          value={experience.endDate || ''}
          onChange={(e) => handleChange(e, index, 'experience')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Job Description */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Description & Achievements
                <span className="ml-2 text-xs bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-200 px-2 py-1 rounded-full">Required</span>
              </label>
              {contentAnalysis && (
                <div className="mt-1 flex items-center space-x-3">
                  {(() => {
                    const qualityInfo = getContentQualityIndicator();
                    return qualityInfo ? (
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${qualityInfo.color}`}>
                          Quality: {qualityInfo.quality}
                        </span>
                        <span className="text-xs text-gray-500">
                          {contentAnalysis.wordCount} words
                        </span>
                        {contentAnalysis.hasActionVerbs && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Action Verbs ✓
                          </span>
                        )}
                        {contentAnalysis.hasMetrics && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Metrics ✓
                          </span>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {/* AI Style Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">Style:</label>
                <select
                  value={suggestionStyle}
                  onChange={(e) => setSuggestionStyle(e.target.value)}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-neutral-800"
                >
                  <option value="achievement-focused">Achievement-Focused</option>
                  <option value="skills-focused">Skills-Focused</option>
                  <option value="leadership-focused">Leadership-Focused</option>
                  <option value="innovation-focused">Innovation-Focused</option>
                  <option value="collaborative">Collaborative</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleGenerateSuggestions(suggestionStyle)}
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
                  onClick={() => handleAiRewrite(index, 'description', 'Rewrite the following job description and achievements to be more professional and concise, following the provided writing tips.')}
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
          </div>
                                  <textarea
              name="description"
              placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results when possible&#10;• Focus on impact and outcomes&#10;• Example: 'Increased sales by 25% through new strategy'"
              value={experience.description || ''}
              onChange={(e) => handleChange(e, index, 'experience')}
              className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
              rows="6"
            />

            {/* Key Metrics & Achievements */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Metrics & Achievements
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-full">Optional but Recommended</span>
              </label>
              <textarea
                name="metrics"
                placeholder="• Quantify your impact with specific numbers&#10;• Example: 'Reduced costs by 30%, Improved efficiency by 40%'&#10;• Include percentages, dollar amounts, time savings&#10;• Focus on business impact and results"
                value={experience.metrics || ''}
                onChange={(e) => handleChange(e, index, 'experience')}
                className="w-full p-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
                rows="3"
              />
            </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Use bullet points (•) for better formatting</span>
            <span>{(experience.description || '').length} characters</span>
          </div>
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
        fieldType="responsibilities"
        context={{
          jobTitle: experience.jobTitle,
          company: experience.company,
          targetRole: formData.targetJobTitle,
          style: suggestionStyle
        }}
        title="AI-Powered Achievement Suggestions"
        subtitle={`${suggestionStyle.replace('-', ' ')} suggestions for ${experience.jobTitle || 'this role'}`}
        autoClose={false}
        enableBatch={true}
      />

      {/* Content Analysis & Improvement Suggestions */}
      {contentAnalysis && contentAnalysis.suggestions && contentAnalysis.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
        >
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.860-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Content Improvement Suggestions
          </h4>
          <div className="space-y-2">
            {contentAnalysis.suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-l-4 ${
                  suggestion.priority === 'high' 
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                    : suggestion.priority === 'medium'
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    suggestion.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : suggestion.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {suggestion.type}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {suggestion.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Experience Tips */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/50 rounded-xl border border-purple-200 dark:border-purple-800">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Experience Writing Tips
        </h4>
        <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
          <li>• Start each bullet point with an action verb (Led, Developed, Implemented)</li>
          <li>• Include specific numbers and percentages when possible</li>
          <li>• Focus on achievements and impact, not just responsibilities</li>
          <li>• Tailor your descriptions to match the job you're applying for</li>
          <li>• Use the STAR method: Situation, Task, Action, Result</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ExperienceForm;
