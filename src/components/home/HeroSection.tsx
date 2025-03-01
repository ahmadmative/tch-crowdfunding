import React from 'react';

const HeroSection: React.FC = () => {
  return <div className='flex justify-between items-center w-full h-[510px] mt-10'>
    <div className='w-full h-full rounded-lg relative'>
        <img src={"/hero-image.png"} alt="hero-image" className='w-[100%] h-[100%]'/>
        <div className='absolute top-0 left-0 w-full h-full rounded-lg'>
            <img src={"/hero-upper.png"} alt="hero-image" className='w-[100%] h-[100%]'/>
            
            <div className='absolute bottom-10 left-10 w-[90%] flex flex-col justify-end'>
                <div className='flex flex-col gap-2 text-white mb-4 w-full'>
                    <div className='flex text-white w-full flex'>
                        <p className='text-4xl font-bold'>Make.</p>
                    </div>
                    <div className='flex justify-between text-white mb-4 w-full'>
                        <div className='flex items-center '>
                            <p className='text-7xl font-bold text-[#BEE36E] tracking-wide leading-tight'>Change</p>
                            <div className='flex flex-col flex-end text-white text-2xl font-bold'>
                                <p>With</p>
                                <p>Donations!</p>
                            </div>
                        </div>
                        <div className='mt-auto'>
                            <button className='bg-[#BEE36E] text-black px-6 py-3 rounded-full text-lg font-bold w-[210px] h-[50px] shadow-md hover:bg-[#BEE36E]/80 transition-all duration-300'>
                                Donate Now!
                            </button>
                        </div>
                        

                    </div>
                    

                </div>

            </div>
        </div>

    </div>
  </div>;
};

export default HeroSection;
