import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { handleAiRewrite } from '../../utils/aiHelpers';
import { generateEnhancedAiSuggestions, analyzeContent } from '../../utils/enhancedAIHelpers';
import { skillsToText } from '../../utils/resumeData';
import { AIAssistant, SmartInput } from '../ui';
import Button from '../ui/Button';

const SummaryStep = ({ formData, setFormData, handleChange, loading, setLoading, saveFormData, getProfileContextForSummary }) => {
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState(null);

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

  // Real-time analytics calculation using useMemo
  const summaryAnalytics = useMemo(() => {
    const text = formData.summary || '';
    const words = text.split(' ').filter(word => word.length > 0);
    const wordCount = words.length;
    const charCount = text.length;
    
    // Update content analysis
    if (text) {
      const analysis = analyzeContent(text, 'summary', formData.targetJobTitle);
      setContentAnalysis(analysis);
    }
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    
    // Calculate readability metrics
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    
    // Determine quality metrics
    const isOptimalLength = wordCount >= 50 && wordCount <= 150;
    const hasGoodReadability = avgWordsPerSentence <= 20 && avgWordsPerSentence >= 10;
    
    // Calculate overall score
    let score = 0;
    if (wordCount >= 50 && wordCount <= 150) score += 40;
    else if (wordCount >= 30 && wordCount < 50) score += 20;
    else if (wordCount > 150 && wordCount <= 200) score += 20;
    
    if (hasGoodReadability) score += 30;
    else if (avgWordsPerSentence > 0) score += 15;
    
    if (text.includes(formData.targetJobTitle || '')) score += 15;
    if (sentenceCount >= 3 && sentenceCount <= 6) score += 15;
    
    return {
      wordCount,
      charCount,
      charCountNoSpaces,
      sentenceCount,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      isOptimalLength,
      hasGoodReadability,
      score: Math.min(score, 100),
      progressPercentage: Math.min((wordCount / 150) * 100, 100)
    };
  }, [formData.summary, formData.targetJobTitle]);

  const generateAISummary = async () => {
    const profileContext = getProfileContextForSummary();
    const additionalContext = `
      Target Role: ${formData.targetJobTitle || 'Not specified'}
      Profile Type: ${formData.profileType || 'Not specified'}
      Years of Experience: ${formData.yearsExperience || 'Not specified'}
      Key Skills: ${skillsToText(formData.skills) || 'Not specified'}
      Career Goals: ${formData.careerGoals || formData.careerObjectives || 'Not specified'}
      Target Industries: ${formData.targetIndustries || formData.industryExperience || 'Not specified'}
    `;
    const enhancedPrompt = `Generate a compelling professional summary for a ${formData.profileType} targeting a ${formData.targetJobTitle} role. ${profileContext} ${additionalContext}`;
    
    await handleAiRewrite(
      formData.summary,
      enhancedPrompt,
      formData,
      setFormData,
      saveFormData,
      setLoading,
      'summary'
    );
  };

  const generateMultipleSuggestions = async () => {
    setLoading(true);
    try {
      const profileContext = getProfileContextForSummary();
      
      const suggestions = await generateEnhancedAiSuggestions('summary', formData, {
        numOptions: 4,
        targetJobTitle: formData.targetJobTitle || '',
        profileType: formData.profileType || '',
        industry: formData.industryExperience || '',
        experienceLevel: formData.yearsExperience || ''
      });

      // Add style information to suggestions
      const enhancedSuggestions = suggestions.map((suggestion, index) => ({
        ...suggestion,
        id: index + 1,
        style: index === 0 ? 'Achievement-Focused' : 
               index === 1 ? 'Skills-Focused' : 
               index === 2 ? 'Goal-Oriented' : 'Professional'
      }));
      
      setAiSuggestions(enhancedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback to original method
      try {
        const profileContext = getProfileContextForSummary();
        const suggestions = [];
        
        const prompts = [
          `Generate a professional summary for a ${formData.profileType} targeting a ${formData.targetJobTitle} role. Focus on achievements and impact. ${profileContext}`,
          `Create a compelling professional summary for a ${formData.profileType} seeking a ${formData.targetJobTitle} position. Emphasize skills and value proposition. ${profileContext}`,
          `Write a concise professional summary for a ${formData.profileType} applying for ${formData.targetJobTitle} roles. Highlight unique strengths and career goals. ${profileContext}`
        ];

        for (let i = 0; i < prompts.length; i++) {
          const suggestion = await handleAiRewrite(
            '',
            prompts[i],
            formData,
            () => {},
            () => {},
            setLoading,
            'temp'
          );
          if (suggestion) {
            suggestions.push({
              id: i + 1,
              text: suggestion,
              style: i === 0 ? 'Achievement-Focused' : i === 1 ? 'Skills-Focused' : 'Goal-Oriented'
            });
          }
        }
        
        setAiSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = (suggestion) => {
    const syntheticEvent = {
      target: {
        name: 'summary',
        value: suggestion.text
      }
    };
    handleChange(syntheticEvent);
    // Don't close suggestions to allow multiple selections
  };

  const handleGenerateMoreSuggestions = async () => {
    setLoading(true);
    try {
      const newSuggestions = await generateEnhancedAiSuggestions('summary', formData, {
        numOptions: 3,
        targetJobTitle: formData.targetJobTitle || '',
        profileType: formData.profileType || '',
        industry: formData.industryExperience || '',
        experienceLevel: formData.yearsExperience || '',
        existingSuggestions: aiSuggestions,
        appendMode: true
      });

      // Add style information to suggestions
      const enhancedSuggestions = newSuggestions.map((suggestion, index) => ({
        ...suggestion,
        id: aiSuggestions.length + index + 1,
        style: index === 0 ? 'Achievement-Focused' : 
               index === 1 ? 'Skills-Focused' : 
               index === 2 ? 'Goal-Oriented' : 'Professional'
      }));
      
      setAiSuggestions(enhancedSuggestions);
    } catch (error) {
      console.error('Error generating more suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get status color based on analytics
  const getStatusColor = (value, optimal, warning) => {
    if (value >= optimal[0] && value <= optimal[1]) return 'text-green-600 dark:text-green-400';
    if (value >= warning[0] && value <= warning[1]) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = () => {
    if (summaryAnalytics.isOptimalLength) return 'bg-green-500';
    if (summaryAnalytics.wordCount < 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 mb-4">
          Professional Summary
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create a compelling summary that captures your unique value proposition and career objectives.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Editor */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write Your Summary
              </h3>
              <div className={`text-sm px-3 py-1 rounded-full ${
                summaryAnalytics.isOptimalLength 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' 
                  : summaryAnalytics.wordCount < 50 
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
              }`}>
                {summaryAnalytics.wordCount} words {summaryAnalytics.isOptimalLength ? '✓' : summaryAnalytics.wordCount < 50 ? '(too short)' : '(too long)'}
              </div>
            </div>
            
            <textarea 
              name="summary" 
              placeholder="Write a concise summary that highlights your key strengths, achievements, and career objectives. AI can help you craft the perfect summary!"
              onChange={handleChange} 
              value={formData.summary || ''} 
              className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
              rows="8" 
              required 
            />

            {/* Writing Tips */}
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/50 rounded-xl border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Writing Tips
              </h4>
              <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                <li>• Keep it between 50-150 words for optimal impact</li>
                <li>• Start with your professional title or key qualification</li>
                <li>• Include 2-3 key achievements or skills</li>
                <li>• End with your career objective or value proposition</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* AI Assistant Panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* AI Generation */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Assistant
            </h3>
            
             <div className="space-y-3">
              <Button
                onClick={generateAISummary}
                disabled={loading || !formData.profileType || !formData.targetJobTitle}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>🔄 Generate Summary</span>
                  </>
                )}
              </Button>

              <Button
                onClick={generateMultipleSuggestions}
                disabled={loading || !formData.profileType || !formData.targetJobTitle}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>✨ Get AI Variations</span>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                AI will use your profile information to create a personalized summary tailored to your target role.
              </p>
            </div>
          </div>

          {/* Enhanced Real-time Summary Analytics */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Summary Analytics
              <motion.div
                className="ml-2 w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </h3>
            
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Overall Quality</span>
                  <span className={`text-lg font-bold ${getStatusColor(summaryAnalytics.score, [80, 100], [60, 79])}`}>
                    {summaryAnalytics.score}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <motion.div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      summaryAnalytics.score >= 80 ? 'bg-green-500' : 
                      summaryAnalytics.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${summaryAnalytics.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Word Count */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Word Count</span>
                <span className={`text-sm font-medium ${getStatusColor(summaryAnalytics.wordCount, [50, 150], [30, 200])}`}>
                  {summaryAnalytics.wordCount}/150
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${summaryAnalytics.progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${summaryAnalytics.progressPercentage}%` }}
                />
              </div>

              {/* Character Count */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Characters</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {summaryAnalytics.charCount} ({summaryAnalytics.charCountNoSpaces} without spaces)
                </span>
              </div>

              {/* Sentence Analysis */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sentences</span>
                <span className={`text-sm font-medium ${getStatusColor(summaryAnalytics.sentenceCount, [3, 6], [2, 8])}`}>
                  {summaryAnalytics.sentenceCount}
                </span>
              </div>

              {/* Readability */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Words/Sentence</span>
                <span className={`text-sm font-medium ${getStatusColor(summaryAnalytics.avgWordsPerSentence, [10, 20], [8, 25])}`}>
                  {summaryAnalytics.avgWordsPerSentence}
                </span>
              </div>

              {/* Dynamic Feedback */}
              <motion.div 
                className="text-xs text-gray-500 dark:text-gray-400 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700"
                key={summaryAnalytics.wordCount} // Re-animate when word count changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {summaryAnalytics.wordCount === 0 && '✍️ Start writing your professional summary'}
                {summaryAnalytics.wordCount > 0 && summaryAnalytics.wordCount < 30 && '📝 Keep going! Add more details about your experience'}
                {summaryAnalytics.wordCount >= 30 && summaryAnalytics.wordCount < 50 && '📈 Good start! Add a few more key achievements'}
                {summaryAnalytics.wordCount >= 50 && summaryAnalytics.wordCount <= 150 && '✅ Perfect length for maximum impact'}
                {summaryAnalytics.wordCount > 150 && summaryAnalytics.wordCount <= 200 && '⚠️ Consider shortening for better readability'}
                {summaryAnalytics.wordCount > 200 && '🔴 Too long - aim for 50-150 words for optimal impact'}
              </motion.div>

              {/* Quality Indicators */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className={`text-xs p-2 rounded-lg text-center ${
                  summaryAnalytics.isOptimalLength 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400'
                }`}>
                  {summaryAnalytics.isOptimalLength ? '✅' : '⏳'} Length
                </div>
                <div className={`text-xs p-2 rounded-lg text-center ${
                  summaryAnalytics.hasGoodReadability 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400'
                }`}>
                  {summaryAnalytics.hasGoodReadability ? '✅' : '⏳'} Readability
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced AI Assistant */}
      <AIAssistant
        isVisible={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        suggestions={aiSuggestions}
        loading={loading}
        onApplySuggestion={applySuggestion}
        onGenerateMore={handleGenerateMoreSuggestions}
        fieldType="summary"
        context={{
          profileType: formData.profileType,
          targetRole: formData.targetJobTitle,
          experience: formData.yearsExperience
        }}
        title="AI-Generated Summary Variations"
        subtitle="Professional summary options tailored to your profile"
        autoClose={false}
        enableBatch={true}
      />
    </motion.div>
  );
};

export default SummaryStep;
