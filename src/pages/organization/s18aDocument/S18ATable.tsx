import React from 'react';
import { FaEye, FaUser } from 'react-icons/fa';

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

interface S18ATableProps {
    s18ADocuments: S18ADocument[];
    onViewDetails: (document: S18ADocument) => void;
    getStatusColor: (status: string) => string;
    getStatusIcon: (status: string) => any;
    formatDate: (dateString: string) => string;
}

const S18ATable = ({ 
    s18ADocuments, 
    onViewDetails, 
    getStatusColor, 
    getStatusIcon, 
    formatDate 
}: S18ATableProps) => {
    if (s18ADocuments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No S18A documents found for this status.
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Registered</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Trust Number</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {s18ADocuments.map((document) => (
                        <tr key={document._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        {document.userId.profilePicture ? (
                                            <img 
                                                src={document.userId.profilePicture} 
                                                alt="Profile" 
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{document.userId.name}</div>
                                        <div className="text-sm text-gray-500">{document.userId.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                                {formatDate(document.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    document.registered 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {document.registered ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-900">
                                {document.trustNumber}
                            </td>
                            <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                                    {document.status} {getStatusIcon(document.status)}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <button
                                    onClick={() => onViewDetails(document)}
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

export default S18ATable;