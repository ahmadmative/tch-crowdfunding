import React from 'react';

const Footer: React.FC = () => {
  return <div className="max-w-[1200px] mx-auto p-4 flex items-center justify-center">
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='flex items-center justify-center'>
                <img src="/campaign-card.png" alt="logo"  className='w-[100px] h-[100px]'/>
            </div>

            <div className='flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <p className='text-sm '>Toll free care</p>
                    <p className='text-sm font-bold'>1213 14 1441 1</p>
                </div>

                <div className='flex flex-col items-center justify-center'>
                    <p className='text-sm'>Need live support?</p>
                    <p className='text-sm font-bold'>asa@gmail.com</p>
                </div>

            </div>

            <p className='text-sm'>Follow us on</p>

            <div className='flex items-center justify-center gap-2'>
                <div className='w-[40px] h-[40px] bg-[#BEE36E] rounded-full flex items-center justify-center'>F</div>
                <div className='w-[40px] h-[40px] bg-[#BEE36E] rounded-full flex items-center justify-center'>T</div>
                <div className='w-[40px] h-[40px] bg-[#BEE36E] rounded-full flex items-center justify-center'>I</div>
                
            </div>
            div
        </div>

         <div className='w-[1px] h-full bg-gray-200'></div>   
        {/* Right Section */}

        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='flex items-center justify-between gap-4'>
                <input type="text" name="" id="" placeholder='Enter your email' className='w-[300px] h-[40px] border border-[#BEE36E] rounded-full px-4 py-2' />
                <button>send</button>
            </div>

            <div className='flex items-center justify-between gap-4'>
                <div className='flex flex-col items-center justify-center'>
                    <h1>heading</h1>
                    <p>paragraph</p>
                    <p>paragraph</p>
                    <p><param name="" value="" /></p>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1>heading</h1>
                    <p>paragraph</p>
                    <p>paragraph</p>
                    <p><param name="" value="" /></p>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1>heading</h1>
                    <p>paragraph</p>
                    <p>paragraph</p>
                    <p><param name="" value="" /></p>
                </div>

            </div>
        </div>


        
  </div>;
};

export default Footer;
