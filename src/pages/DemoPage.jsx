import React from 'react';
import ProfileDemo from '../components/ProfileDemo';

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Dynamic Profile-Specific Questions Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This demo showcases how the AI Resume Builder adapts its questions based on the user's selected profile type, 
            ensuring that each resume captures the most relevant and impactful information for their specific background and career goals.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Key Features:</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">🎓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Student/Recent Graduate</h3>
                  <p className="text-sm text-gray-600">Focus on education, projects, internships, and academic achievements</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">💼</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Experienced Professional</h3>
                  <p className="text-sm text-gray-600">Highlight career achievements, leadership, and industry expertise</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">🔄</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Career Changer</h3>
                  <p className="text-sm text-gray-600">Emphasize transferable skills and preparation for new field</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">🔬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Academic/Researcher</h3>
                  <p className="text-sm text-gray-600">Showcase research, publications, and academic contributions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-semibold">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Creative Professional</h3>
                  <p className="text-sm text-gray-600">Feature portfolio, creative projects, and artistic skills</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">AI-Enhanced</h3>
                  <p className="text-sm text-gray-600">Smart suggestions and context-aware resume generation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ProfileDemo />
        
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🚀 Ready to build your perfect resume?
            </h3>
            <p className="text-blue-700 mb-4">
              Experience the full AI Resume Builder with authentication, template selection, and PDF generation.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Try the Full Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;