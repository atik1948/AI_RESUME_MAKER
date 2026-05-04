import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './ui/Modal';
import { CVListSkeleton } from './ui/SkeletonLoader';
import Input from './ui/Input';
import Button from './ui/Button';
import { FiEdit, FiCopy, FiTrash2, FiPlus, FiStar, FiDownload, FiMoreVertical, FiEye } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';

const CVManager = ({ user, cvList, currentCvId, createNewCv, switchCv, deleteCv, renameCv, duplicateCv, isPremium, loading, onEdit, onDownload }) => {
  const [isRenameModalOpen, setRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (isRenameModalOpen && selectedCv) {
      setNewName(selectedCv.name);
    }
  }, [isRenameModalOpen, selectedCv]);

  const openRenameModal = (cv) => {
    setSelectedCv(cv);
    setRenameModalOpen(true);
  };

  const handleRename = () => {
    if (newName && newName.trim() !== "") {
      renameCv(selectedCv.id, newName.trim());
      setRenameModalOpen(false);
      setNewName("");
    }
  };

  const openDeleteModal = (cv) => {
    setSelectedCv(cv);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    deleteCv(selectedCv.id);
    setDeleteModalOpen(false);
  };

  const handleUpgrade = () => {
    setUpgradeModalOpen(true);
  };

  const CreateNewCard = () => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="relative"
    >
      <button
        onClick={() => createNewCv(user)}
        disabled={loading || (!isPremium && cvList.length >= 1)}
        className="w-full h-full p-6 text-center bg-white dark:bg-neutral-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <FiPlus className="w-12 h-12 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
        <p className="mt-4 font-semibold text-lg text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">Create New Resume</p>
      </button>
      {!isPremium && cvList.length >= 1 && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
            Upgrade to create more
          </span>
        </div>
      )}
    </motion.div>
  );

  const renderCVItem = (cv) => (
    <motion.div
      layout
      key={cv.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative group bg-white dark:bg-neutral-800/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border ${
        cv.id === currentCvId
          ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/50'
          : 'border-gray-200 dark:border-neutral-700/50'
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                {cv.name || `Untitled Resume`}
              </h3>
              {cv.id === currentCvId && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                  Active
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">
                  {cv.lastModified ? new Date(cv.lastModified.seconds * 1000).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  }) : 'Never updated'}
                </span>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>
                  {cv.template ? `${cv.template} Template` : 'Default Template'}
                </span>
              </div>
            </div>
          </div>
          <CVItemMenu cv={cv} />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={() => { switchCv(cv.id); onEdit(cv.id); }}
            size="sm"
            icon={<FiEdit />}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            onClick={(e) => { e.stopPropagation(); onDownload(cv.id); }}
            variant="outline"
            size="sm"
            icon={<FiDownload />}
            className="flex-1"
          >
            Download
          </Button>
        </div>
      </div>
      {cv.id === currentCvId && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
          <FiStar className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  );

  const CVItemMenu = ({ cv }) => (
    <Menu as="div" className="relative z-10">
      <Menu.Button as={React.Fragment}>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <FiMoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.button>
      </Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-neutral-800 divide-y divide-gray-100 dark:divide-neutral-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    switchCv(cv.id);
                  }}
                  disabled={cv.id === currentCvId}
                  className={`${
                    cv.id === currentCvId
                      ? 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : active 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-900 dark:text-gray-100'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm transition-colors`}
                >
                  <FiEye className="w-5 h-5 mr-2" />
                  {cv.id === currentCvId ? 'Currently Active' : 'Set as Active'}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => { e.stopPropagation(); openRenameModal(cv); }}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <FiEdit className="w-5 h-5 mr-2" />
                  Rename
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateCv(cv.id); }}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <FiCopy className="w-5 h-5 mr-2" />
                  Duplicate
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => { e.stopPropagation(); openDeleteModal(cv); }}
                  className={`${
                    active ? 'bg-red-500 text-white' : 'text-red-600 dark:text-red-500'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <FiTrash2 className="w-5 h-5 mr-2" />
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Resumes</h2>
          {!isPremium && (
            <Button
              onClick={handleUpgrade}
              variant="premium"
              size="sm"
            >
              <FiStar className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CreateNewCard />
          {loading ? (
            <CVListSkeleton count={3} />
          ) : (
            <AnimatePresence>
              {cvList.map(renderCVItem)}
            </AnimatePresence>
          )}
        </div>

        {!loading && cvList.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <p className="text-gray-500 dark:text-gray-400 text-lg">You haven't created any resumes yet.</p>
            <p className="text-gray-400 dark:text-gray-500">Click the card above to get started!</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={isRenameModalOpen} onClose={() => setRenameModalOpen(false)} title="Rename Resume">
        <div className="space-y-4">
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            aria-label="New resume name"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRenameModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Rename</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="space-y-4">
          <p>Are you sure you want to delete "<strong>{selectedCv?.name || 'this resume'}</strong>"? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isUpgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} title="Upgrade to Premium">
        <div className="space-y-4 text-center">
          <FiStar className="w-16 h-16 text-yellow-400 mx-auto" />
          <h3 className="text-2xl font-bold">Unlock Your Potential</h3>
          <p className="text-gray-500 dark:text-gray-400">Upgrade to Premium to create unlimited resumes, access exclusive templates, and get advanced analytics.</p>
          <Button
            variant="premium"
            size="lg"
            onClick={() => {
              console.log("Redirecting to payment...");
              setUpgradeModalOpen(false);
            }}
            className="w-full"
          >
            Upgrade Now & Get Hired Faster
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CVManager;