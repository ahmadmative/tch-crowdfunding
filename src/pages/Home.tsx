import React from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import CollaborationSection from '../components/home/CollaborationSection';
import AboutUsSection from '../components/home/AboutUsSection';
import CampaignsSection from '../components/home/CampaignsSection';
import OurFeatureSection from '../components/home/OurFeatureSection';
import ChooseUsSection from '../components/home/ChooseUsSection';
import Testimonials from '../components/home/Testimonials';
import Footer from '../components/home/Footer';


const Home: React.FC = () => {
  return <div className=''>
    <Navbar />
    <HeroSection />
    <CollaborationSection />
    <AboutUsSection />
    <CampaignsSection />
    <ChooseUsSection />
    <OurFeatureSection />
    <Testimonials />
    <Footer />
  </div>;
};

export default Home;
