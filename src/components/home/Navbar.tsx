import React from 'react';

const Navbar: React.FC = () => {
  return <div className="flex justify-between items-center mx-auto m-2 font-size-14 h-[57px]">
    <div className='flex items-center gap-4'>
        <img src={"/logo.png"} alt="logo" width={100} height={100}/>
        <img src={"/line.png"} alt="logo" className='w-[1px] h-[30px]'/>
        
        <a href="/home">Home</a>
        <a href="/home">Campaigns</a>
        <a href="/home">Donate</a>
        <a href="/home">About</a>
        <a href="/home">Contact</a>

        
    </div>
    <div className='flex items-center gap-4'>
        <button className='bg-black text-white px-4 py-2 rounded-full w-[100px]'>Signup</button>
        <button className='bg-[#BEE36E] text-black px-4 py-2 rounded-full w-[100px]'>Login</button>
    </div>
    
  </div>;
};

export default Navbar;
