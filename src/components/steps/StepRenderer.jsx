import React, { Suspense, lazy } from 'react';
import OnboardingStep from './OnboardingStep';
import ProfileQuestionsStep from './ProfileQuestionsStep';
import ContactStep from './ContactStep';
import SummaryStep from './SummaryStep';
import EducationForm from '../EducationForm';
import ExperienceForm from '../ExperienceForm';
import SkillInput from '../SkillInput';
import ProjectForm from '../ProjectForm';

const TemplateManager = lazy(() => import('../TemplateManager'));
const CustomizationControls = lazy(() => import('../CustomizationControls'));
const SectionReorder = lazy(() => import('../SectionReorder'));
const FinalReviewStep = lazy(() => import('./FinalReviewStep'));

const StepLoadingState = ({ message = 'Loading step...' }) => (
  <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300">
    {message}
  </div>
);

const StepRenderer = ({
  step,
  formData,
  setFormData,
  handleChange,
  loading,
  setLoading,
  saveFormData,
  profileQuestions,
  getProfileContextForSummary,
  // Experience handlers
  handleAddExperience,
  handleRemoveExperience,
  handleAiRewriteExperience,
  // Education handlers
  handleAddEducation,
  handleRemoveEducation,
  handleAiRewriteEducation,
  // Skills handlers
  handleAiSuggestSkills,
  // Project handlers
  handleAddProject,
  handleRemoveProject,
  handleAiRewriteProject,
  // Template and customization
  isPremium,
  setPremium,
  selectedTemplate,
  setSelectedTemplate,
  accentColor,
  setAccentColor,
  fontStyle,
  setFontStyle,
  fontSize,
  setFontSize,
  sectionOrder,
  setSectionOrder,
  // Export functions
  generateDocx,
  generatePlainText,
  exporting,
  // Navigation
  onNewResume
}) => {
  switch (step) {
    case 0:
      return (
        <OnboardingStep
          formData={formData}
          handleChange={handleChange}
          loading={loading}
          setLoading={setLoading}
          saveFormData={saveFormData}
        />
      );
    
    case 1:
      return (
        <ContactStep
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          saveFormData={saveFormData}
        />
      );
    
    case 2:
      return (
        <ProfileQuestionsStep
          formData={formData}
          handleChange={handleChange}
          profileQuestions={profileQuestions}
        />
      );
    
    case 3:
      return (
        <SummaryStep
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          loading={loading}
          setLoading={setLoading}
          saveFormData={saveFormData}
          getProfileContextForSummary={getProfileContextForSummary}
        />
      );
    
    case 4:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          {(formData.education || []).map((edu, index) => (
            <EducationForm
              key={index}
              index={index}
              education={edu}
              handleChange={(e) => handleChange(e, index, 'education')}
              handleRemove={handleRemoveEducation}
              handleAiRewrite={handleAiRewriteEducation}
              loading={loading}
              formData={formData}
            />
          ))}
          <button
            onClick={handleAddEducation}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Add Another Education
          </button>
        </div>
      );
    
    case 5:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
          {(formData.experiences || []).map((experience, index) => (
            <ExperienceForm
              key={index}
              index={index}
              experience={experience}
              handleChange={handleChange}
              handleRemove={handleRemoveExperience}
              handleAiRewrite={handleAiRewriteExperience}
              loading={loading}
              formData={formData}
            />
          ))}
          <button
            onClick={handleAddExperience}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Add Another Experience
          </button>
        </div>
      );
    
    case 6:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <SkillInput
            skills={formData.skills || []}
            handleChange={(newSkills) => {
              const syntheticEvent = {
                target: {
                  name: 'skills',
                  value: newSkills
                }
              };
              handleChange(syntheticEvent, undefined, 'skills');
            }}
            handleAiSuggest={handleAiSuggestSkills}
            loading={loading}
            targetJobTitle={formData.targetJobTitle}
            formData={formData}
          />
        </div>
      );
    
    case 7:
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          {(formData.projects || []).map((project, index) => (
            <ProjectForm
              key={index}
              index={index}
              project={project}
              handleChange={(e) => handleChange(e, index, 'projects')}
              handleRemove={handleRemoveProject}
              handleAiRewrite={handleAiRewriteProject}
              loading={loading}
              formData={formData}
            />
          ))}
          <button
            onClick={handleAddProject}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Add Another Project
          </button>
        </div>
      );
    
    case 8:
      return (
        <Suspense fallback={<StepLoadingState message="Loading templates..." />}>
          <TemplateManager
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
            formData={formData}
            isPremium={isPremium}
            setPremium={setPremium}
          />
        </Suspense>
      );
    
    case 9:
      return (
        <Suspense fallback={<StepLoadingState message="Loading customization tools..." />}>
          <CustomizationControls
            selectedTemplate={selectedTemplate}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            fontStyle={fontStyle}
            setFontStyle={setFontStyle}
            fontSize={fontSize}
            setFontSize={setFontSize}
            formData={formData}
          />
        </Suspense>
      );
    
    case 10:
      return (
        <Suspense fallback={<StepLoadingState message="Loading section layout..." />}>
          <SectionReorder
            sectionOrder={sectionOrder}
            setSectionOrder={setSectionOrder}
            formData={formData}
          />
        </Suspense>
      );
    
    case 11:
      return (
        <Suspense fallback={<StepLoadingState message="Preparing your live resume preview..." />}>
          <FinalReviewStep
            formData={formData}
            selectedTemplate={selectedTemplate}
            accentColor={accentColor}
            fontStyle={fontStyle}
            fontSize={fontSize}
            sectionOrder={sectionOrder}
            loading={loading}
            setLoading={setLoading}
            saveFormData={saveFormData}
            generateDocx={generateDocx}
            generatePlainText={generatePlainText}
            exporting={exporting}
            onNewResume={onNewResume}
          />
        </Suspense>
      );
    
    default:
      return <div>Step not found</div>;
  }
};

export default StepRenderer;
