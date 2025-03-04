import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NewPassword = () => {
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-15 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src="/footer-logo.png" alt="logo" className='w-[200px] h-[40px]'/>
          
        </div>

        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>New Password</h1>
          <p className='text-gray-700 text-sm'>Create a new password</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            

          <div className='relative'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="NewPassword"
                name="NewPassword"
                type={hide ? "password" : "text"}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                placeholder="••••••••"
              />
              <img 
                src={hide ? "/hide.png" : "/view.png"} 
                onClick={() => setHide(!hide)} 
                alt="eye-icon" 
                className='absolute right-3 top-8 w-6 h-6 cursor-pointer' 
              />
            </div>

            <div className='relative'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="ConfirmPassword"
                name="ConfirmPassword"
                type={hideConfirm ? "password" : "text"}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                placeholder="••••••••"
              />
              <img 
                src={hideConfirm ? "/hide.png" : "/view.png"} 
                onClick={() => setHideConfirm(!hideConfirm)} 
                alt="eye-icon" 
                className='absolute right-3 top-8 w-6 h-6 cursor-pointer' 
              />
            </div>

          </div>

          <div>
            <Link to="/signin" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c]">
              Create Password
            </Link>
          </div>
          

          
        </form>
      </div>
    </div>
  );
};

export default NewPassword;