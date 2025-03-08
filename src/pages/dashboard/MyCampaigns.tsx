import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import CampaignCard from '../../components/Campaigns/CampaignCard';

const MyCampaigns = () => {
    const campaigns=[
        {
          _id:"1",
          image:"/campaign-card.png",
          title:"Campaign 1",
          description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
          amount:1000,
          totalDonations:500,
          lastDonationDate:"2021-01-01",
          city:"New York",
          createdAt:"2021-01-01"  
    
        },
        {
          _id:"2",
          image:"/campaign-card.png",
          title:"Campaign 2",
          description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
          amount:1000,
          totalDonations:500,
          lastDonationDate:"2021-01-01",
          city:"New York",
          createdAt:"2021-01-01"  
        },
        {
          _id:"2",
          image:"/campaign-card.png",
          title:"Campaign 2",
          description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
          amount:1000,
          totalDonations:500,
          lastDonationDate:"2021-01-01",
          city:"New York",
          createdAt:"2021-01-01"  
        },
        
      ]


    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold'>My Campaigns</h1>
                    <p className='text-gray-500'>{dayjs(new Date()).format('DD MMM YYYY')}</p>
                </div>
                <Link to="/user/dashboard/campaigns/create" className='bg-[#BEE36E] text-black px-4 py-2 rounded-full hover:opacity-80 transition-all duration-300'>Create Campaign</Link>
            </div>

            {/* campaign list */}
            <div className='flex flex-wrap items-center justify-center gap-4'>
                {campaigns.map((campaign)=>(
                    <CampaignCard key={campaign._id} campaign={campaign} />
                ))}


            </div>

        </div>
    );
};

export default MyCampaigns;
