import React, { useState } from 'react';
import Notification from '../notification/Notification';

type PaymentMethod = 'Test Donation' | 'Cardiant Donation' | 'Office Donation';

const DonationForm: React.FC<{ id: string }> = ({ id } ) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Test Donation');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<string>('150');
  const [isDonate, setIsDonate] = useState(false);

  const predefinedAmounts = [
    { value: '150', label: 'R150' },
    { value: '170', label: 'R170' },
    { value: '190', label: 'R190' },
    { value: '250', label: 'R250' },
  ];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
  };
  const handleDonate = () => {
    console.log('Donate');
    setIsDonate(true);
  };

  return (
    <div className="w-full mx-auto p-1">
        {isDonate && <Notification isOpen={isDonate} onClose={() => setIsDonate(false)} title="Donation successful" message="Donation successful" />}
      {/* Payment Method Selection */}
      <div className="font-onest bg-white w-full rounded-lg border border-gray-300 p-4 shadow-sm mb-8 flex md:flex-row flex-col items-center justify-between">

        <div className='flex flex-col  items-center gap-2'>
            <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
            <div className="md:col-span-1">
            <input
              type="number"
              placeholder="Enter Your Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>
        {/* <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2> */}


        <div className='flex flex-col items-center gap-2'>
        <div className="flex  md:flex-row gap-4 mb-6">
          {['Test Donation', 'Cardiant Donation', 'Office Donation'].map((method) => (
            <label 
              key={method}
              className="flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={selectedMethod === method}
                onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                className="form-radio h-4 w-4 accent-[#BEE36E] border-gray-300 "
              />
              <span className="ml-2 text-gray-700">{method}</span>
            </label>
          ))}
        </div>

        {/* Amount Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          
          
          {predefinedAmounts.map((amount) => (
            <button
              key={amount.value}
              onClick={() => handleAmountSelect(amount.value)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                selectedAmount === amount.value
                ? 'bg-[#BEE36E] text-black'
                : 'bg-white border border-[#BEE36E] text-black hover:bg-[#BEE36E]/10'
              }`}
            >
              {amount.label}
            </button>
          ))}
        </div>
        </div>
        
        
      </div>

      {/* Details Form */}

      <h2 className="text-xl font-semibold mb-4">Details</h2>
      
      <div className="bg-white rounded-lg p-4 border border-gray-300 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Alex Jordan*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Name@Example.Com*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Company Name*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>
      </div>

      {/* Address Form */}
      <h2 className="text-xl font-semibold mb-4 mt-8">Address</h2>

      <div className='rounded-lg p-4 border border-gray-300 shadow-sm'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Postcode*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
          <input
            type="text"
            placeholder="City*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="House No*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>
      </div>


      <div className="flex items-center gap-2 mt-8 mb-4">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 accent-[#BEE36E] text-white cursor-pointer"
        />
        <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
          I agree to the Terms of Service
        </label>
      </div>


      <div className='flex items-center gap-4'>
      <button onClick={handleDonate}
          className="bg-[#BEE36E] text-black py-3 px-6 mt-4 rounded-full font-xs hover:bg-[#a8cc5c] transition-colors duration-200"
        >
          DONATE NOW
        </button>

        <div 
          className=" text-black py-3 px-6 mt-4 rounded-full font-medium border border-gray-300"
        >
          Total Amount: R150
        </div>

      </div>

      

    </div>
  );
};

export default DonationForm;