import { BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import LatestDonations from '../../components/dashboard/LatestDonations';
import FundsGraph from '../../components/dashboard/FundsGraph';
import { AuthContext } from '../../context/userContext';
import { BASE_URL } from '../../config/url';
import axios from 'axios';




const MainDashboard = () => {
    const { user } = useContext(AuthContext) || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [basicInfo, setBasicInfo] = useState<any>(null);
    const [latestDonations, setLatestDonations] = useState<any>(null);

    const card = [
        {
            title: "Total Funds Raised",
            value: basicInfo?.fundsRaised
        },
        {
            title: "Active Campaigns",
            value: basicInfo?.totalActiveCampaigns
        },
        {
            title: "Pending Withdrawals",
            value: basicInfo?.totalCampaigns
        },
        {
            title: "Success Rate",
            value: basicInfo?.successRate
        }
    ]

    useEffect(() => {
        if (!user?.userId) {
            return;
        }
    
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}/analytics/campaigner/basic-info/${user?.userId}`);
                setBasicInfo(res.data);
                console.log(res.data);

                const res2 = await axios.get(`${BASE_URL}/analytics/campaigner/latest-donations/${user?.userId}`);
                console.log(res2.data);
                const donations = res2.data.filter((item:any)=>item.donorId === user?.userId);
                setLatestDonations(donations);


            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetch();
    }, [user]);  
    

    return (
        <div className='px-4 py-2 flex flex-col gap-4'>


            {/* user info */}
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>Hello! {user?.name}</h1>
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
                    <LatestDonations latestDonations={latestDonations} />
                </div>
                <div className='w-1/2'>
                    <FundsGraph />
                </div>
            </div>


        </div>
    );
};

export default MainDashboard;
