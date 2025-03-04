import React, { useState } from 'react';

const OtpCard: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));

  // Handle input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits (0-9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 font-onest">
      <div className="w-full max-w-md bg-white p-6 rounded-xxxl shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img src="/footer-logo.png" alt="logo" className="w-[180px] h-[40px]" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
          <p className="text-gray-500 mt-2">Enter the verification code sent to your email:</p>
          <p className="text-[#BEE36E] font-semibold">example@gmail.com</p>
        </div>

        {/* OTP Inputs */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className={`w-full h-12 text-center text-lg font-semibold border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                value
                  ? 'border-[#BEE36E] focus:ring-[#BEE36E]'
                  : 'border-gray-300 focus:ring-[#BEE36E]'
              }`}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-lg shadow-md text-sm font-medium text-black outline-none bg-[#BEE36E] hover:bg-[#a8cc5c] transition-all duration-300"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpCard;
