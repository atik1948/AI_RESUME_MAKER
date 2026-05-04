import React, { useState } from 'react';
import { useStepNavigation } from '../hooks/useStepNavigation';
import { useFormValidation } from '../hooks/useFormValidation';
import { useExportFunctions } from '../hooks/useExportFunctions';
import { useFormHandlers } from '../hooks/useFormHandlers';
import StepRenderer from './steps/StepRenderer';

const DEFAULT_TEMPLATE = 'one_page_sidebar';
const DEFAULT_ACCENT_COLOR = '#3B82F6';
const DEFAULT_FONT_STYLE = 'Helvetica';
const DEFAULT_FONT_SIZE = '12';
const DEFAULT_SECTION_ORDER = [
  { id: 'contact', name: 'Contact Information' },
  { id: 'summary', name: 'Professional Summary' },
  { id: 'education', name: 'Education' },
  { id: 'experiences', name: 'Work Experience' },
  { id: 'skills', name: 'Skills' },
  { id: 'projects', name: 'Projects' },
  { id: 'references', name: 'References' },
];

const MultiStepForm = ({ formState, isPremium, setPremium }) => {
  // Form state management
  const {
    formData,
    setFormData,
    loading,
    setLoading,
    user,
    dataLoaded,
    handleChange,
    saveFormData,
    createNewCv,
    updateFormData,
  } = formState;

  // Step navigation
  const {
    step,
    setStep,
    nextStep,
    prevStep,
    progress,
    totalSteps
  } = useStepNavigation(11);

  // Form validation
  const {
    validateStep,
    getProfileSpecificQuestions,
    getProfileContextForSummary
  } = useFormValidation(formData);

  // Template and customization state
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
  const [fontStyle, setFontStyle] = useState(DEFAULT_FONT_STYLE);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);

  // Export functions
  const { generateDocx, generatePlainText, exporting } = useExportFunctions(formData, sectionOrder);

  // Form handlers
  const {
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
  } = useFormHandlers(formData, setFormData, saveFormData, setLoading);

  // Enhanced navigation with validation
  const handleNextStep = () => {
    const validation = validateStep(step);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
    nextStep();
  };

  const persistCustomization = (updates) => {
    updateFormData(updates);
  };

  const handleTemplateSelect = (value) => {
    setSelectedTemplate(value);
    persistCustomization({ selectedTemplate: value });
  };

  const handleAccentColorChange = (value) => {
    setAccentColor(value);
    persistCustomization({ accentColor: value });
  };

  const handleFontStyleChange = (value) => {
    setFontStyle(value);
    persistCustomization({ fontStyle: value });
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    persistCustomization({ fontSize: value });
  };

  const handleSectionOrderChange = (value) => {
    setSectionOrder(value);
    persistCustomization({ sectionOrder: value });
  };

  React.useEffect(() => {
    if (!dataLoaded) return;

    setSelectedTemplate(formData.selectedTemplate || DEFAULT_TEMPLATE);
    setAccentColor(formData.accentColor || DEFAULT_ACCENT_COLOR);
    setFontStyle(formData.fontStyle || DEFAULT_FONT_STYLE);
    setFontSize(String(formData.fontSize || DEFAULT_FONT_SIZE));
    setSectionOrder(
      Array.isArray(formData.sectionOrder) && formData.sectionOrder.length > 0
        ? formData.sectionOrder
        : DEFAULT_SECTION_ORDER
    );
  }, [
    dataLoaded,
    formData.selectedTemplate,
    formData.accentColor,
    formData.fontStyle,
    formData.fontSize,
    formData.sectionOrder,
  ]);

  const handleNewResume = async () => {
    setStep(0);
    if (user) {
      await createNewCv(user, true);
    } else {
      setFormData({});
    }
    setSelectedTemplate(DEFAULT_TEMPLATE);
    setAccentColor(DEFAULT_ACCENT_COLOR);
    setFontStyle(DEFAULT_FONT_STYLE);
    setFontSize(DEFAULT_FONT_SIZE);
    setSectionOrder(DEFAULT_SECTION_ORDER);
  };

  // Loading state
  if (!dataLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Loading Your Resume Builder</h3>
          <p className="text-gray-600 dark:text-gray-400">Preparing your personalized experience...</p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            AI Resume Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create a professional resume that gets you noticed by top employers
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Step {step + 1} of {totalSteps + 1}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete all steps to build your resume</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete</p>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{width: `${progress}%`}}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                  
                  {/* Sparkle effect for high progress */}
                  {progress > 80 && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress milestones */}
              <div className="flex justify-between mt-2">
                {Array.from({ length: totalSteps + 1 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i <= step ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' : 'bg-gray-300 dark:bg-neutral-600'
                    }`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Step Content */}
          <div className="col-span-12">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
              <div className="p-6">
                <StepRenderer
                  step={step}
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  loading={loading}
                  setLoading={setLoading}
                  saveFormData={saveFormData}
                  profileQuestions={getProfileSpecificQuestions()}
                  getProfileContextForSummary={getProfileContextForSummary}
                  // Experience handlers
                  handleAddExperience={handleAddExperience}
                  handleRemoveExperience={handleRemoveExperience}
                  handleAiRewriteExperience={handleAiRewriteExperience}
                  // Education handlers
                  handleAddEducation={handleAddEducation}
                  handleRemoveEducation={handleRemoveEducation}
                  handleAiRewriteEducation={handleAiRewriteEducation}
                  // Skills handlers
                  handleAiSuggestSkills={handleAiSuggestSkills}
                  // Project handlers
                  handleAddProject={handleAddProject}
                  handleRemoveProject={handleRemoveProject}
                  handleAiRewriteProject={handleAiRewriteProject}
                  // Template and customization
                  isPremium={isPremium}
                  setPremium={setPremium}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={handleTemplateSelect}
                  accentColor={accentColor}
                  setAccentColor={handleAccentColorChange}
                  fontStyle={fontStyle}
                  setFontStyle={handleFontStyleChange}
                  fontSize={fontSize}
                  setFontSize={handleFontSizeChange}
                  sectionOrder={sectionOrder}
                  setSectionOrder={handleSectionOrderChange}
                  // Export functions
                  generateDocx={generateDocx}
                  generatePlainText={generatePlainText}
                  exporting={exporting}
                  // Navigation
                  onNewResume={handleNewResume}
                />
              </div>

              {/* Navigation Footer */}
              <div className="bg-gray-50 dark:bg-neutral-900 px-8 py-6 border-t border-gray-200 dark:border-neutral-700">
                <div className="flex justify-between items-center">
                  {step > 0 ? (
                    <button
                      onClick={prevStep}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-neutral-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < totalSteps && (
                    <button
                      onClick={handleNextStep}
                      disabled={step === 8 && !selectedTemplate}
                      className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Continue
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
