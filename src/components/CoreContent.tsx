import React, { useState } from 'react';
import FAQsUpdate from './FAQsSection';
import AboutUsSectionUpdate from './AboutUsSection';
import FeatureSectionUpdate from './FeatureSectionUpdate';

const CoreContent = () => {
  const [selectedTab, setSelectedTab] = useState<'faqs' | 'features' | 'aboutUs'>('faqs');

  const renderCurrentTab = () => {
    switch (selectedTab) {
      case 'faqs':
        return <FAQsUpdate />;
      case 'features':
        return <FeatureSectionUpdate />;
      case 'aboutUs':
        return <AboutUsSectionUpdate />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('faqs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'faqs'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            FAQs Section
          </button>
          <button
            onClick={() => setSelectedTab('features')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'features'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Features Section
          </button>
          <button
            onClick={() => setSelectedTab('aboutUs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'aboutUs'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            About Us Section
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderCurrentTab()}
      </div>
    </div>
  );
};

export default CoreContent;
