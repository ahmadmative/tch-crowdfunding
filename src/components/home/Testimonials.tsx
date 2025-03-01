import React from "react";
import TestimonialCarousel from "./testimonial/TestimonialCarousel";

const Testimonials: React.FC = () => {
    return <div className="bg-[#F8F8F8] w-full py-16 flex items-center justify-between">

        <div className="max-w-[1200px] mx-auto p-4 flex items-center justify-between">
            {/* image section */}
        <div className="w-full h-full flex items-center justify-center">
            <img src="/testimonial.png" alt="testimonials"  className="max-w-[500px] max-h-[500px] rounded-[20px]" />
        </div>

        {/* text section */}
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center gap-2 w-full">
                <img src="/home-header.png" alt="home-header" className="w-[20px] h-[15px]" />
                <p className="text-sm font-bold">Testimonials</p>   
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
                    What People Say About
            </h2>

            <div>
                <TestimonialCarousel />
            </div>
            
        </div>
        </div>

        
    </div>;
};

export default Testimonials;
