import React from "react";
import { FaEye, FaUser } from 'react-icons/fa';

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

interface BankDetailsTableProps {
    bankDetails: BankDetail[];
    onViewDetails: (detail: BankDetail) => void;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => React.ReactElement | null;
    formatDate: (dateString: string) => string;
}

const BankDetailsTable = ({ 
    bankDetails, 
    onViewDetails, 
    getStatusColor, 
    getStatusIcon, 
    formatDate 
}: BankDetailsTableProps) => {
    if (bankDetails.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No bank details found for this status.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Bank Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Account Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bankDetails.map((detail) => (
                        <tr key={detail._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        {detail.userId.profilePicture ? (
                                            <img 
                                                src={detail.userId.profilePicture} 
                                                alt="Profile" 
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{detail.userId.name}</div>
                                        <div className="text-sm text-gray-500">{detail.userId.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                                {formatDate(detail.createdAt)}
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-900">
                                {detail.bankName}
                            </td>
                            <td className="py-3 px-4 text-gray-600 capitalize">
                                {detail.type}
                            </td>
                            <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detail.status)}`}>
                                    {detail.status} {getStatusIcon(detail.status)}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => onViewDetails(detail)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                >
                                    <FaEye className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default BankDetailsTable;