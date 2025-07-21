import React, { useEffect, useState } from 'react'
import Loading from '../../../components/Loading';
import { BASE_URL } from '../../../config/url';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaUser } from 'react-icons/fa';
import S18ATable from './S18ATable';

interface S18ADocument {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        profilePicture: string;
    };
    registered: boolean;
    reference: string;
    trustNumber: string;
    pbo: string;
    npo: string;
    signature: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

const S18ADocumentMain = () => {
    const [s18ADocuments, setS18ADocuments] = useState<S18ADocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [selectedDocument, setSelectedDocument] = useState<S18ADocument | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/s18a/all`);
            setS18ADocuments(res.data);
        } catch (error) {
            console.error('Error fetching S18A documents:', error);
            toast.error("Error fetching S18A documents");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetch();
    }, []);

    const filteredDocuments = s18ADocuments.filter(doc => doc.status === activeTab);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <FaCheckCircle className="inline-block ml-1" />;
            case 'rejected':
                return <FaTimesCircle className="inline-block ml-1" />;
            case 'pending':
                return <FaClock className="inline-block ml-1" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewDetails = (document: S18ADocument) => {
        setSelectedDocument(document);
        setShowModal(true);
    };

    const handleStatusUpdate = async (documentId: string, newStatus: 'approved' | 'rejected') => {
        try {
            setIsSubmitting(true);
            await axios.put(`${BASE_URL}/s18a/status/${documentId}`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetch(); // Refresh data
            setShowModal(false);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error updating status');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loading />

    return (
        <div className='py-10 px-4 md:px-8'>
            <div className='relative max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8'>
                <h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
                    S18A Document Management
                </h2>

                {/* Tabs */}
                <div className="flex border-b mb-4">
                    {['pending', 'approved', 'rejected'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 font-medium ml-4 ${
                                activeTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                    : 'text-gray-600'
                            }`}
                            onClick={() => setActiveTab(tab as any)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({s18ADocuments.filter(d => d.status === tab).length})
                        </button>
                    ))}
                </div>

                {/* Table Component */}
                <S18ATable 
                    s18ADocuments={filteredDocuments}
                    onViewDetails={handleViewDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    formatDate={formatDate}
                />
            </div>

            {/* Modal */}
            {showModal && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">S18A Document Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* User Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">User Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Name</label>
                                            <p className="font-medium">{selectedDocument.userId.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Email</label>
                                            <p className="font-medium">{selectedDocument.userId.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* S18A Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">S18A Registration Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Registered</label>
                                            <p className="font-medium">{selectedDocument.registered ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Reference</label>
                                            <p className="font-medium">{selectedDocument.reference || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Trust Number</label>
                                            <p className="font-medium">{selectedDocument.trustNumber}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">PBO</label>
                                            <p className="font-medium">{selectedDocument.pbo || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">NPO</label>
                                            <p className="font-medium">{selectedDocument.npo || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Signature</label>
                                            <p className="font-medium">{selectedDocument.signature ? 'Uploaded' : 'Not uploaded'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">Status Information</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm text-gray-600">Current Status</label>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDocument.status)}`}>
                                                    {selectedDocument.status} {getStatusIcon(selectedDocument.status)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Submitted On</label>
                                            <p className="font-medium">{formatDate(selectedDocument.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {selectedDocument.status === 'pending' || selectedDocument.status === 'rejected' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedDocument._id, 'approved')}
                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                        >
                                            {isSubmitting ? "loading..." : "Approve"}
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedDocument._id, 'rejected')}
                                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                        >
                                            {isSubmitting ? "loading..." : "Reject"}
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            {isSubmitting ? "loading..." : "Cancel"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default S18ADocumentMain;


