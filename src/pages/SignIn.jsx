import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white px-8 py-12 rounded-xl shadow-lg">
        <div className='flex items-center justify-center'>
          <img src="/footer-logo.png" alt="logo" className='w-[200px] h-[40px]'/>
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

            <div>
              <div className='flex items-center justify-between'>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgetpassword" className="font-medium text-[#BEE36E] hover:text-gray-900">
                  Forgot password?
                </Link>
              </div>

              </div>
              

              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c]"
              onClick={() => {
                navigate('/dashboard');
              }}
            >
              Login
            </button>
          </div>

          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#BEE36E] hover:text-gray-900">
              Register
            </Link>
          </p>

          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
              />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;