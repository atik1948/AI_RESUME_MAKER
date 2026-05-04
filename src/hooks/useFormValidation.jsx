import { useMemo } from 'react';

export const useFormValidation = (formData) => {
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

  const validateStep = (step) => {
    switch (step) {
      case 0: // Onboarding validation
        if (!formData.fullName || !formData.targetJobTitle || !formData.profileType || !formData.targetIndustry) {
          return { isValid: false, message: "Please fill in all required onboarding fields: Full Name, Target Job Title, Profile Type, and Target Industry." };
        }
        break;
      
      case 1: // Contact Information validation
        if (!formData.email || !formData.phone || !formData.location) {
          return { isValid: false, message: "Please fill in all required contact information fields: Email, Phone, and Location." };
        }
        break;
      
      case 2: // Profile-specific questions validation
        const profileQuestions = getProfileSpecificQuestions();
        const requiredQuestions = profileQuestions.filter(q => q.required);
        for (const question of requiredQuestions) {
          if (!formData[question.key] || formData[question.key].trim() === '') {
            return { isValid: false, message: `Please fill in the required field: ${question.label}` };
          }
        }
        break;
      
      case 4: // Education validation
        if (!formData.education || formData.education.length === 0) {
          return { isValid: false, message: "Please add at least one education entry." };
        }
        for (const edu of formData.education) {
          if (!edu.school || !edu.degree) {
            return { isValid: false, message: "Please fill in all required fields for each education entry." };
          }
        }
        break;
      
      case 5: // Experience validation
        if (!formData.experiences || formData.experiences.length === 0) {
          return { isValid: false, message: "Please add at least one experience entry." };
        }
for (const exp of formData.experiences) {
  if (!exp.company || !exp.jobTitle || !exp.description) {
    return { isValid: false, message: "Please fill in all required fields for each experience entry." };
  }
}
        break;
      
      case 6: // Skills validation
        if (!formData.skills || formData.skills.length === 0) {
          return { isValid: false, message: "Please add at least one skill." };
        }
        break;
      
      case 7: // Projects validation
        if (!formData.projects || formData.projects.length === 0) {
          return { isValid: false, message: "Please add at least one project." };
        }
        for (const proj of formData.projects) {
          if (!proj.name && !proj.projectName) {
            return { isValid: false, message: "Please fill in all required fields for each project entry." };
          }
        }
        break;
      
      default:
        break;
    }
    
    return { isValid: true, message: "" };
  };

  const getProfileContextForSummary = () => {
    const profileType = formData.profileType;
    let context = '';

    switch (profileType) {
      case 'student':
        context = `Key details: ${formData.graduationDate ? `Graduating ${formData.graduationDate}` : ''}${formData.gpa ? `, GPA: ${formData.gpa}` : ''}${formData.relevantCoursework ? `, Relevant coursework: ${formData.relevantCoursework}` : ''}${formData.internships ? `, Internship experience: ${formData.internships}` : ''}${formData.academicProjects ? `, Academic projects: ${formData.academicProjects}` : ''}${formData.extracurriculars ? `, Leadership activities: ${formData.extracurriculars}` : ''}${formData.awards ? `, Awards: ${formData.awards}` : ''}. Focus on potential, academic achievements, and eagerness to learn.`;
        break;
      case 'experienced':
        context = `Key details: ${formData.yearsExperience ? `${formData.yearsExperience} years of experience` : ''}${formData.industryExperience ? ` in ${formData.industryExperience}` : ''}${formData.specializations ? `, specializing in ${formData.specializations}` : ''}${formData.keyAchievements ? `, Key achievements: ${formData.keyAchievements}` : ''}${formData.managementExperience ? `, Management experience: ${formData.managementExperience}` : ''}${formData.certifications ? `, Certifications: ${formData.certifications}` : ''}. Focus on proven track record, leadership, and measurable results.`;
        break;
      case 'career_changer':
        context = `Key details: Transitioning from ${formData.previousIndustry || 'previous field'}${formData.reasonForChange ? `, motivated by: ${formData.reasonForChange}` : ''}${formData.transferableSkills ? `, Transferable skills: ${formData.transferableSkills}` : ''}${formData.newFieldPreparation ? `, Preparation: ${formData.newFieldPreparation}` : ''}${formData.relevantExperience ? `, Relevant experience: ${formData.relevantExperience}` : ''}${formData.careerGoals ? `, Goals: ${formData.careerGoals}` : ''}. Focus on transferable skills, motivation for change, and commitment to new field.`;
        break;
      case 'academic':
        context = `Key details: ${formData.currentPosition ? `Current position: ${formData.currentPosition}` : ''}${formData.researchArea ? `, Research area: ${formData.researchArea}` : ''}${formData.publications ? `, Publications: ${formData.publications}` : ''}${formData.grants ? `, Grants: ${formData.grants}` : ''}${formData.conferences ? `, Conference presentations: ${formData.conferences}` : ''}${formData.teachingExperience ? `, Teaching: ${formData.teachingExperience}` : ''}${formData.technicalSkills ? `, Technical skills: ${formData.technicalSkills}` : ''}. Focus on research impact, scholarly contributions, and academic excellence.`;
        break;
      case 'creative':
        context = `Key details: ${formData.creativeField ? `Creative field: ${formData.creativeField}` : ''}${formData.portfolioUrl ? `, Portfolio: ${formData.portfolioUrl}` : ''}${formData.clientTypes ? `, Client types: ${formData.clientTypes}` : ''}${formData.creativeSkills ? `, Creative skills: ${formData.creativeSkills}` : ''}${formData.notableProjects ? `, Notable projects: ${formData.notableProjects}` : ''}${formData.businessSkills ? `, Business skills: ${formData.businessSkills}` : ''}. Focus on creative vision, portfolio quality, and client results.`;
        break;
      default:
        context = 'Focus on relevant skills and experience for the target role.';
    }

    return context;
  };

  return {
    validateStep,
    getProfileSpecificQuestions,
    getProfileContextForSummary
  };
};
