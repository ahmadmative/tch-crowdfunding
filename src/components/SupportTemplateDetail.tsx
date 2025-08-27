import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TemplateData {
    _id?: string;
    subject: string;
    message: string;
}

const SupportTemplateDetail = () => {
    const [data, setData] = useState<TemplateData>({
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const navigate = useNavigate();
    const { id, mode } = useParams<{ id?: string; mode?: string }>();

    const isEdit = mode === 'edit' && id;
    const isView = mode === 'view' && id;
    const isCreate = mode === 'new';

    // React Quill modules configuration
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image'],
            ['blockquote', 'code-block']
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'color', 'background',
        'align', 'script', 'direction'
    ];

    const fetchTemplate = async () => {
        if (!id) return;
        
        setFetching(true);
        try {
            const response = await axios.get(`${BASE_URL}/support-mail-template/get`);
            const template = response.data.find((t: TemplateData) => t._id === id);
            
            if (template) {
                setData(template);
            } else {
                toast.error('Template not found');
                navigate('/support/templates');
            }
        } catch (error) {
            console.error('Failed to fetch template:', error);
            toast.error('Failed to fetch template');
            navigate('/support/templates');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.subject.trim() || !data.message.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await axios.put(`${BASE_URL}/support-mail-template/update/${id}`, {
                    subject: data.subject,
                    message: data.message
                });
                toast.success('Template updated successfully');
            } else {
                await axios.post(`${BASE_URL}/support-mail-template/create`, {
                    subject: data.subject,
                    message: data.message
                });
                toast.success('Template created successfully');
            }
            navigate('/support/templates');
        } catch (error) {
            console.error('Failed to save template:', error);
            toast.error('Failed to save template');
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, subject: e.target.value }));
    };

    const handleMessageChange = (content: string) => {
        setData(prev => ({ ...prev, message: content }));
    };

    useEffect(() => {
        if (isEdit || isView) {
            fetchTemplate();
        }
    }, [id, mode]);

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const getPageTitle = () => {
        if (isView) return 'View Template';
        if (isEdit) return 'Edit Template';
        return 'Create Template';
    };

    const getPageDescription = () => {
        if (isView) return 'Template details and preview';
        if (isEdit) return 'Edit your email template';
        return 'Create a new email template for support responses';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/support/templates')}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to Templates
                </button>
                
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
                        <p className="text-gray-600">{getPageDescription()}</p>
                    </div>
                    
                    {isView && (
                        <button
                            onClick={() => navigate(`/support/template/edit/${id}`)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Edit Template
                        </button>
                    )}
                </div>
            </div>

            {/* Template Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Subject Field */}
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Subject *
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={data.subject}
                            onChange={handleSubjectChange}
                            readOnly={isView ? true : false}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                isView ? 'bg-gray-50 cursor-not-allowed' : ''
                            }`}
                            placeholder="Enter email subject..."
                            required
                        />
                    </div>

                    {/* Message Field */}
        <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Message *
                        </label>
                        {isView ? (
                            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[300px]">
                                <div 
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: data.message }}
                                />
                            </div>
                        ) : (
                            <ReactQuill
                                theme="snow"
                                value={data.message}
                                onChange={handleMessageChange}
                                modules={modules}
                                formats={formats}
                                placeholder="Compose your email message..."
                                style={{ height: '300px', marginBottom: '50px' }}
                            />
                        )}
                    </div>

                    {/* Form Actions */}
                    {!isView && (
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/support/templates')}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XMarkIcon className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        {isEdit ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="w-4 h-4 mr-2" />
                                        {isEdit ? 'Update Template' : 'Create Template'}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            {/* Template Variables Helper */}
            {/* {!isView && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Template Variables</h3>
                    <p className="text-sm text-blue-700 mb-3">
                        You can use the following variables in your template that will be replaced when sending emails:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="text-blue-600"><code>{'{{firstName}}'}</code> - User's first name</div>
                        <div className="text-blue-600"><code>{'{{lastName}}'}</code> - User's last name</div>
                        <div className="text-blue-600"><code>{'{{email}}'}</code> - User's email address</div>
                        <div className="text-blue-600"><code>{'{{subject}}'}</code> - Original ticket subject</div>
                        <div className="text-blue-600"><code>{'{{ticketId}}'}</code> - Support ticket ID</div>
                        <div className="text-blue-600"><code>{'{{date}}'}</code> - Current date</div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default SupportTemplateDetail;