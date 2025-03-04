import React from 'react';

interface DonorCardProps {
  name: string;
  amount: number;
  date: string;
  avatar: string;
}

const DonorCard: React.FC<DonorCardProps> = ({ name, amount, date, avatar }) => {
  return (
    <div className='flex flex-col gap-2'>
                        <div className='flex flex-row lg:flex-row md:flex-col justify-between gap-2'>
                            <div className='flex items-center gap-2'>
                                <img src="/campaign-details.png" alt="avatar" className='w-[50px] h-[50px] rounded-md' />
                                <div className='flex flex-col justify-between h-full'>
                                    <p className='text-sm font-bold text-black font-onest'>Camerom williams</p>
                                    <div className='flex items-center gap-2'>
                                        <img src="/clock.png" alt="clock" className='w-[20px] h-[20px] rounded-lg' />
                                        <p className='text-xs text-gray-600'>November 2024</p>
                                    </div>
                                </div>
                                
                            </div>
                            <p className='text-sm font-bold text-[#BEE36E]'>R150</p>
                        </div>
                    <div className="w-full h-[1px] bg-gray-300"></div>
                    </div>
  )
}

export default DonorCard;
    

