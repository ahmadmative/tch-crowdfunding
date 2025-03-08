import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const CampaignerDashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen font-onest">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* seacrh bar  */}
        
        <div className='flex justify-end gap-4 py-4 px-6 items-center'>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#BEE36E]">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
            />
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-500 mx-3 cursor-pointer" />
          </div>


          <div className='w-[1px] h-10 bg-gray-400'></div>

          <div className='flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
            <BellIcon className='w-6 h-6' />
          </div>

          <div className='w-[1px] h-10 bg-gray-400'></div>

          <div className='flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100'>
            <UserCircleIcon className='w-6 h-6' />
          </div>
        </div>
        <div className="container mx-auto px-6 py-2">

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CampaignerDashboardLayout; 