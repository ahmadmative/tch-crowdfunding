import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import axios from 'axios';
import upload from '../../utils/upload';
import { toast } from 'react-toastify';

const GuideCategoryModal = ({ onClose, onSuccess, initialData }: any) => {
  const [name, setName] = useState(initialData?.name || '');
  const [file, setFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let iconUrl = initialData?.icon;

      if (file) {
        iconUrl = await upload(file);
      }

      const payload = {
        name,
        icon: iconUrl,
        isActive,
      };

      if (initialData?._id) {
        await axios.put(`${BASE_URL}/guide-category/${initialData._id}`, payload);
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${BASE_URL}/guide-category`, payload);
        toast.success('Category added successfully');
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            {initialData?.icon && !file && (
              <img src={initialData.icon} alt="icon" className="w-12 h-12 mt-2" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              id="status"
              className="form-checkbox"
            />
            <label htmlFor="status">Active</label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gray-900 text-white hover:scale-105 transition-transform duration-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideCategoryModal;
