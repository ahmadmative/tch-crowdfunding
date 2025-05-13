import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../config/url';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface SupportTicket {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  existingProject: boolean;
  department: string;
  subject: string;
  query: string;
  image?: string | null;
  file?: string | null;
  __v: number;
}

const SupportMails = () => {
    const [data, setData] = useState<SupportTicket[]>([]);
    const [filteredData, setFilteredData] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/support`);
            setData(res.data);
            setFilteredData(res.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(ticket => {
            const searchLower = searchTerm.toLowerCase();
            return (
                ticket.firstName.toLowerCase().includes(searchLower) ||
                ticket.lastName.toLowerCase().includes(searchLower) ||
                ticket.email.toLowerCase().includes(searchLower) ||
                ticket.subject.toLowerCase().includes(searchLower) ||
                ticket.department.toLowerCase().includes(searchLower)
            );
        });
        setFilteredData(filtered);
    }, [searchTerm, data]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Support Tickets</h1>
            
            {/* Search and Filter Section */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filter by name, email, subject or department..."
                        className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Existing Project</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {ticket.firstName} {ticket.lastName}
                                                    </div>
                                                    {/* <div className="text-sm text-gray-500">
                                                        {ticket.phone}
                                                    </div> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ticket.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${ticket.department === 'technical' ? 'bg-blue-100 text-blue-800' : 
                                                  ticket.department === 'billing' ? 'bg-green-100 text-green-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {ticket.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ticket.subject}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${ticket.existingProject ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {ticket.existingProject ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link 
                                                to={`/support/${ticket._id}`} 
                                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                            >
                                               View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No tickets found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SupportMails;