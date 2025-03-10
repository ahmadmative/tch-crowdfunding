import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const EditProfile = () => {
    // State to manage the uploaded image
    const [imagePreview, setImagePreview] = useState<any>(null);

    // Handle file upload
    const handleImageUpload = (event:any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='flex flex-col gap-4 items-center p-4'>
            <div className='flex flex-col items-center w-full max-w-4xl gap-4 py-6 px-4 md:px-6 border border-gray-300 shadow-md rounded-[20px] text-gray-800'>
                {/* Title */}
                <h1 className='text-2xl font-semibold'>Edit Profile</h1>

                {/* Personal Information Section */}
                <div className='flex flex-col gap-4 w-full'>
                    <h1 className='text-lg font-semibold'>Personal Information</h1>

                    {/* Flex Container for Upload and Form Fields */}
                    <div className='flex flex-col md:flex-row gap-4 w-full'>
                        {/* Custom File Upload Area */}
                        <div className='w-full md:w-1/3 h-full'>
                            <label
                                htmlFor='profilePicture'
                                className='flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#BEE36E] transition-colors h-full'
                            >
                                {/* Image Preview or Upload Icon */}
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt='Profile Preview'
                                        className='w-full h-full object-cover rounded-md'
                                    />
                                ) : (
                                    <>
                                        <CloudArrowUpIcon className='w-8 h-8 text-gray-400' />
                                        <span className='text-sm text-gray-500 text-center'>
                                            <span className='text-[#BEE36E] font-medium'>Upload image</span> or drag and drop
                                        </span>
                                    </>
                                )}

                                {/* Hidden File Input */}
                                <input
                                    type='file'
                                    id='profilePicture'
                                    className='hidden'
                                    accept='image/*' // Accept only image files
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>

                        {/* Form Fields */}
                        <div className='w-full md:w-2/3 flex flex-col gap-4'>
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className='text-sm text-gray-500'>Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                                />
                            </div>

                            {/* Gender, Date of Birth, and Nationality Fields */}
                            <div className='flex flex-col md:flex-row gap-4'>
                                {/* Gender Field */}
                                <div className='w-full md:w-1/3'>
                                    <label htmlFor="gender" className='text-sm text-gray-500'>Gender</label>
                                    <select
                                        name="gender"
                                        id="gender"
                                        className='w-full p-2 bg-white rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                {/* Date of Birth Field */}
                                <div className='w-full md:w-1/3'>
                                    <label htmlFor="dateOfBirth" className='text-sm text-gray-500'>Date of Birth</label>
                                    <input
                                        type='date'
                                        id='dateOfBirth'
                                        className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                                    />
                                </div>

                                {/* Nationality Field */}
                                <div className='w-full md:w-1/3'>
                                    <label htmlFor="nationality" className='text-sm text-gray-500'>Nationality</label>
                                    <input
                                        type="text"
                                        id="nationality"
                                        className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organization Information Section */}
                <div className='flex flex-col gap-4 w-full'>
                    <h1 className='text-lg font-semibold'>Organization Information</h1>
                    <div className='flex items-center flex-col md:flex-row gap-4 w-full'>
                        <div className='w-full md:w-1/2'>
                            <label htmlFor="organizationName" className='text-sm text-gray-500'>Organization Name</label>
                            <input
                                type="text"
                                id="organizationName"
                                className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                            />
                        </div>

                        <div className='w-full md:w-1/2'>
                            <label htmlFor="phoneNumber" className='text-sm text-gray-500'>Phone Number</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <label htmlFor='email' className='text-sm text-gray-500'>Email</label>
                        <input
                            type='email'
                            id='email'
                            className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                        />
                    </div>

                    <div className='flex flex-col md:flex-row gap-4 w-full'>
                        <div className='w-full md:w-1/3'>
                            <label htmlFor='organizationAddress' className='text-sm text-gray-500'>Organization Address</label>
                            <input
                                type='text'
                                id='organizationAddress'
                                className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                            />
                        </div>

                        <div className='w-full md:w-1/3'>
                            <label htmlFor="city" className='text-sm text-gray-500'>City</label>
                            <input
                                type='text'
                                id='city'
                                className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                            />
                        </div>

                        <div className='w-full md:w-1/3'>
                            <label htmlFor='country' className='text-sm text-gray-500'>Country</label>
                            <input
                                type='text'
                                id='country'
                                className='w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]'
                            />
                        </div>
                    </div>
                </div>

                {/* Save and Discard Buttons */}
                <div className='flex items-center w-full gap-4'>
                    <button className='bg-[#BEE36E] hover:bg-[#BEE36E]/80 transition-colors text-black px-4 py-2 rounded-full'>
                        Save Changes
                    </button>
                    <button
                        className='text-[#BEE36E] border border-[#BEE36E] hover:bg-[#BEE36E] hover:text-black transition-colors px-4 py-2 rounded-full'
                        onClick={() => window.history.back()}
                    >
                        Discard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;