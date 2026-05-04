import React from 'react';
import { getTemplateById } from '../templates/templateRegistry';

const CustomizationControls = ({
  selectedTemplate,
  accentColor,
  setAccentColor,
  fontStyle,
  setFontStyle,
  fontSize,
  setFontSize,
  formData
}) => {
  const template = getTemplateById(selectedTemplate);
  
  // Predefined color schemes based on profile types and industries
  const colorSchemes = {
    professional: [
      { name: 'Corporate Blue', color: '#2563EB', description: 'Traditional, trustworthy' },
      { name: 'Executive Navy', color: '#1E293B', description: 'Sophisticated, authoritative' },
      { name: 'Business Gray', color: '#374151', description: 'Modern, professional' },
      { name: 'Success Green', color: '#059669', description: 'Growth-oriented, fresh' },
    ],
    creative: [
      { name: 'Creative Orange', color: '#F59E0B', description: 'Energetic, innovative' },
      { name: 'Design Purple', color: '#7C3AED', description: 'Creative, artistic' },
      { name: 'Brand Red', color: '#DC2626', description: 'Bold, attention-grabbing' },
      { name: 'Teal Accent', color: '#0D9488', description: 'Modern, balanced' },
    ],
    academic: [
      { name: 'Academic Purple', color: '#7C3AED', description: 'Scholarly, intellectual' },
      { name: 'Research Blue', color: '#1D4ED8', description: 'Scientific, methodical' },
      { name: 'Knowledge Green', color: '#065F46', description: 'Educational, growth' },
      { name: 'Classic Maroon', color: '#991B1B', description: 'Traditional, prestigious' },
    ],
    student: [
      { name: 'Student Blue', color: '#3B82F6', description: 'Fresh, optimistic' },
      { name: 'Graduate Green', color: '#10B981', description: 'Achievement, progress' },
      { name: 'Campus Purple', color: '#8B5CF6', description: 'Creative, youthful' },
      { name: 'Future Orange', color: '#F97316', description: 'Ambitious, energetic' },
    ],
    transition: [
      { name: 'Transition Green', color: '#10B981', description: 'Growth, change' },
      { name: 'Career Blue', color: '#0EA5E9', description: 'Professional, forward-thinking' },
      { name: 'Change Purple', color: '#8B5CF6', description: 'Transformation, innovation' },
      { name: 'Progress Teal', color: '#14B8A6', description: 'Evolution, adaptability' },
    ],
  };

  const getRecommendedColors = () => {
    const profileType = formData?.profileType;
    switch (profileType) {
      case 'student':
        return colorSchemes.student;
      case 'experienced':
        return colorSchemes.professional;
      case 'career_changer':
        return colorSchemes.transition;
      case 'academic':
        return colorSchemes.academic;
      case 'creative':
        return colorSchemes.creative;
      default:
        return colorSchemes.professional;
    }
  };

  const fontOptions = [
    { value: 'Helvetica', label: 'Helvetica', description: 'Clean, modern, highly readable' },
    { value: 'Times-Roman', label: 'Times Roman', description: 'Traditional, formal, academic' },
    { value: 'Courier', label: 'Courier', description: 'Technical, monospace, unique' },
  ];

  const fontSizeOptions = [
    { value: '9', label: '9pt', description: 'Compact (more content)' },
    { value: '10', label: '10pt', description: 'Small (good for long resumes)' },
    { value: '11', label: '11pt', description: 'Standard (balanced)' },
    { value: '12', label: '12pt', description: 'Large (easy to read)' },
    { value: '13', label: '13pt', description: 'Extra large (emphasis)' },
  ];


  return (
    <div className="space-y-8">
      {/* Template Info */}
      {template && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {template.preview} {template.name}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">{template.description}</p>
            </div>
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: template.accentColor }}
            >
              {template.preview?.split(' ')[0]}
            </div>
          </div>
          
          {template.features && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {template.features.map((feature, idx) => (
                <span 
                  key={idx}
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full"
                >
                  ✓ {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color Customization */}
      <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
          🎨 Color Scheme
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
            Personalize Your Resume
          </span>
        </h3>
        
        {/* Current Color Preview */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Current Accent Color
          </label>
          <div className="flex items-center space-x-6">
            {/* Large Preview */}
            <div className="relative">
              <div
                className="w-20 h-20 rounded-xl border-4 border-white dark:border-neutral-700 shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 8px 25px ${accentColor}40`
                }}
              >
                <span className="text-white font-bold text-sm drop-shadow-sm">Preview</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white dark:bg-neutral-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs">✨</span>
              </div>
            </div>
            
            {/* Color Input Section */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="relative">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-14 h-14 border-2 border-gray-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-neutral-500 transition-colors"
                    title="Choose custom color"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">+</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Custom Color Picker</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click to choose any color</p>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-1">{accentColor.toUpperCase()}</p>
                </div>
              </div>
              
              {/* Quick Color Swatches */}
              <div className="flex space-x-2">
                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'].map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAccentColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      accentColor === color ? 'border-gray-800 dark:border-gray-200 shadow-md' : 'border-gray-300 dark:border-neutral-600 hover:border-gray-400 dark:hover:border-neutral-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Quick color: ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Colors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recommended for {formData?.profileType || 'your'} profile
            </h4>
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-neutral-700 dark:text-gray-300 px-2 py-1 rounded-full">
              AI Curated
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRecommendedColors().map((scheme, idx) => (
              <button
                key={idx}
                onClick={() => setAccentColor(scheme.color)}
                className={`group p-4 border-2 rounded-xl transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                  accentColor === scheme.color
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 shadow-md'
                    : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                      style={{ backgroundColor: scheme.color }}
                    ></div>
                    {accentColor === scheme.color && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      {scheme.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{scheme.description}</p>
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">{scheme.color}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Psychology Tip */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 dark:text-purple-200 text-sm">💡</span>
            </div>
            <div>
              <h5 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">Color Psychology Tip</h5>
              <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                Colors influence first impressions. Blue conveys trust and professionalism,
                green suggests growth and stability, while purple indicates creativity and innovation.
                Choose colors that align with your industry and personal brand.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">📝 Typography</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Font Family
            </label>
            <div className="space-y-2">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setFontStyle(font.value)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    fontStyle === font.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span 
                      className="font-medium text-gray-800 dark:text-gray-200"
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </span>
                    {fontStyle === font.value && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{font.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Font Size
            </label>
            <div className="space-y-2">
              {fontSizeOptions.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    fontSize === size.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{size.label}</span>
                    {fontSize === size.value && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{size.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Template-Specific Tips */}
      {template && (
        <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            💡 Tips for {template.name}
          </h3>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            {template.id === 'student' && (
              <>
                <p>• Use bright, optimistic colors to convey energy and potential</p>
                <p>• Place Education section early to highlight academic achievements</p>
                <p>• Include GPA if 3.5 or higher, and relevant coursework</p>
              </>
            )}
            {template.id === 'experienced' && (
              <>
                <p>• Choose professional colors that convey authority and expertise</p>
                <p>• Lead with Experience section to showcase career progression</p>
                <p>• Use larger font sizes to ensure easy readability for executives</p>
              </>
            )}
            {template.id === 'career_changer' && (
              <>
                <p>• Select colors that represent growth and positive change</p>
                <p>• Emphasize transferable skills and new field preparation</p>
                <p>• Consider smaller font to fit more transitional information</p>
              </>
            )}
            {template.id === 'academic' && (
              <>
                <p>• Use traditional, scholarly colors for academic credibility</p>
                <p>• Prioritize Publications and Research sections</p>
                <p>• Smaller fonts work well for dense academic content</p>
              </>
            )}
            {template.id === 'creative' && (
              <>
                <p>• Bold, creative colors showcase your artistic sensibility</p>
                <p>• Portfolio section should be prominently placed</p>
                <p>• Consider unique fonts that reflect your creative style</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationControls;