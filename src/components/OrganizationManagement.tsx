import React, { useState } from 'react';
import OrganizationList from './organization/OrganizationList';
import OrganizationStats from './organization/OrganizationStats'; 
import OrganizationRequests from './organization/OrganizationRequests';
import OrganizationSuspended from './organization/OrganizationSuspended';
import OrganizationRegected from './organization/OrganizationRejected';
import OrganizationApproved from './organization/OrganizationApproved';

const OrganizationManagement = () => {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="p-4">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ml-4 ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Organisation List
        </button>

        <button
          className={`px-4 py-2 font-medium ml-4 ${
            activeTab === 'requests'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          Organisation Requests
        </button>

        <button
          className={`px-4 py-2 font-medium ml-4 ${
            activeTab === 'approved'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Organisations
        </button>

        <button
          className={`px-4 py-2 font-medium ml-4 ${
            activeTab === 'regected'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('regected')}
        >
          Organisation Requests Rejected
        </button>

        <button
          className={`px-4 py-2 font-medium ml-4 ${
            activeTab === 'suspended'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('suspended')}
        >
          Organisation Suspended
        </button>

        <button
          className={`px-4 py-2 font-medium ml-4 ${
            activeTab === 'statistics'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>

      </div>



      {activeTab === 'statistics' && <OrganizationStats />}
      {activeTab === 'list' && <OrganizationList />}
      {activeTab === 'requests' && <OrganizationRequests />}
      {activeTab === 'approved' && <OrganizationApproved />}
      {activeTab === 'suspended' && <OrganizationSuspended />}
      {activeTab === 'regected' && <OrganizationRegected/>}

    </div>
  );
};

export default OrganizationManagement;
