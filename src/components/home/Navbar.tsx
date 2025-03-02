import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 px-4 right-0 bg-white z-50">
      <div className="max-w-[1200px] mx-auto py-2 font-size-14 h-[57px] relative">
        <div className="flex justify-between items-center h-full">
          {/* Rest of the navbar content stays the same */}
          <div className='flex items-center gap-4'>
            <img src={"/logo.png"} alt="logo" width={100} height={100} className=""/>
            <img src={"/line.png"} alt="logo" className='w-[1px] h-[30px] hidden md:block'/>
            
            <div className="hidden md:flex items-center gap-4">
              <a href="/home" className="hover:text-[#BEE36E] transition-colors duration-300">Home</a>
              <a href="/campaigns" className="hover:text-[#BEE36E] transition-colors duration-300">Campaigns</a>
              <a href="/donate" className="hover:text-[#BEE36E] transition-colors duration-300">Donate</a>
              <a href="/about" className="hover:text-[#BEE36E] transition-colors duration-300">About</a>
              <a href="/contact" className="hover:text-[#BEE36E] transition-colors duration-300">Contact</a>
            </div>
          </div>

          <div className='hidden md:flex items-center gap-4'>
            <button className='bg-black text-white px-4 py-2 rounded-full w-[100px] hover:bg-gray-800 transition-colors duration-300'>
              Signup
            </button>
            <button className='bg-[#BEE36E] text-black px-4 py-2 rounded-full w-[100px] hover:bg-[#a8cc5c] transition-colors duration-300'>
              Login
            </button>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black mb-1.5 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          absolute top-[57px] left-0 right-0 bg-white shadow-lg rounded-b-lg
          transform transition-all duration-300 ease-in-out
          md:hidden
          ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        `}>
          <div className="flex flex-col p-4 gap-4">
            <a href="/home" className="hover:text-[#BEE36E] transition-colors duration-300">Home</a>
            <a href="/campaigns" className="hover:text-[#BEE36E] transition-colors duration-300">Campaigns</a>
            <a href="/donate" className="hover:text-[#BEE36E] transition-colors duration-300">Donate</a>
            <a href="/about" className="hover:text-[#BEE36E] transition-colors duration-300">About</a>
            <a href="/contact" className="hover:text-[#BEE36E] transition-colors duration-300">Contact</a>
            
            <div className='flex flex-col gap-3 pt-2'>
              <button className='bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300'>
                Signup
              </button>
              <button className='bg-[#BEE36E] text-black px-4 py-2 rounded-full hover:bg-[#a8cc5c] transition-colors duration-300'>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;