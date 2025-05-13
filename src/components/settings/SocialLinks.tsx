import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import SocialForm from './SocialForm';

interface SocialLink {
  _id: string;
  name: string;
  icon: string;
  link: string;
}

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<SocialLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSocialLinks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/social`);
      setSocialLinks(res.data);
    } catch (error) {
      toast.error('Failed to fetch social links');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleSubmit = async (data: SocialLink) => {
    try {
      if (currentLink) {
        // Update existing link
        await axios.put(`${BASE_URL}/social/${currentLink._id}`, data);
        toast.success('Social link updated successfully');
      } else {
        // Create new link
        await axios.post(`${BASE_URL}/social`, data);
        toast.success('Social link added successfully');
      }
      fetchSocialLinks();
      setIsFormOpen(false);
    } catch (error) {
      toast.error(`Failed to ${currentLink ? 'update' : 'add'} social link`);
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`${BASE_URL}/social/${id}`);
      toast.success('Social link deleted successfully');
      fetchSocialLinks();
    } catch (error) {
      toast.error('Failed to delete social link');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditForm = (link: SocialLink) => {
    setCurrentLink(link);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setCurrentLink(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Social Links</h1>
        <button
          onClick={openAddForm}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Social Link
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {socialLinks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No social links added yet</p>
            <button
              onClick={openAddForm}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Your First Social Link
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {socialLinks.map((link) => (
              <li key={link._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {link.icon.startsWith('http') ? (
                      <img src={link.icon} alt={link.name} className="h-8 w-8" />
                    ) : (
                      <i className={`${link.icon} text-xl`} />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{link.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{link.link}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditForm(link)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(link._id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SocialForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={currentLink}
        isLoading={false}
      />
    </div>
  );
};

export default SocialLinks;