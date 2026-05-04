import { handleAiRewrite } from '../utils/aiHelpers';
import {
  normalizeExperience,
  normalizeProject,
  normalizeResumeData,
  normalizeSkills,
} from '../utils/resumeData';

const MAX_AI_SKILL_SUGGESTIONS = 6;

export const useFormHandlers = (formData, setFormData, saveFormData, setLoading) => {
  // Experience handlers
  const handleAddExperience = () => {
    const newExperiences = formData.experiences ? [...formData.experiences, {}] : [{}];
    const updatedData = normalizeResumeData({ ...formData, experiences: newExperiences });
    setFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleRemoveExperience = (index) => {
    const newExperiences = [...formData.experiences];
    newExperiences.splice(index, 1);
    const updatedData = normalizeResumeData({ ...formData, experiences: newExperiences });
    setFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleAiRewriteExperience = async (index, field, prompt) => {
    setLoading(true);
    const rewrittenText = await handleAiRewrite(
      formData.experiences[index][field],
      prompt,
      formData,
      setFormData,
      saveFormData,
      setLoading,
      `experiences[${index}].${field}`
    );
    if (rewrittenText) {
      const newExperiences = [...formData.experiences];
      newExperiences[index][field] = rewrittenText;
      const updatedData = normalizeResumeData({ ...formData, experiences: newExperiences.map(normalizeExperience) });
      setFormData(updatedData);
      saveFormData(updatedData);
    }
    setLoading(false);
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEducation = formData.education ? [...formData.education, {}] : [{}];
    const updatedData = normalizeResumeData({ ...formData, education: newEducation });
    setFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleRemoveEducation = (index) => {
    const newEducation = [...formData.education];
    newEducation.splice(index, 1);
    const updatedData = normalizeResumeData({ ...formData, education: newEducation });
    setFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleAiRewriteEducation = async (index) => {
    setLoading(true);
    const rewrittenText = await handleAiRewrite(
      formData.education[index].coursework,
      'Rewrite the following coursework description to be more professional and concise.',
      formData,
      setFormData,
      saveFormData,
      setLoading,
      `education[${index}].coursework`
    );
    if (rewrittenText) {
      const newEducation = [...formData.education];
      newEducation[index].coursework = rewrittenText;
      const updatedData = normalizeResumeData({ ...formData, education: newEducation });
      setFormData(updatedData);
      saveFormData(updatedData);
    }
    setLoading(false);
  };

  // Project handlers
  const handleAddProject = () => {
    const newProjects = formData.projects ? [...formData.projects, {}] : [{}];
    const updatedData = normalizeResumeData({ ...formData, projects: newProjects });
    setFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleRemoveProject = (index) => {
    const newProjects = [...formData.projects];
    newProjects.splice(index, 1);
    const updatedData = normalizeResumeData({ ...formData, projects: newProjects });
    setFormData(updatedData);
    saveFormData(updatedData);
  };

  const handleAiRewriteProject = async (index) => {
    setLoading(true);
    const rewrittenText = await handleAiRewrite(
      formData.projects[index].description,
      'Rewrite the following project description to be more professional and concise.',
      formData,
      setFormData,
      saveFormData,
      setLoading,
      `projects[${index}].description`
    );
    if (rewrittenText) {
      const newProjects = [...formData.projects];
      newProjects[index].description = rewrittenText;
      const updatedData = normalizeResumeData({ ...formData, projects: newProjects.map(normalizeProject) });
      setFormData(updatedData);
      saveFormData(updatedData);
    }
    setLoading(false);
  };

  // Skills handlers
  const handleAiSuggestSkills = async () => {
    setLoading(true);
    try {
      const prompt = `Suggest the top ${MAX_AI_SKILL_SUGGESTIONS} most relevant skills for a ${formData.profileType} targeting a ${formData.targetJobTitle} role. Provide only a comma-separated list of skills, no other text.`;
      let suggestedSkillsText = await handleAiRewrite(
        '', 
        prompt, 
        formData, 
        () => {}, 
        null, 
        setLoading, 
        'skills'
      );

      if (suggestedSkillsText) {
        const suggestedSkillsArray = normalizeSkills(suggestedSkillsText).slice(0, MAX_AI_SKILL_SUGGESTIONS);
        const currentSkills = normalizeSkills(formData.skills);
        const combinedSkills = [...currentSkills, ...suggestedSkillsArray.filter(s => s.name !== '')];
        // Remove duplicates based on skill name
        const uniqueSkills = Array.from(new Set(combinedSkills.map(s => s.name.toLowerCase())))
          .map(name => combinedSkills.find(s => s.name.toLowerCase() === name));

        const updatedData = normalizeResumeData({ ...formData, skills: uniqueSkills });
        setFormData(updatedData);
        saveFormData(updatedData);
      }
    } catch (error) {
      console.error("Error suggesting skills:", error);
      alert("Failed to suggest skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAddExperience,
    handleRemoveExperience,
    handleAiRewriteExperience,
    handleAddEducation,
    handleRemoveEducation,
    handleAiRewriteEducation,
    handleAddProject,
    handleRemoveProject,
    handleAiRewriteProject,
    handleAiSuggestSkills
  };
};
