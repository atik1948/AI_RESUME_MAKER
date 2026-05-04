import React from 'react';

const SkeletonLoader = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-neutral-700 rounded-lg ${className}`}>
    </div>
  );
};

const CVCardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-800/50 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-neutral-700/50">
    <div className="flex justify-between items-start">
      <div className="flex-1 pr-4">
        <SkeletonLoader className="h-5 w-3/4 mb-3" />
        <SkeletonLoader className="h-3 w-1/2" />
      </div>
      <SkeletonLoader className="h-6 w-6 rounded-md" />
    </div>
    <div className="mt-6 flex items-center gap-3">
      <SkeletonLoader className="h-9 w-full rounded-lg" />
      <SkeletonLoader className="h-9 w-full rounded-lg" />
    </div>
  </div>
);

const CVListSkeleton = ({ count = 3 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <CVCardSkeleton key={i} />
      ))}
    </>
  );
};

export { CVListSkeleton };
export default SkeletonLoader;
