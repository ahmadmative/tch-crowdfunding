import React from 'react';
import CampaignCard from '../Campaigns/CampaignCard';
import { Link } from 'react-router-dom';

const CampaignsSection: React.FC = () => {
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
    <section className="max-w-[1200px] mx-auto py-16 px-4 text-black flex flex-col items-center gap-4">
      {/* Header */}
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='flex items-center justify-center gap-2'>
            <img src="/home-header.png" alt="aboutus" className="w-[20px] h-[14px]"/>
            <p className="text-sm font-normal leading-[15px] text-[#000000] tracking-[3.5px] font-onest">CAMPAIGNS</p>
          </div>
          <h1 className='text-4xl font-bold font-onest'>Featured Campaigns</h1>
          <p className='text-sm text-gray-500 font-sans'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. </p>

        </div>

        {/* Compaign Card */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {campaigns.map((campaign)=>(
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>

        {/* Button */}
        <Link to="/home/campaigns" className='w-[150px] h-[55px] flex items-center justify-center gap-2 border border-[#BEE36E] text-[#BEE36E] px-4 py-2 rounded-full'>View All

          <img src="/arrow.png" alt="arrow-right" className='w-[20px] h-[20px]' />
        </Link>
    </section>
  );
};

export default CampaignsSection;
