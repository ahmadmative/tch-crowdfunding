import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../../config/url';
import axios from 'axios';
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading';
import BankDetailsTable from './BankDetailsTable';

interface BankDetail {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        profilePicture: string;
    };
    bankName: string;
    accountName: string;
    accountNumber: string;
    type: string;
    branch: string;
    branchCode: string;
    status: 'pending' | 'active' | 'approved' | 'rejected';
    createdAt: string;
}

const BankDetailsMain = () => {
    const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'approved' | 'rejected'>('pending');
    const [selectedDetail, setSelectedDetail] = useState<BankDetail | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${BASE_URL}/bank-details/query`);
            setBankDetails(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bank details:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetch();
    }, []);

    const filteredDetails = bankDetails.filter(detail => detail.status === activeTab);

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

    const handleViewDetails = (detail: BankDetail) => {
        setSelectedDetail(detail);
        setShowModal(true);
    };

    const handleStatusUpdate = async (detailId: string, newStatus: 'approved' | 'rejected' | 'active') => {
        try {
            await axios.put(`${BASE_URL}/bank-details/status/${detailId}`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetch(); // Refresh data
            setShowModal(false);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error updating status');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className='py-10 px-4 md:px-8'>
            <div className='relative max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8'>
                <h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
                    Bank Details Management
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
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({bankDetails.filter(d => d.status === tab).length})
                        </button>
                    ))}
                </div>

                {/* Table Component */}
                <BankDetailsTable
                    bankDetails={filteredDetails}
                    onViewDetails={handleViewDetails}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    formatDate={formatDate}
                />
            </div>

            {/* Modal */}
            {showModal && selectedDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Bank Details</h3>
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
                                            <p className="font-medium">{selectedDetail.userId.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Email</label>
                                            <p className="font-medium">{selectedDetail.userId.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">Bank Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Bank Name</label>
                                            <p className="font-medium">{selectedDetail.bankName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Account Name</label>
                                            <p className="font-medium">{selectedDetail.accountName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Account Number</label>
                                            <p className="font-medium">{selectedDetail.accountNumber}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Account Type</label>
                                            <p className="font-medium capitalize">{selectedDetail.type}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Branch</label>
                                            <p className="font-medium">{selectedDetail.branch}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Branch Code</label>
                                            <p className="font-medium">{selectedDetail.branchCode}</p>
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
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDetail.status)}`}>
                                                    {selectedDetail.status} {getStatusIcon(selectedDetail.status)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Submitted On</label>
                                            <p className="font-medium">{formatDate(selectedDetail.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {selectedDetail.status === 'pending' && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedDetail._id, 'approved')}
                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedDetail._id, 'rejected')}
                                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            Cancel
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

export default BankDetailsMain;
