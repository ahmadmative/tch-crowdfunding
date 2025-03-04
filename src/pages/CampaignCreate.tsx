import React, { useState, ChangeEvent } from 'react';
import Notification from '../components/notification/Notification';

interface CampaignFormData {
  image: File | null;
  title: string;
  moneyTarget: string;
  category: string;
  event: string;
  story: string;
  challenge: string;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  postalCode: string;
  campaignVideoLinks: string;
  socialMediaLinks: string;
  donorCommunication: string;
}

const CreateCampaignForm: React.FC = () => {
  const [formData, setFormData] = useState<CampaignFormData>({
    image: null,
    title: '',
    moneyTarget: '',
    category: '',
    event: '',
    story: '',
    challenge: '',
    startDate: '',
    endDate: '',
    address: '',
    city: '',
    postalCode: '',
    campaignVideoLinks: '',
    socialMediaLinks: '',
    donorCommunication: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSuccess(true);
    // Add your form submission logic here
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-[100px] ">
            {isSuccess && <Notification isOpen={isSuccess} onClose={() => setIsSuccess(false)} title="Campaign created successfully" message="Campaign created successfully" />}
        <div className='flex flex-col items-center border-2 border-gray-300 rounded-[40px] p-4 font-onest shadow-md'>
        <h1 className="text-2xl font-semibold mb-6">Create New Campaign</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
        <div className='flex flex-col w-full'>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                />
                <label htmlFor="imageUpload" className="cursor-pointer flex gap-2 justify-center items-center">
                    <img src="/cloud-computing.png" alt="Upload" className='w-6 h-6' />
                    <span className="text-gray-500">Upload Image</span>
                </label>
            </div>

        </div>
        

        {/* Title and Money Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Money Target</label>
            <input
              type="text"
              name="moneyTarget"
              placeholder="R1 50000"
              value={formData.moneyTarget}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Category and Event */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose Category</label>
            <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 cursor-pointer rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            >
            <option value="">Select category</option>
            <option value="animals">Animals</option>
            {/* Add more categories as needed */}
            </select>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Events</label>
            <select
              name="event"
              value={formData.event}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 cursor-pointer rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            >
              <option value="">Select event</option>
              <option value="event1">Event 1</option>
              {/* Add more events as needed */}
            </select>
          </div>
        </div>

        {/* Campaign Story */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Story</label>
          <textarea
            name="story"
            placeholder="Add Story"
            value={formData.story}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>

        {/* Campaign Story */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Challenge & Goal</label>
          <textarea
            name="challenge"
            placeholder="Add Challenge & Goal"
            value={formData.challenge}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Add Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="Johannesburg"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              placeholder="57986"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Video Links</label>
            <input
              type="url"
              name="campaignVideoLinks"
              placeholder="Link"
              value={formData.campaignVideoLinks}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Media Links</label>
            <input
              type="url"
              name="socialMediaLinks"
              placeholder="Link"
              value={formData.socialMediaLinks}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
            />
          </div>
        </div>

        {/* Donor Communication */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Donor Communication</label>
          <textarea
            name="donorCommunication"
            placeholder="Add Note"
            value={formData.donorCommunication}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[#BEE36E] text-black rounded-full hover:bg-[#a8cc5c] transition-colors duration-200"
          >
            Create Campaign
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 text-[#BEE36E] border border-[#BEE36E] rounded-full hover:text-gray-800 transition-colors duration-200"
          >
            Discard
          </button>
        </div>
      </form>

        </div>
      
    </div>
  );
};

export default CreateCampaignForm;