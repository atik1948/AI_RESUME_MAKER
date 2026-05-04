import React, { useState, useMemo } from 'react';

const MAX_SMART_SKILL_SUGGESTIONS = 6;

const SkillInput = ({ skills, handleChange, handleAiSuggest, loading, targetJobTitle, formData }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProficiency, setSelectedProficiency] = useState('Intermediate');

  // Convert skills string to array of objects, or use empty array if skills is falsy
  const skillsArray = React.useMemo(() => {
    if (!skills) return [];
    if (typeof skills === 'string') {
      return skills.split(',')
        .map(skill => skill && skill.trim())
        .filter(skill => skill && skill.length > 0)
        .map(skill => ({
          name: skill,
          proficiency: 'Intermediate'
        }));
    }
    if (Array.isArray(skills)) {
      return skills
        .filter(skill => skill && skill.name)
        .map(skill => ({
          name: skill.name || '',
          proficiency: skill.proficiency || 'Intermediate'
        }));
    }
    return [];
  }, [skills]);

  // Generate skill suggestions based on user's input data
  const suggestedSkills = useMemo(() => {
    const suggestions = new Set();
    
    // Extract skills from education
    if (formData?.education) {
      formData.education.forEach(edu => {
        if (edu && edu.degree) {
          const degree = edu.degree.toLowerCase();
          if (degree.includes('computer') || degree.includes('software') || degree.includes('engineering')) {
            suggestions.add('Programming');
            suggestions.add('Problem Solving');
            suggestions.add('Software Development');
            suggestions.add('JavaScript');
            suggestions.add('Python');
            suggestions.add('Git');
            suggestions.add('Debugging');
          }
          if (degree.includes('business') || degree.includes('management')) {
            suggestions.add('Project Management');
            suggestions.add('Leadership');
            suggestions.add('Strategic Planning');
            suggestions.add('Team Management');
            suggestions.add('Budget Management');
            suggestions.add('Communication');
          }
          if (degree.includes('design') || degree.includes('art')) {
            suggestions.add('Creative Design');
            suggestions.add('Adobe Creative Suite');
            suggestions.add('UI/UX Design');
            suggestions.add('Photoshop');
            suggestions.add('Illustrator');
            suggestions.add('Visual Design');
          }
          if (degree.includes('marketing')) {
            suggestions.add('Digital Marketing');
            suggestions.add('Social Media');
            suggestions.add('Content Creation');
            suggestions.add('SEO');
            suggestions.add('Google Analytics');
            suggestions.add('Brand Management');
          }
          if (degree.includes('data') || degree.includes('analytics')) {
            suggestions.add('Data Analysis');
            suggestions.add('SQL');
            suggestions.add('Excel');
            suggestions.add('Python');
            suggestions.add('Tableau');
            suggestions.add('Statistics');
          }
        }
      });
    }

    // Extract skills from experience
    if (formData?.experiences) {
      formData.experiences.forEach(exp => {
        if (exp && exp.jobTitle) {
          const jobTitle = exp.jobTitle.toLowerCase();
          if (jobTitle.includes('developer') || jobTitle.includes('engineer')) {
            suggestions.add('Programming');
            suggestions.add('Debugging');
            suggestions.add('Code Review');
            suggestions.add('Agile');
            suggestions.add('Testing');
            suggestions.add('Version Control');
          }
          if (jobTitle.includes('manager') || jobTitle.includes('lead')) {
            suggestions.add('Leadership');
            suggestions.add('Team Management');
            suggestions.add('Project Management');
            suggestions.add('Communication');
            suggestions.add('Decision Making');
            suggestions.add('Mentoring');
          }
          if (jobTitle.includes('analyst')) {
            suggestions.add('Data Analysis');
            suggestions.add('Research');
            suggestions.add('Critical Thinking');
            suggestions.add('Excel');
            suggestions.add('Reporting');
            suggestions.add('Problem Solving');
          }
          if (jobTitle.includes('designer')) {
            suggestions.add('Creative Design');
            suggestions.add('Visual Design');
            suggestions.add('User Experience');
            suggestions.add('Prototyping');
            suggestions.add('Design Thinking');
            suggestions.add('Adobe Creative Suite');
          }
        }

        // Extract from responsibilities
        if (exp.description || exp.responsibilities) {
          const responsibilities = (exp.description || exp.responsibilities || '').toLowerCase();
          if (responsibilities.includes('javascript') || responsibilities.includes('js')) suggestions.add('JavaScript');
          if (responsibilities.includes('python')) suggestions.add('Python');
          if (responsibilities.includes('react')) suggestions.add('React');
          if (responsibilities.includes('node')) suggestions.add('Node.js');
          if (responsibilities.includes('sql')) suggestions.add('SQL');
          if (responsibilities.includes('aws')) suggestions.add('AWS');
          if (responsibilities.includes('docker')) suggestions.add('Docker');
          if (responsibilities.includes('git')) suggestions.add('Git');
          if (responsibilities.includes('agile') || responsibilities.includes('scrum')) suggestions.add('Agile/Scrum');
          if (responsibilities.includes('team') || responsibilities.includes('collaborate')) suggestions.add('Team Collaboration');
          if (responsibilities.includes('lead') || responsibilities.includes('manage')) suggestions.add('Leadership');
          if (responsibilities.includes('api')) suggestions.add('API Development');
          if (responsibilities.includes('database')) suggestions.add('Database Management');
        }
      });
    }

    // Extract skills from projects
    if (formData?.projects) {
      formData.projects.forEach(proj => {
        if (proj && (proj.description || proj.projectDescription)) {
          const description = (proj.description || proj.projectDescription || '').toLowerCase();
          if (description.includes('react')) suggestions.add('React');
          if (description.includes('javascript')) suggestions.add('JavaScript');
          if (description.includes('python')) suggestions.add('Python');
          if (description.includes('machine learning') || description.includes('ml')) suggestions.add('Machine Learning');
          if (description.includes('api')) suggestions.add('API Development');
          if (description.includes('database')) suggestions.add('Database Management');
          if (description.includes('mobile')) suggestions.add('Mobile Development');
          if (description.includes('web')) suggestions.add('Web Development');
          if (description.includes('frontend')) suggestions.add('Frontend Development');
          if (description.includes('backend')) suggestions.add('Backend Development');
        }
      });
    }

    // Add skills based on target job title
    if (targetJobTitle && typeof targetJobTitle === 'string') {
      const jobTitle = targetJobTitle.toLowerCase();
      if (jobTitle.includes('software') || jobTitle.includes('developer')) {
        suggestions.add('Programming');
        suggestions.add('Software Development');
        suggestions.add('Debugging');
        suggestions.add('Version Control');
        suggestions.add('Testing');
      }
      if (jobTitle.includes('data')) {
        suggestions.add('Data Analysis');
        suggestions.add('SQL');
        suggestions.add('Python');
        suggestions.add('Statistics');
        suggestions.add('Excel');
      }
      if (jobTitle.includes('marketing')) {
        suggestions.add('Digital Marketing');
        suggestions.add('Content Marketing');
        suggestions.add('Social Media');
        suggestions.add('Analytics');
        suggestions.add('SEO');
      }
      if (jobTitle.includes('manager')) {
        suggestions.add('Leadership');
        suggestions.add('Project Management');
        suggestions.add('Team Building');
        suggestions.add('Strategic Planning');
        suggestions.add('Communication');
      }
    }

    // Filter out already added skills
    return Array.from(suggestions)
      .filter(skill => 
        !skillsArray.some(existingSkill => 
          existingSkill && existingSkill.name && 
          existingSkill.name.toLowerCase() === skill.toLowerCase()
        )
      )
      .slice(0, MAX_SMART_SKILL_SUGGESTIONS);
  }, [formData, targetJobTitle, skillsArray]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const newSkill = { name: inputValue.trim(), proficiency: selectedProficiency };
      const newSkillsArray = [...skillsArray, newSkill];
      // Convert back to string format for consistency with the rest of the app
      const skillsString = newSkillsArray
        .filter(skill => skill && skill.name)
        .map(skill => skill.name).join(', ');
      handleChange(skillsString);
      setInputValue('');
    }
  };

  const handleRemoveSkill = (index) => {
    const newSkillsArray = [...skillsArray];
    newSkillsArray.splice(index, 1);
    // Convert back to string format
    const skillsString = newSkillsArray
      .filter(skill => skill && skill.name)
      .map(skill => skill.name).join(', ');
    handleChange(skillsString);
  };

  const addSuggestedSkill = (skillName) => {
    if (!skillName) return;
    const newSkill = { name: skillName, proficiency: 'Intermediate' };
    const newSkillsArray = [...skillsArray, newSkill];
    const skillsString = newSkillsArray
      .filter(skill => skill && skill.name)
      .map(skill => skill.name).join(', ');
    handleChange(skillsString);
  };

  return (
    <div className="border dark:border-neutral-700 p-4 rounded-lg mb-4 bg-gray-50 dark:bg-neutral-800">
      <h3 className="text-lg font-semibold mb-3 dark:text-gray-200">Your Skills</h3>
      
      {/* Current Skills Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skillsArray.filter(skill => skill && skill.name).map((skill, index) => (
          <div key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-3 py-1 rounded-full flex items-center">
            <span className="font-medium">{skill.name}</span>
            <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
              {skill.proficiency || 'Intermediate'}
            </span>
            <button
              onClick={() => handleRemoveSkill(index)}
              className="ml-2 text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100 font-bold"
            >
              &times;
            </button>
          </div>
        ))}
        {skillsArray.length === 0 && (
          <span className="text-gray-400 dark:text-gray-500 text-sm">No skills added yet</span>
        )}
      </div>

      {/* Add New Skill Input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a skill and press Enter"
          className="flex-1 p-2 border dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
        />
        <select
          value={selectedProficiency}
          onChange={(e) => setSelectedProficiency(e.target.value)}
          className="px-3 py-2 border dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAiSuggest}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
          disabled={loading || !targetJobTitle}
        >
          {loading ? 'Suggesting...' : '✨ AI Suggest Skills'}
        </button>
        
        {suggestedSkills.length > 0 && (
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
          >
            {showSuggestions ? 'Hide' : 'Show'} Smart Suggestions ({suggestedSkills.length})
          </button>
        )}
      </div>

      {/* Smart Suggestions Section */}
      {showSuggestions && suggestedSkills.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg p-4 mb-4">
          <h4 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">
            💡 Suggested Skills Based on Your Profile
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => addSuggestedSkill(skill)}
                className="bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            These suggestions are based on your education, experience, and projects.
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        {targetJobTitle && (
          <p>🎯 AI will suggest skills based on your target job: <span className="font-medium">{targetJobTitle}</span></p>
        )}
        <p>💡 Tip: Add skills that match your experience and the job you're targeting.</p>
      </div>
    </div>
  );
};

export default SkillInput;
