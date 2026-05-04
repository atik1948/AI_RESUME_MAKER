import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormState } from '../hooks/useFormState';
import CVManager from '../components/CVManager';
import { FiPlus, FiBarChart2, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    className="bg-white dark:bg-neutral-800/50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-neutral-700/50"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const DashboardPage = () => {
  const {
    user,
    cvList,
    cvId,
    isPremium,
    createNewCv,
    deleteCv,
    switchCv,
    renameCv,
    duplicateCv,
    loading,
    dataLoaded,
    isNewCv
  } = useFormState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isNewCv) {
      navigate('/builder');
    }
  }, [isNewCv, navigate]);

  if (!dataLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-700 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Your Dashboard...</h3>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user.displayName || 'Creator'}!
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Here's your resume dashboard. Let's create something amazing.
            </p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0 space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
              <FiSettings className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
            <button 
              onClick={() => createNewCv(user)}
              disabled={loading || (!isPremium && cvList.length >= 1)}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
              icon={<FiPlus />}
            >
              New Resume
            </button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatCard 
            icon={<FiBarChart2 className="w-6 h-6 text-green-800" />} 
            label="Active Resumes" 
            value={cvList.length}
            color="bg-green-100 dark:bg-green-900/50"
          />
          <StatCard 
            icon={<FiBarChart2 className="w-6 h-6 text-indigo-800" />} 
            label="Account Status" 
            value={isPremium ? 'Premium' : 'Free'}
            color="bg-indigo-100 dark:bg-indigo-900/50"
          />
          <StatCard 
            icon={<FiBarChart2 className="w-6 h-6 text-sky-800" />} 
            label="Templates Used" 
            value="3" // Placeholder
            color="bg-sky-100 dark:bg-sky-900/50"
          />
        </motion.div>

        {/* CV Manager */}
        <CVManager
          user={user}
          cvList={cvList}
          currentCvId={cvId}
          createNewCv={createNewCv}
          switchCv={switchCv}
          deleteCv={deleteCv}
          renameCv={renameCv}
          duplicateCv={duplicateCv}
          isPremium={isPremium}
          loading={loading}
          onEdit={(id) => navigate(`/builder`)}
          onDownload={(cvId) => console.log(`Downloading CV with id: ${cvId}`)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
