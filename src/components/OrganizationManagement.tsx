import React, { useState } from 'react';
import OrganizationList from './organization/OrganizationList';
import OrganizationStats from './organization/OrganizationStats'; 

const OrganizationManagement = () => {
  const [activeTab, setActiveTab] = useState('statistics');

  return (
    <div className="p-4">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'statistics'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('statistics')}
        >
          Organization Statistics
        </button>
        <button
          className={`px-4 py-2 font-medium ml-4 ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Organization List
        </button>
      </div>

      {activeTab === 'statistics' && <OrganizationStats />}
      {activeTab === 'list' && <OrganizationList />}
    </div>
  );
};

export default OrganizationManagement;
