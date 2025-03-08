import { BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import LatestDonations from '../../components/dashboard/LatestDonations';
import FundsGraph from '../../components/dashboard/FundsGraph';


const card = [
    {
        title: "Total Funds Raised",
        value: 1234
    },
    {
        title: "Active Campaigns",
        value: 2
    },
    {
        title: "Pending Withdrawals",
        value: 1234
    },
    {
        title: "Success Rate",
        value: 90
    }
]

const MainDashboard = () => {
    return (
        <div className='px-4 py-2 flex flex-col gap-4'>


            {/* user info */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>Hello! username</h1>
                <p className='text-gray-500'>{dayjs(new Date()).format('DD MMM YYYY')}</p>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
                {card.map((item, index) => (
                    <StatsCard key={index} title={item.title} value={item.value} />
                ))}
            </div>



            {/* Recent Donations & graph */}
            <div className='flex justify-between gap-4'>
                <div className='w-1/2'>
                    <LatestDonations />
                </div>
                <div className='w-1/2'>
                    <FundsGraph />
                </div>
            </div>


        </div>
    );
};

export default MainDashboard;
