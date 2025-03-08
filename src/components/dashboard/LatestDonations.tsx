import React from 'react';
import { Link } from 'react-router-dom';

const donation = [
    {
        id: 1,
        name: 'John Doe',
        image: 'https://via.placeholder.com/150',
        date: '2021-01-01',
        amount: 100,
        title: 'Donation for a good cause'
    },
    {
        id: 2,
        name: 'John Doe',
        image: 'https://via.placeholder.com/150',
        date: '2021-01-01',
        amount: 100,
        title: 'Donation for a good cause'
    },
    {
        id: 3,
        name: 'John Doe',
        image: 'https://via.placeholder.com/150',
        date: '2021-01-01',
        amount: 100,
        title: 'Donation for a good cause'
    },
    {
        id: 4,
        name: 'John Doe',
        image: 'https://via.placeholder.com/150',
        date: '2021-01-01',
        amount: 100,
        title: 'Donation for a good cause'
    }
]

const LatestDonations: React.FC = () => {
    return (
        <div className='flex flex-col gap-4 rounded-lg p-6 border border-gray-200'>
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold'>Latest Donations</h1>
                <Link to='/dashboard/donations' className='text-xs text-gray-500 hover:text-gray-700'>View All</Link>
            </div>

            <div className='flex flex-col gap-4'>

                {donation.map((item) => (
                    <div key={item.id} className='flex flex-col gap-4 hover:bg-gray-200 cursor-pointer p-4 rounded-lg'>
                        <div className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                                <img src='https://via.placeholder.com/150' alt="" className='w-10 h-10 rounded-full' />
                                <div className='flex flex-col gap-1'>
                                    <p className='text-sm font-bold'>{item.name}</p>
                                    <p className='text-xs text-gray-500'>{item.date}</p>
                                </div>
                            </div>
                            <p className='text-sm'>{item.title}</p>
                            <p className='text-sm'>${item.amount}</p>
                        </div>
                        {/* <div className='w-full h-[1px] bg-gray-200'></div> */}
                    </div>
                ))}

            </div>

        </div>
    )
}

export default LatestDonations;