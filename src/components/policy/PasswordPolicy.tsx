import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import axios from 'axios';

interface PasswordPolicyData {
  minimumLength: boolean;
  upperCase: boolean;
  number: boolean;
  specialCharacter: boolean;
}

const PasswordPolicy = () => {
  const [data, setData] = useState<PasswordPolicyData>({
    minimumLength: false,
    upperCase: false,
    number: false,
    specialCharacter: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/password-policy`);
      setData(response.data);
    } catch (error) {
      toast.error('Error fetching password policy');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.put(`${BASE_URL}/password-policy`, data);
      toast.success('Password policy updated successfully');
      // Optionally refetch the policy to confirm update
      await fetchPolicy();
    } catch (error) {
      toast.error('Error updating password policy');
      console.error('Update error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h2 className="text-xl font-semibold mb-6">Authentication Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg mb-3">Password Policy</h3>
            <div className="space-y-3 pl-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="minimumLength"
                  name="minimumLength"
                  className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  checked={data.minimumLength}
                  onChange={handleChange}
                />
                <label htmlFor="minimumLength" className="text-sm font-medium text-gray-700">
                  Minimum 8 characters
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="upperCase"
                  name="upperCase"
                  className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  checked={data.upperCase}
                  onChange={handleChange}
                />
                <label htmlFor="upperCase" className="text-sm font-medium text-gray-700">
                  Require uppercase letters
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="number"
                  name="number"
                  className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  checked={data.number}
                  onChange={handleChange}
                />
                <label htmlFor="number" className="text-sm font-medium text-gray-700">
                  Require numbers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="specialCharacter"
                  name="specialCharacter"
                  className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  checked={data.specialCharacter}
                  onChange={handleChange}
                />
                <label htmlFor="specialCharacter" className="text-sm font-medium text-gray-700">
                  Require special characters
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex ">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordPolicy;