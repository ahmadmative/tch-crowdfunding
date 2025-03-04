import React, { useState } from 'react';
import CampaignCard from '../components/Campaigns/CampaignCard';

const Campaigns = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Select Category');

  const categories = ['Education', 'Health', 'Environment', 'Animal Welfare', 'Social Causes'];

  return (
    <div className='max-w-[1200px] mx-auto p-4 flex flex-col gap-5 items-center pt-[100px] overflow-x-hidden font-sans'>
      {/* Header Section */}
      <div className="w-full flex items-center justify-center gap-2">
        <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
        <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px]">
          CAMPAIGNS
        </p>
      </div>

      <h1 className='text-4xl font-bold font-onest'>All Campaigns</h1>
      <p className='text-gray-700 text-sm font-sans'>Explore our campaigns and support the causes you care about.</p>

      {/* Search & Filters Section */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-4 relative'>
        {/* Search Bar */}
        <div className='flex items-center gap-2 border border-gray-300 rounded-full p-2 w-[320px]'>
          <input type="text" placeholder='Search Campaigns' className='w-full h-[20px] rounded-full outline-none px-2' />
          <img src="/search.png" alt="search" className='w-[20px] h-[20px]' />
        </div>

        {/* Category Dropdown */}
        <div className='relative'>
          <div 
            className='flex items-center gap-2 border border-gray-300 rounded-full p-2 px-4 cursor-pointer'
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <p className='text-sm font-normal text-gray-600'>{selectedCategory}</p>
            <img src="/arrow-down.png" alt="sort" className='w-[15px] h-[15px]' />
          </div>

          {/* Dropdown List */}
          {categoryOpen && (
            <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10">
              {categories.map((category, index) => (
                <li 
                  key={index} 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCategoryOpen(false);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filters */}
        <div className='flex items-center gap-2 border border-gray-300 rounded-full p-2 px-4 cursor-pointer'>
          <p className='text-sm font-normal text-gray-600'>Filters</p>
          <img src="/filter.png" alt="filter" className='w-[20px] h-[20px]' />
        </div>
      </div>

      {/* Campaigns Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
        <CampaignCard />
      </div>
    </div>
  );
};

export default Campaigns;
