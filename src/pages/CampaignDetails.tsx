import React from 'react';
import { useParams } from 'react-router-dom';
import DonationForm from '../components/donation/DonationForm';

const CampaignDetails = () => {
    const { id } = useParams();
    const raised = 8500;
    const goal = 10000;
    const progress = (raised / goal) * 100;


    return <div className='max-w-[1200px] mx-auto p-4 flex flex-col gap-5 items-center pt-[100px] overflow-x-hidden'>
        {/* upper section */}
        <div className='flex items-center justify-between w-[75%]'>
            <div className='flex flex-col'>
                {/* image section */}
                <div className='relative flex items-center gap-2 rounded-xl overflow-hidden'>
                    <img src="/campaign-details.png" alt="arrow-left" className='w-full h-full rounded-lg' />

                    {/* gradient overlay */}
                    <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent flex items-end p-4'>
                        {/* Progress Bar */}
                        <div className='w-full pb-4'>

                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <img src="/location.png" alt="location" className='w-[20px] h-[20px]' />
                                    <p className='text-xs font-bold text-black'>South Africa</p>
                                </div>
                                <p className='text-xs font-bold text-black text-right mb-1'>{progress}% Funded</p>
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
                     </div>

                </div>

                {/* basic details section */}
                <div className='flex md:flex-row flex-col items-center justify-between gap-2'>

                    {/* avatar and location section */}

                    <div className='flex items-center gap-2 h-[50px]'>
                        <img src="/campaign-details.png" alt="location" className='w-[50px] h-full rounded-md' />

                        <div className='flex flex-col h-full justify-between'>
                            <p className='text-normal font-bold text-black'>Camerom williams</p>

                            <div className='flex items-center gap-2'>
                                <img src="/clock.png" alt="location" className='w-[20px] h-[20px] rounded-lg' />
                                <p className='text-xs font-bold text-gray-600'>November 2024</p>
                            </div>
                        </div>

                    </div>

                    {/* funds required section */}
                    <div className='flex flex-col items-center gap-2'>
                        
                        <p className=' font-bold text-black '>Required Funds</p>
                        <p className='text-[#BEE36E] font-bold text-2xl' >R{raised}</p>
                    </div>

                    {/* donate btn */}
                    
                    <button className="bg-[#BEE36E] flex items-center justify-center text-black px-4 py-1 md:py-2 rounded-full text-sm font-bold h-[50px] shadow-md hover:bg-[#BEE36E]/80 transition-all duration-300">
                        Donate Now 
                        <img src="/arrow-black.png" alt="arrow-right" className="w-4 h-4 ml-2" />
                    </button>

                    
                </div>

                {/* campaign details section */}

                <div className='flex flex-col gap-2 py-6'>
                    {/* title & story section */}
                    <div className='flex flex-col'>
                        <p className='text-sm font-bold text-black py-2'>Just Plain Darren needs you.</p>
                        <p className='text-xs text-gray-600 leading-6'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                        </p>
                    </div>

                    {/* goal section */}
                    <div className='flex flex-col'>
                        <p className='text-sm font-bold text-black py-2'>Our Challenge & Goal</p>
                        <p className='text-xs text-gray-600 leading-6'>However, if you intended to refer to body or organ donation, that is a separate topic. Organ donation involves the voluntary donation of
                        organs or tissues from a living or deceased person to help save or improve the lives of others in need of transplantation. including poverty, education, healthcare, disaster relief, environmental conservation, and more. People can contribute to charities by
                        making financial donations, volunteering their time and skills, It is a generous act that can make a significant difference in someone's life by providing them with a chance for a healthier future.</p>
                    </div>
                </div>

                {/* donation form section */}
                <DonationForm id={id || ''} />

                


            </div>

            {/* donors section */}
            <div className='flex flex-col'>
                <p>donor1</p>
                <p>donor2</p>
            </div>
        </div>

        {/* details section */}
    </div>;
};

export default CampaignDetails;
