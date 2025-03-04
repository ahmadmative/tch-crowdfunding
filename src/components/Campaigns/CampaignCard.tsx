import React from 'react';
import { Link } from 'react-router-dom';

const CampaignCard: React.FC = () => {
    const raised = 8500;
    const goal = 10000;
    const progress = (raised / goal) * 100;

  return (
    <div className='flex flex-col border border-[#020D1914] p-4 gap-4 rounded-lg overflow-hidden max-w-[400px] hover:shadow-lg hover:border-[#BEE36E] transition-all duration-300'>

        {/* Campaign Image */}
        <img src="/campaign-card.png" alt="campaign-card" className='w-full h-[200px] object-cover rounded-lg' />

        {/* Campaign Title */}
        <div className='flex flex-col gap-2'>
            <p className='text-lg font-bold'>Just Plain Darren needs you.</p>
            <p className='text-sm text-gray-500'>Darren Scott, one of South Africa’s most beloved radio and TV sports personalities.</p>
        </div>

        {/* Campaign Details */}

        <div className='flex items-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
                <img src="/location.png" alt="campaign-card-icon" className='w-[20px] h-[20px]' />
                <p className='text-xs font-bold'>South Africa</p>
            </div>

            <div className='flex items-center gap-2'>
                <img src="/clock.png" alt="campaign-card-icon" className='w-[20px] h-[20px]' />
                <p className='text-xs font-bold'> 3 Weeks Ago</p>
            </div>
        </div>

        <p className='text-xs font-bold'>Last Donation : <span className='text-xs text-gray-500 font-normal'>2 Hours Ago</span></p>


        {/* Progress Bar */}
        <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-end'>
                <p className='text-sm font-bold text-[#BEE36E]'>{progress}% Funded</p>
            </div>

            <progress 
                value={raised} 
                max={goal}
                className="w-full h-2 rounded-full 
                    [&::-webkit-progress-bar]:bg-gray-300 
                    [&::-webkit-progress-value]:bg-[#BEE36E] 
                    [&::-moz-progress-bar]:bg-[#BEE36E]"
            />

        </div>

        <div className='flex items-center justify-center'>
            <Link to="/home/campaigns/1" className='bg-[#BEE36E] text-center hover:bg-[#a8cc5c] transition-colors duration-200 text-black font-semibold px-4 py-2 rounded-full w-full'>Donate Now</Link>
            {/* <button className='bg-[#BEE36E] text-black font-semibold px-4 py-2 rounded-full w-full'>Donate Now</button> */}
        </div>
    </div>
  );
};

export default CampaignCard;
