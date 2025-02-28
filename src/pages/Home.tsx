import React from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';

const Home: React.FC = () => {
  return <div className='max-w-[1200px] mx-auto p-4'>
    <Navbar />
    <HeroSection />
  </div>;
};

export default Home;
