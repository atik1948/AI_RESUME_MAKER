import ModernTemplatePDF from './ModernTemplatePDF';
import OnePageSidebarTemplatePDF from './OnePageSidebarTemplatePDF';
import StudentTemplatePDF from './StudentTemplatePDF';
import ExperiencedTemplatePDF from './ExperiencedTemplatePDF';
import CareerChangerTemplatePDF from './CareerChangerTemplatePDF';
import AcademicTemplatePDF from './AcademicTemplatePDF';
import CreativeTemplatePDF from './CreativeTemplatePDF';

export const templates = [
  // Universal Templates
  {
    id: 'modern',
    name: 'Modern Professional',
    category: 'Universal',
    component: ModernTemplatePDF,
    description: 'A clean, modern template suitable for most professional roles across all industries.',
    preview: '🟦 Modern',
    profileTypes: ['all'],
    features: ['ATS-Optimized', 'Clean Design', 'Customizable'],
    accentColor: '#2563eb',
    tier: 'Free',
  },
  {
    id: 'one_page_sidebar',
    name: 'One-Page Sidebar',
    category: 'Universal',
    component: OnePageSidebarTemplatePDF,
    description: 'A compact single-page resume with a left sidebar and structured main content, inspired by classic CV layouts.',
    preview: '📄 Sidebar',
    profileTypes: ['all'],
    features: ['One Page Layout', 'Sidebar Design', 'Compact Content', 'Photo Placeholder'],
    accentColor: '#7fc7d9',
    tier: 'Free',
  },
  
  // Profile-Specific Templates
  {
    id: 'student',
    name: 'Student & Graduate',
    category: 'Student',
    component: StudentTemplatePDF,
    description: 'Designed for students and recent graduates. Emphasizes education, projects, and potential.',
    preview: '🎓 Student',
    profileTypes: ['student'],
    features: ['Education Focus', 'Project Highlights', 'GPA Display', 'Academic Awards'],
    accentColor: '#3B82F6',
    tier: 'Free',
  },
  {
    id: 'experienced',
    name: 'Executive Professional',
    category: 'Professional',
    component: ExperiencedTemplatePDF,
    description: 'Perfect for seasoned professionals. Highlights leadership, achievements, and career progression.',
    preview: '💼 Executive',
    profileTypes: ['experienced'],
    features: ['Leadership Focus', 'Achievement Metrics', 'Career Timeline', 'Industry Expertise'],
    accentColor: '#1E293B',
    tier: 'Premium',
  },
  {
    id: 'career_changer',
    name: 'Career Transition',
    category: 'Transition',
    component: CareerChangerTemplatePDF,
    description: 'Tailored for career changers. Emphasizes transferable skills and motivation for change.',
    preview: '🔄 Transition',
    profileTypes: ['career_changer'],
    features: ['Transferable Skills', 'Transition Story', 'Preparation Highlights', 'Goal Alignment'],
    accentColor: '#10B981',
    tier: 'Premium',
  },
  {
    id: 'academic',
    name: 'Academic & Research',
    category: 'Academic',
    component: AcademicTemplatePDF,
    description: 'Specialized for academics and researchers. Focuses on publications, grants, and scholarly work.',
    preview: '🔬 Academic',
    profileTypes: ['academic'],
    features: ['Publication List', 'Grant Tracking', 'Research Focus', 'Conference Presentations'],
    accentColor: '#7C3AED',
    tier: 'Premium',
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    category: 'Creative',
    component: CreativeTemplatePDF,
    description: 'Designed for creative professionals. Showcases portfolio, visual projects, and artistic achievements.',
    preview: '🎨 Creative',
    profileTypes: ['creative'],
    features: ['Portfolio Integration', 'Visual Appeal', 'Project Showcase', 'Creative Process'],
    accentColor: '#F59E0B',
    tier: 'Premium',
  },
];

// Helper function to get templates for a specific profile type
export const getTemplatesForProfile = (profileType) => {
  return templates.filter(template =>
    template.profileTypes.includes('all') ||
    template.profileTypes.includes(profileType)
  );
};

// Helper function to get template by ID
export const getTemplateById = (templateId) => {
  return templates.find(template => template.id === templateId);
};

// Helper function to get all categories
export const getTemplateCategories = () => {
  return [...new Set(templates.map(template => template.category))];
};

// Template recommendations based on profile type
export const getRecommendedTemplate = (profileType) => {
  const profileSpecificTemplate = templates.find(template =>
    template.profileTypes.includes(profileType) && template.profileTypes[0] !== 'all'
  );
  return profileSpecificTemplate || templates.find(template => template.id === 'one_page_sidebar');
};
