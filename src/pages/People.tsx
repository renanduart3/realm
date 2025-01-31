import React from 'react';

export default function People() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {/* Use dynamic title based on organization type */}
        Clients & People
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          People management features coming soon...
        </p>
      </div>
    </div>
  );
}
