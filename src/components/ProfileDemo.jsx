import React, { useState } from 'react';

const ProfileDemo = () => {
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getProfileSpecificQuestions = () => {
    const profileType = formData.profileType;
    
    const profileQuestions = {
      student: [
        { key: 'graduationDate', label: 'Expected/Actual Graduation Date', type: 'text', placeholder: 'e.g., May 2024', required: true },
        { key: 'gpa', label: 'GPA (if 3.5 or higher)', type: 'text', placeholder: 'e.g., 3.8/4.0', required: false },
        { key: 'relevantCoursework', label: 'Relevant Coursework', type: 'textarea', placeholder: 'List key courses related to your target job', required: false },
        { key: 'internships', label: 'Internships/Co-ops', type: 'textarea', placeholder: 'Describe any internships or co-op experiences', required: false },
        { key: 'academicProjects', label: 'Academic Projects', type: 'textarea', placeholder: 'Describe significant academic projects', required: false },
        { key: 'extracurriculars', label: 'Leadership & Extracurricular Activities', type: 'textarea', placeholder: 'Student organizations, leadership roles, volunteer work', required: false },
        { key: 'awards', label: 'Academic Awards & Honors', type: 'textarea', placeholder: 'Dean\'s list, scholarships, academic competitions', required: false }
      ],
      experienced: [
        { key: 'yearsExperience', label: 'Years of Professional Experience', type: 'number', placeholder: 'e.g., 5', required: true },
        { key: 'industryExperience', label: 'Industries You\'ve Worked In', type: 'text', placeholder: 'e.g., Technology, Healthcare, Finance', required: true },
        { key: 'managementExperience', label: 'Management/Leadership Experience', type: 'textarea', placeholder: 'Describe team size, scope of responsibility', required: false },
        { key: 'keyAchievements', label: 'Key Career Achievements', type: 'textarea', placeholder: 'Quantifiable accomplishments, promotions, major projects', required: true },
        { key: 'certifications', label: 'Professional Certifications', type: 'textarea', placeholder: 'Industry certifications, licenses, professional development', required: false },
        { key: 'specializations', label: 'Areas of Specialization', type: 'text', placeholder: 'Your key areas of expertise', required: true },
        { key: 'careerProgression', label: 'Career Progression', type: 'textarea', placeholder: 'How your roles have evolved and grown', required: false }
      ],
      career_changer: [
        { key: 'previousIndustry', label: 'Previous Industry/Field', type: 'text', placeholder: 'e.g., Education, Sales, Military', required: true },
        { key: 'reasonForChange', label: 'Reason for Career Change', type: 'textarea', placeholder: 'What motivates your career transition', required: true },
        { key: 'transferableSkills', label: 'Transferable Skills', type: 'textarea', placeholder: 'Skills from previous career applicable to new field', required: true },
        { key: 'newFieldPreparation', label: 'Preparation for New Field', type: 'textarea', placeholder: 'Courses, bootcamps, self-study, projects', required: true },
        { key: 'relevantExperience', label: 'Relevant Experience in New Field', type: 'textarea', placeholder: 'Volunteer work, side projects, freelance work', required: false },
        { key: 'networkingEfforts', label: 'Networking & Industry Involvement', type: 'textarea', placeholder: 'Professional groups, meetups, mentorship', required: false },
        { key: 'careerGoals', label: 'Short-term Career Goals', type: 'textarea', placeholder: 'What you hope to achieve in your new career', required: true }
      ],
      academic: [
        { key: 'currentPosition', label: 'Current Academic Position', type: 'text', placeholder: 'e.g., PhD Candidate, Postdoc, Assistant Professor', required: true },
        { key: 'researchArea', label: 'Research Area/Specialization', type: 'text', placeholder: 'Your primary research focus', required: true },
        { key: 'publications', label: 'Publications', type: 'textarea', placeholder: 'Key publications, papers, books (include impact factor if relevant)', required: false },
        { key: 'grants', label: 'Grants & Funding', type: 'textarea', placeholder: 'Research grants received, amounts, funding agencies', required: false },
        { key: 'conferences', label: 'Conference Presentations', type: 'textarea', placeholder: 'Major conferences where you\'ve presented', required: false },
        { key: 'teachingExperience', label: 'Teaching Experience', type: 'textarea', placeholder: 'Courses taught, student mentoring, curriculum development', required: false },
        { key: 'collaborations', label: 'Research Collaborations', type: 'textarea', placeholder: 'International collaborations, interdisciplinary work', required: false },
        { key: 'technicalSkills', label: 'Research Methods & Technical Skills', type: 'textarea', placeholder: 'Lab techniques, software, statistical methods', required: true }
      ],
      creative: [
        { key: 'creativeField', label: 'Creative Field/Discipline', type: 'text', placeholder: 'e.g., Graphic Design, Photography, Writing', required: true },
        { key: 'portfolioUrl', label: 'Portfolio Website/URL', type: 'url', placeholder: 'Link to your online portfolio', required: true },
        { key: 'clientTypes', label: 'Types of Clients/Projects', type: 'textarea', placeholder: 'Corporate, non-profit, individual clients, etc.', required: true },
        { key: 'creativeSkills', label: 'Creative & Technical Skills', type: 'textarea', placeholder: 'Software proficiency, artistic techniques, tools', required: true },
        { key: 'notableProjects', label: 'Notable Projects/Campaigns', type: 'textarea', placeholder: 'High-impact projects, awards, recognition', required: true },
        { key: 'creativeProcess', label: 'Creative Process & Approach', type: 'textarea', placeholder: 'Your methodology, collaboration style', required: false },
        { key: 'industryInvolvement', label: 'Industry Involvement', type: 'textarea', placeholder: 'Professional organizations, exhibitions, competitions', required: false },
        { key: 'businessSkills', label: 'Business/Client Management Skills', type: 'textarea', placeholder: 'Project management, client relations, budgeting', required: false }
      ]
    };

    return profileQuestions[profileType] || [];
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Profile Selection Demo</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Select a profile type to see the dynamic questions that would be asked.</p>
            
            <input 
              type="text" 
              name="fullName" 
              placeholder="Your Full Name" 
              onChange={handleChange} 
              value={formData.fullName || ''} 
              className="w-full p-2 border dark:border-neutral-700 rounded mb-4 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" 
            />
            
            <input 
              type="text" 
              name="targetJobTitle" 
              placeholder="Target Job Title (e.g., Software Engineer, Marketing Manager)" 
              onChange={handleChange} 
              value={formData.targetJobTitle || ''} 
              className="w-full p-2 border dark:border-neutral-700 rounded mb-4 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" 
            />
            
            <select
              name="profileType"
              onChange={handleChange}
              value={formData.profileType || ''}
              className="w-full p-2 border dark:border-neutral-700 rounded mb-4 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select Profile Type</option>
              <option value="student">Student/Recent Graduate</option>
              <option value="experienced">Experienced Professional</option>
              <option value="career_changer">Career Changer</option>
              <option value="academic">Academic/Researcher</option>
              <option value="creative">Creative/Portfolio-based</option>
            </select>
            
            {formData.profileType && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {formData.profileType === 'student' && '🎓 Student/Recent Graduate Profile'}
                  {formData.profileType === 'experienced' && '💼 Experienced Professional Profile'}
                  {formData.profileType === 'career_changer' && '🔄 Career Changer Profile'}
                  {formData.profileType === 'academic' && '🔬 Academic/Researcher Profile'}
                  {formData.profileType === 'creative' && '🎨 Creative/Portfolio-based Profile'}
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  {formData.profileType === 'student' && 'Perfect! We\'ll focus on your education, projects, internships, and potential.'}
                  {formData.profileType === 'experienced' && 'Great! We\'ll highlight your professional achievements, leadership, and expertise.'}
                  {formData.profileType === 'career_changer' && 'Excellent! We\'ll emphasize your transferable skills and new field preparation.'}
                  {formData.profileType === 'academic' && 'Wonderful! We\'ll showcase your research, publications, and academic contributions.'}
                  {formData.profileType === 'creative' && 'Amazing! We\'ll feature your portfolio, creative projects, and artistic skills.'}
                </p>
              </div>
            )}
          </div>
        );
      case 1:
        const profileQuestions = getProfileSpecificQuestions();
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {formData.profileType === 'student' && '🎓 Student Profile Details'}
              {formData.profileType === 'experienced' && '💼 Professional Background'}
              {formData.profileType === 'career_changer' && '🔄 Career Transition Details'}
              {formData.profileType === 'academic' && '🔬 Academic & Research Background'}
              {formData.profileType === 'creative' && '🎨 Creative Professional Details'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              These are the tailored questions that would be asked based on your selected profile type.
            </p>
            
            {profileQuestions.map((question, index) => (
              <div key={question.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {question.type === 'textarea' ? (
                  <textarea
                    name={question.key}
                    placeholder={question.placeholder}
                    value={formData[question.key] || ''}
                    onChange={handleChange}
                    className="w-full p-3 border dark:border-neutral-700 rounded-lg resize-vertical bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                    rows="4"
                    required={question.required}
                  />
                ) : (
                  <input
                    type={question.type}
                    name={question.key}
                    placeholder={question.placeholder}
                    value={formData[question.key] || ''}
                    onChange={handleChange}
                    className="w-full p-3 border dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                    required={question.required}
                  />
                )}
              </div>
            ))}
            
            {profileQuestions.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tips</h3>
                <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                  {formData.profileType === 'student' && (
                    <>
                      <li>• Highlight relevant coursework that matches your target job</li>
                      <li>• Include leadership roles and volunteer experiences</li>
                      <li>• Quantify achievements where possible (GPA, project outcomes)</li>
                    </>
                  )}
                  {formData.profileType === 'experienced' && (
                    <>
                      <li>• Use specific numbers and metrics to quantify achievements</li>
                      <li>• Focus on leadership and strategic contributions</li>
                      <li>• Highlight industry-specific expertise and certifications</li>
                    </>
                  )}
                  {formData.profileType === 'career_changer' && (
                    <>
                      <li>• Emphasize transferable skills from your previous career</li>
                      <li>• Show proactive steps taken to enter the new field</li>
                      <li>• Connect past experiences to future goals</li>
                    </>
                  )}
                  {formData.profileType === 'academic' && (
                    <>
                      <li>• Include impact factors and citation counts where relevant</li>
                      <li>• Highlight interdisciplinary collaborations</li>
                      <li>• Quantify grant amounts and research outcomes</li>
                    </>
                  )}
                  {formData.profileType === 'creative' && (
                    <>
                      <li>• Ensure your portfolio URL is current and professional</li>
                      <li>• Highlight measurable project outcomes and client satisfaction</li>
                      <li>• Balance creative skills with business acumen</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      default:
        return <div>Demo complete!</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Profile-Specific Questions Demo</h1>
          <span className="text-sm text-gray-600 dark:text-gray-400">Step {step + 1} of 2</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{width: `${((step + 1) / 2) * 100}%`}}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        {step > 0 && (
          <button 
            onClick={() => setStep(step - 1)} 
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
        )}
        
        {step < 1 && formData.profileType && (
          <button 
            onClick={() => setStep(step + 1)} 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors ml-auto"
          >
            See Profile Questions
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileDemo;