import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="max-w-[1200px] w-full mx-auto p-4 max-h-[800px] flex flex-col md:flex-row justify-between items-center mt-[77px]">
      {/* Rest of the hero section content stays the same */}
      <div className="w-full h-full rounded-lg relative">
        <img
          src={"/hero-image.png"}
          alt="hero-image"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full rounded-lg">
          <img
            src={"/hero-upper.png"}
            alt="hero-image"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 w-[90%] flex flex-col justify-end">
            <div className="flex flex-col gap-2 text-white mb-4 w-full">
              <div className="flex text-white w-full">
                <p className="text-2xl md:text-4xl font-bold">Make.</p>
              </div>
              <div className="flex flex-col md:flex-row justify-between text-white mb-4 w-full">
                <div className="flex items-center">
                  <p className="text-5xl md:text-7xl font-bold text-[#BEE36E] tracking-wide leading-tight">
                    Change
                  </p>
                  <div className="flex flex-col text-white text-xl md:text-2xl font-bold ml-2">
                    <p>With</p>
                    <p>Donations!</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-auto">
                  <button className="bg-[#BEE36E] text-black px-4 py-2 md:px-6 md:py-3 rounded-full text-lg font-bold w-full sm:w-[210px] h-[50px] shadow-md hover:bg-[#BEE36E]/80 transition-all duration-300">
                    Donate Now!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default HeroSection;