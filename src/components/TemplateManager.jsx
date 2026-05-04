import React, { useState, useEffect } from 'react';
import {
  templates,
  getTemplatesForProfile,
  getTemplateCategories,
  getRecommendedTemplate
} from '../templates/templateRegistry';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { FiStar } from 'react-icons/fi';

const TemplateManager = ({ selectedTemplate, onTemplateSelect, formData, isPremium, setPremium }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const profileType = formData?.profileType;
  const recommendedTemplate = getRecommendedTemplate(profileType);
  const profileTemplates = profileType ? getTemplatesForProfile(profileType) : templates;
  
  const categories = ['All', 'Recommended', ...getTemplateCategories()];
  
  const getFilteredTemplates = () => {
    if (filterCategory === 'All') {
      return templates;
    } else if (filterCategory === 'Recommended') {
      return profileTemplates;
    } else {
      return templates.filter(t => t.category === filterCategory);
    }
  };
  
  const filteredTemplates = getFilteredTemplates();

  // Auto-select recommended template if none selected and profile type exists
  useEffect(() => {
    if (!selectedTemplate && recommendedTemplate && profileType) {
      onTemplateSelect(recommendedTemplate.id);
    }
  }, [profileType, recommendedTemplate, selectedTemplate, onTemplateSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-gray-200">Choose Your Resume Template</h2>
          {profileType && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Showing templates optimized for {profileType === 'career_changer' ? 'career changers' : `${profileType} profiles`}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 shadow' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'list' ? 'bg-white dark:bg-neutral-800 shadow' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Template Alert */}
      {recommendedTemplate && filterCategory === 'All' && (
        <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Recommended for {profileType === 'career_changer' ? 'Career Changers' : `${profileType.charAt(0).toUpperCase() + profileType.slice(1)} Profiles`}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                The <strong>{recommendedTemplate.name}</strong> template is specifically designed for your profile type and will highlight your strengths effectively.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const count = category === 'All' ? templates.length :
                      category === 'Recommended' ? profileTemplates.length :
                      templates.filter(t => t.category === category).length;
          
          return (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterCategory === category
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-300'
              } ${category === 'Recommended' ? 'border-2 border-blue-300 dark:border-blue-700' : ''}`}
            >
              {category === 'Recommended' && '⭐ '}
              {category}
              <span className="ml-2 text-xs opacity-75">
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Templates Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isRecommended = recommendedTemplate?.id === template.id;
            const isSelected = selectedTemplate === template.id;
            
            const isPremiumTemplate = template.tier === 'Premium';
            const canSelect = isPremium || !isPremiumTemplate;

            return (
              <div
                key={template.id}
                className={`group border-2 rounded-xl p-6 transition-all duration-300 relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 shadow-lg transform scale-105'
                    : isRecommended
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/30 hover:border-green-500'
                    : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                } ${canSelect ? 'cursor-pointer hover:shadow-xl' : 'cursor-not-allowed opacity-70'}`}
                onClick={() => canSelect ? onTemplateSelect(template.id) : setUpgradeModalOpen(true)}
              >
                {/* Premium Badge */}
                {isPremiumTemplate && (
                  <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ⭐ Premium
                  </div>
                )}

                {/* Recommended Badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    💡 Recommended
                  </div>
                )}

                {/* Template Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold dark:text-gray-200">{template.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: template.accentColor }}
                      >
                        {template.category}
                      </span>
                      {template.profileTypes && template.profileTypes.includes(profileType) && (
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-full">
                          Perfect Match
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-3xl group-hover:scale-110 transition-transform">
                    {template.preview?.split(' ')[0] || '📄'}
                  </div>
                </div>

                {/* Template Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{template.description}</p>

                {/* Features */}
                {template.features && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300 px-2 py-1 rounded"
                        >
                          ✓ {feature}
                        </span>
                      ))}
                      {template.features.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{template.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex items-center text-blue-600 font-medium">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Selected Template
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => {
            const isRecommended = recommendedTemplate?.id === template.id;
            const isSelected = selectedTemplate === template.id;
            const isPremiumTemplate = template.tier === 'Premium';
            const canSelect = isPremium || !isPremiumTemplate;
            
            return (
              <div
                key={template.id}
                className={`flex items-center p-4 border-2 rounded-lg transition-all relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50'
                    : isRecommended
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/30 hover:border-green-500'
                    : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                } ${canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                onClick={() => canSelect ? onTemplateSelect(template.id) : setUpgradeModalOpen(true)}
              >
                {/* Premium Badge */}
                {isPremiumTemplate && (
                  <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ⭐ Premium
                  </div>
                )}

                {/* Recommended Badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    💡 Recommended
                  </div>
                )}
                
                <div className="text-4xl mr-4">{template.preview?.split(' ')[0] || '📄'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold dark:text-gray-200">{template.name}</h3>
                    {template.profileTypes && template.profileTypes.includes(profileType) && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-full">
                        Perfect Match
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{template.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span
                      className="px-2 py-1 rounded text-white font-medium"
                      style={{ backgroundColor: template.accentColor }}
                    >
                      {template.category}
                    </span>
                    {template.features && template.features.slice(0, 4).map((feature, idx) => (
                      <span key={idx}>✓ {feature}</span>
                    ))}
                  </div>
                </div>
                {isSelected && (
                  <div className="text-blue-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Modal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} title="Upgrade to Premium">
        <div className="space-y-4 text-center">
          <FiStar className="w-16 h-16 text-yellow-400 mx-auto" />
          <h3 className="text-2xl font-bold">Unlock Your Potential</h3>
          <p className="text-gray-500 dark:text-gray-400">Upgrade to Premium to create unlimited resumes, access exclusive templates, and get advanced analytics.</p>
          <Button
            variant="premium"
            size="lg"
            onClick={() => {
              setPremium(true);
              setUpgradeModalOpen(false);
            }}
            className="w-full"
          >
            Upgrade Now & Get Hired Faster
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TemplateManager;
