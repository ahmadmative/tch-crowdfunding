import React, { useContext, useState } from 'react';
import { UserCircleIcon, LockClosedIcon, BanknotesIcon, PencilIcon } from '@heroicons/react/24/outline';
import Withdrawal from './Withdrawal';
import Security from './Security';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/userContext';

const tabs = [
    { name: 'Personal & Organization', key: 'profile', icon: UserCircleIcon },
    { name: 'Security Settings', key: 'security', icon: LockClosedIcon },
    { name: 'Withdrawal', key: 'withdraw', icon: BanknotesIcon }
];

const Profile = () => {
    const [activeTab, setActiveTab] = useState<string>('profile');
    const { user } = useContext(AuthContext) || {};

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex md:flex-row flex-col items-center justify-center gap-2'>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 md:text-sm text-xs rounded-full transition-all duration-200 ${activeTab === tab.key
                            ? 'bg-[#BEE36E] text-black'
                            : 'outline outline-[#BEE36E] outline-1 text-[#BEE36E]'
                            }`}
                    >
                        {tab.name} <tab.icon className='w-4 h-4' />
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className='p-4 mt-4'>
                {activeTab === 'security' && <Security />}
                {activeTab === 'withdraw' && <Withdrawal />}

                {
                    activeTab === 'profile' && (
                        <div className='p-4 flex flex-col gap-4'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-2xl font-bold text-[#BEE36E]'>Personal Details</h1>
                                <Link to="/user/dashboard/profile/edit" className='bg-[#BEE36E] flex items-center gap-2 text-black text-sm px-4 py-2 rounded-full'>Edit Profile <PencilIcon className='w-4 h-4' /></Link>
                            </div>

                            {/* Personal Details */}

                            <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>

                                {/* profile details */}

                                <div className='flex flex-col md:flex-row md:items-center gap-4'>

                                    <div className='max-w-[400px] h-full md:max-h-[250px]'>
                                        <img src="/chooseUs-1.png" alt="Profile" className='w-full h-full rounded-lg object-cover' />
                                        <p className='text-sm text-[#BEE36E] cursor-pointer mt-2'>Upload Profile Picture</p>
                                    </div>



                                    <div className='flex flex-col gap-4'>

                                        <div className='flex flex-col gap-1'>
                                            <h1 className='text-sm font-bold'>Name</h1>
                                            <p className='text-sm text-gray-500'>{user?.name}</p>
                                        </div>


                                        {/* <div className='flex flex-col gap-1'>
                                            <h1 className='text-sm font-bold'>Email</h1>
                                            <p className='text-sm text-gray-500'>email@example.com</p>
                                        </div> */}

                                        <div className='flex flex-col gap-1'>
                                            <h1 className='text-sm font-bold'>Gender</h1>
                                            <p className='text-sm text-gray-500'>Male</p>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <h1 className='text-sm font-bold'>Date of Birth</h1>
                                            <p className='text-sm text-gray-500'>12/12/1990</p>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <h1 className='text-sm font-bold'>Nationality</h1>
                                            <p className='text-sm text-gray-500'>USA</p>
                                        </div>





                                    </div>

                                </div>


                                {/* organization details */}


                                <div className='flex flex-col gap-4'>
                                    <h1 className='text-sm font-bold text-[#BEE36E]'>Organization Details</h1>


                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Name</h1>
                                        <p className='text-sm text-gray-500'>Company Name</p>
                                    </div>

                                    <h1 className='text-sm font-bold text-[#BEE36E]'>Contact Details</h1>

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Phone</h1>
                                        <p className='text-sm text-gray-500'>+1234567890</p>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Email</h1>
                                        <p className='text-sm text-gray-500'>{user?.email}</p>
                                    </div>





                                </div>



                                {/* address details */}


                                <div className='flex flex-col gap-4'>
                                    <h1 className='text-sm font-bold text-[#BEE36E]'>Address</h1>


                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Address</h1>
                                        <p className='text-sm text-gray-500'>123 Main St, Anytown, USA</p>
                                    </div>



                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>City</h1>
                                        <p className='text-sm text-gray-500'>Anytown</p>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <h1 className='text-sm font-bold'>Country</h1>
                                        <p className='text-sm text-gray-500'>USA</p>
                                    </div>





                                </div>

                            </div>
                        </div>
                    )
                }
            </div>



        </div>
    );
};

export default Profile;
