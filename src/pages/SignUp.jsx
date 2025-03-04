import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-15 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src="/footer-logo.png" alt="logo" className='w-[200px] h-[40px]'/>
          
        </div>
        
        <form className="mt-8 space-y-6 font-sans">
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

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


            <div className='relative'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
                  <input
                      id="password"
                      name="password"
                      type={hide ? "password" : "text"}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent pr-10"
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                  id="confirmPassword"
                  name="confirmPassword"
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
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c]"
            >
              Register
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-[#BEE36E] hover:text-gray-900">
              Login
            </Link>
          </p>

          
        </form>
      </div>
    </div>
  );
};

export default SignUp;