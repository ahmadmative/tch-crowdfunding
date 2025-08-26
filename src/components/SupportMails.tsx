import axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
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
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [paginatedTickets, setPaginatedTickets] = useState<SupportTicket[]>([]);
    
    // Additional filter states
    const [departmentFilter, setDepartmentFilter] = useState<string>('');
    const [projectFilter, setProjectFilter] = useState<string>('');

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

    // Pagination helper functions
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    // Enhanced filter logic
    useEffect(() => {
        if (!data.length) {
            setFilteredData([]);
            return;
        }

        const filtered = data.filter(ticket => {
            const searchLower = searchTerm.toLowerCase();
            
            // Search filter
            const matchesSearch = !searchTerm || (
                ticket.firstName.toLowerCase().includes(searchLower) ||
                ticket.lastName.toLowerCase().includes(searchLower) ||
                ticket.email.toLowerCase().includes(searchLower) ||
                ticket.subject.toLowerCase().includes(searchLower) ||
                ticket.department.toLowerCase().includes(searchLower)
            );

            // Department filter
            const matchesDepartment = !departmentFilter || ticket.department === departmentFilter;

            // Project filter
            const matchesProject = !projectFilter || (
                (projectFilter === 'existing' && ticket.existingProject) ||
                (projectFilter === 'new' && !ticket.existingProject)
            );

            return matchesSearch && matchesDepartment && matchesProject;
        });

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, departmentFilter, projectFilter, data]);

    // Pagination logic
    useEffect(() => {
        if (!filteredData.length) {
            setPaginatedTickets([]);
            setTotalPages(0);
            return;
        }

        const total = Math.ceil(filteredData.length / itemsPerPage);
        setTotalPages(total);

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredData.slice(startIndex, endIndex);
        
        setPaginatedTickets(paginated);
    }, [filteredData, currentPage, itemsPerPage]);

    const clearFilters = () => {
        setSearchTerm('');
        setDepartmentFilter('');
        setProjectFilter('');
        setCurrentPage(1);
    };

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
            
            {/* Enhanced Filter Controls */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Tickets
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Name, email, subject, department..."
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

                    {/* Department Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Departments</option>
                            <option value="technical">Technical</option>
                            <option value="billing">Billing</option>
                            <option value="general">General</option>
                            <option value="support">Support</option>
                        </select>
                    </div>

                    {/* Project Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Status
                        </label>
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Projects</option>
                            <option value="existing">Existing Project</option>
                            <option value="new">New Project</option>
                        </select>
                    </div>
                </div>
                
                {/* Filter Actions */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                        Showing {filteredData.length} of {data.length} tickets
                        {(searchTerm || departmentFilter || projectFilter) && (
                            <span className="ml-2 text-blue-600">(filtered)</span>
                        )}
                    </div>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Clear Filters
                    </button>
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
                            {paginatedTickets.length > 0 ? (
                                paginatedTickets.map((ticket) => (
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
                                        {filteredData.length === 0 ? 'No tickets found matching your criteria' : 'No tickets found on this page'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 px-6 pb-6">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-700">entries</span>
                    </div>

                    {/* Pagination info */}
                    <div className="text-sm text-gray-700">
                        Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                        {(searchTerm || departmentFilter || projectFilter) && (
                            <span className="text-blue-600"> (filtered from {data.length} total)</span>
                        )}
                    </div>

                    {/* Pagination buttons */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                First
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {/* Page numbers */}
                            {getPageNumbers().map((pageNum, index, array) => (
                                <Fragment key={pageNum}>
                                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                                        <span className="px-2 text-gray-500">...</span>
                                    )}
                                    <button
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 text-sm border rounded transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-blue-500 border-blue-500 text-white'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                    {index < array.length - 1 && array[index + 1] !== pageNum + 1 && pageNum !== totalPages && (
                                        <span className="px-2 text-gray-500">...</span>
                                    )}
                                </Fragment>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportMails;