import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from './ui/Input';
import Button from './ui/Button';
import { AIAssistant } from './ui';
import { generateEnhancedAiSuggestions, analyzeContent } from '../utils/enhancedAIHelpers';
import { generateAiSuggestions } from '../utils/aiHelpers';

const ProjectForm = ({ project, index, handleChange, handleRemove, handleAiRewrite, loading, formData = {} }) => {
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);
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

  const techSuggestions = {
    frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Material-UI'],
    backend: ['Node.js', 'Python', 'Java', 'C#', 'Go', 'Ruby', 'PHP', 'Express.js', 'Django', 'Spring Boot'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'SQLite', 'DynamoDB'],
    cloud: ['AWS', 'Google Cloud', 'Azure', 'Heroku', 'Vercel', 'Netlify', 'Docker', 'Kubernetes'],
    tools: ['Git', 'GitHub', 'GitLab', 'Jira', 'Figma', 'Postman', 'Jest', 'Cypress', 'Webpack']
  };

  const handleTechAdd = (tech) => {
    const currentTech = project.technologies || '';
    const techArray = currentTech.split(',').map(t => t.trim()).filter(t => t);
    
    if (!techArray.includes(tech)) {
      const newTech = techArray.length > 0 ? `${currentTech}, ${tech}` : tech;
      const event = {
        target: {
          name: 'technologies',
          value: newTech
        }
      };
      handleChange(event, index, 'projects');
    }
  };

  // Real-time content analysis
  useEffect(() => {
    if (project.description) {
      const analysis = analyzeContent(project.description, 'projectDescription', formData.targetJobTitle);
      setContentAnalysis(analysis);
    }
  }, [project.description, formData.targetJobTitle]);

  const handleGenerateSuggestions = async () => {
    if (!project.name) {
      alert("Please fill in your Project Name to get relevant suggestions.");
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
      const suggestions = await generateEnhancedAiSuggestions('projectDescription', project, {
        numOptions: 4,
        targetJobTitle: formData.targetJobTitle || '',
        profileType: formData.profileType || '',
        industry: formData.industryExperience || ''
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      // Fallback to basic suggestions
      const basicSuggestions = await generateAiSuggestions('projectDescription', project);
      setAiSuggestions(basicSuggestions.map(text => ({ text, type: 'projectDescription' })));
    }
    setSuggestionsLoading(false);
  };

  const handleGenerateMoreSuggestions = async () => {
    setSuggestionsLoading(true);
    
    try {
      const newSuggestions = await generateEnhancedAiSuggestions('projectDescription', project, {
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
    const suggestionText = suggestion.text || suggestion;
    const event = {
      target: {
        name: 'description',
        value: suggestionText
      }
    };
    handleChange(event, index, 'projects');
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
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Project #{index + 1}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Showcase your technical projects</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowTechSuggestions(!showTechSuggestions)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Tech Stack
          </Button>
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
        {/* Project Name */}
        <div className="md:col-span-2">
          <Input
            type="text"
            name="name"
            label="Project Name"
            placeholder="e.g., E-commerce Platform, Task Management App, Portfolio Website"
            value={project.name || ''}
            onChange={(e) => handleChange(e, index, 'projects')}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
        </div>

        {/* Technologies */}
        <div className="md:col-span-2">
          <Input
            type="text"
            name="technologies"
            label="Technologies Used"
            placeholder="e.g., React, Node.js, MongoDB, AWS, Docker"
            value={project.technologies || ''}
            onChange={(e) => handleChange(e, index, 'projects')}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate technologies with commas</p>
        </div>

        {/* Project Links */}
        <Input
          type="url"
          name="liveUrl"
          label="Live Demo URL (Optional)"
          placeholder="https://your-project-demo.com"
          value={project.liveUrl || ''}
          onChange={(e) => handleChange(e, index, 'projects')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          }
        />

        <Input
          type="url"
          name="githubUrl"
          label="GitHub Repository (Optional)"
          placeholder="https://github.com/username/project"
          value={project.githubUrl || ''}
          onChange={(e) => handleChange(e, index, 'projects')}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          }
        />

        {/* Project Duration */}
        <Input
          type="text"
          name="startDate"
          label="Start Date (Optional)"
          placeholder="e.g., Jan 2023, Q1 2023"
          value={project.startDate || ''}
          onChange={(e) => handleChange(e, index, 'projects')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <Input
          type="text"
          name="endDate"
          label="End Date (Optional)"
          placeholder="e.g., Mar 2023, Ongoing"
          value={project.endDate || ''}
          onChange={(e) => handleChange(e, index, 'projects')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Project Description */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Description & Key Features
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
            name="description"
            placeholder="• Describe what the project does and its main purpose&#10;• Highlight key features and functionality&#10;• Mention any challenges you overcame&#10;• Include metrics or results if applicable"
            value={project.description || ''}
            onChange={(e) => handleChange(e, index, 'projects')}
            className="w-full p-4 border-2 border-gray-200 dark:border-neutral-700 rounded-xl resize-vertical focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-neutral-800"
            rows="5"
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Focus on impact and technical achievements</span>
            <span>{(project.description || '').length} characters</span>
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
        fieldType="projectDescription"
        context={{
          name: project.name,
          technologies: project.technologies,
          targetRole: formData.targetJobTitle
        }}
        title="AI-Powered Project Description Suggestions"
        subtitle={`Compelling descriptions for ${project.name || 'your project'}`}
        autoClose={false}
        enableBatch={true}
      />

      {/* Technology Suggestions Panel */}
      {showTechSuggestions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/50 dark:to-teal-900/50 rounded-xl border border-green-200 dark:border-green-800"
        >
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Popular Technologies by Category
          </h4>
          <p className="text-green-700 dark:text-green-300 text-sm mb-3">
            Click on any technology to add it to your project:
          </p>
          
          {Object.entries(techSuggestions).map(([category, techs]) => (
            <div key={category} className="mb-4">
              <h5 className="font-medium text-green-800 dark:text-green-200 mb-2 capitalize">{category}</h5>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleTechAdd(tech)}
                    className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-full border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-200 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Project Tips */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/50 rounded-xl border border-green-200 dark:border-green-800">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Project Showcase Tips
        </h4>
        <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
          <li>• Include both personal and professional projects</li>
          <li>• Highlight projects that demonstrate skills relevant to your target role</li>
          <li>• Always include live demos or GitHub links when possible</li>
          <li>• Mention specific technologies and frameworks you used</li>
          <li>• Quantify impact: user numbers, performance improvements, etc.</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ProjectForm;
