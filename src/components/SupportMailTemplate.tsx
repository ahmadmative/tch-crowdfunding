import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config/url';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface MailTemplate {
  _id: string;
  subject: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
}

const SupportMailTemplate = () => {
    const [data, setData] = useState<MailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTemplates = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/support-mail-template/get`);
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
            toast.error('Failed to fetch mail templates');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this template?')) {
            return;
        }

        try {
            await axios.delete(`${BASE_URL}/support-mail-template/delete/${id}`);
            toast.success('Template deleted successfully');
            setData(prevData => prevData.filter(template => template._id !== id));
        } catch (error) {
            console.error('Failed to delete template:', error);
            toast.error('Failed to delete template');
        }
    };

    const stripHtml = (html: string) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Mail Templates</h1>
                        <p className="text-gray-600">Manage email templates for support responses</p>
                    </div>
                    <button
                        onClick={() => navigate('/support/template/new')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create Template
                    </button>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {data.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No mail templates found</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first email template.</p>
                        <button
                            onClick={() => navigate('/support/template/new')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create Your First Template
                        </button>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message Preview
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((template) => (
                                        <tr key={template._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {template.subject}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {stripHtml(template.message)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {template.createdAt 
                                                    ? new Date(template.createdAt).toLocaleDateString()
                                                    : 'N/A'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/support/template/view/${template._id}`)}
                                                        className="inline-flex items-center p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                                                        title="View template"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/support/template/edit/${template._id}`)}
                                                        className="inline-flex items-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                                        title="Edit template"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(template._id)}
                                                        className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                                        title="Delete template"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportMailTemplate;