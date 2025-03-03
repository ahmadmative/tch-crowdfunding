import React from 'react';
import { Link } from 'react-router-dom';

const ForgetPassword = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-15 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src="/footer-logo.png" alt="logo" className='w-[200px] h-[40px]'/>
          
        </div>

        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Forgot Password</h1>
          <p className='text-gray-700 text-sm'>Enter your email address</p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

          </div>

          <div>
            <Link to="/verification" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c]">
              Send Code
            </Link>
          </div>
          

          
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;