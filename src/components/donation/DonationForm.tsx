import React from 'react';

const DonationForm: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div className='flex flex-col gap-2'>
        <p className='text-sm font-bold text-black'>Donate Now</p>

    </div>
  );
};

export default DonationForm;
