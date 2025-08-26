import React, { useEffect, useState, Fragment } from 'react';
import dayjs from 'dayjs';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { BASE_URL } from '../config/url';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface WithdrawalRequest {
  _id: string;
  userId: User;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

const WithDrawRequests = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedRequests, setPaginatedRequests] = useState<WithdrawalRequest[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [filteredRequests, setFilteredRequests] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<WithdrawalRequest[]>(`${BASE_URL}/requests`);
        setRequests(res.data);
        setFilteredRequests(res.data); // Initialize filtered data
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch withdrawal requests');
      } finally {
        setLoading(false);
      }
    };
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

  // Filter logic
  useEffect(() => {
    if (!requests.length) {
      setFilteredRequests([]);
      return;
    }

    let filtered = [...requests];

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(request => request.status === filter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((request) =>
        request.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Amount range filters
    if (minAmount) {
      filtered = filtered.filter((request) =>
        request.amount >= parseFloat(minAmount)
      );
    }

    if (maxAmount) {
      filtered = filtered.filter((request) =>
        request.amount <= parseFloat(maxAmount)
      );
    }

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [requests, filter, searchTerm, minAmount, maxAmount]);

  // Pagination logic
  useEffect(() => {
    if (!filteredRequests.length) {
      setPaginatedRequests([]);
      setTotalPages(0);
      return;
    }

    const total = Math.ceil(filteredRequests.length / itemsPerPage);
    setTotalPages(total);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredRequests.slice(startIndex, endIndex);
    
    setPaginatedRequests(paginated);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const clearFilters = () => {
    setSearchTerm('');
    setMinAmount('');
    setMaxAmount('');
    setFilter('all');
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
        <button 
          onClick={() => setError(null)}
          className="absolute top-0 right-0 px-2 py-1"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Withdrawal Requests</h1>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search User
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter user name..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Min Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Amount (R)
            </label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Amount (R)
            </label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="No limit"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Filter Actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
            {(searchTerm || filter !== 'all' || minAmount || maxAmount) && (
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

      {filteredRequests.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ArrowUpIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">No withdrawal requests found</h2>
          <p className="text-gray-500">When users request withdrawals, they'll appear here</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={request.userId.profilePicture || '/user.png'} 
                          alt={request.userId.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.userId.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R{request.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(request.createdAt).format('DD MMM YYYY')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/requests/${request._id}`}>
                      <Eye className='h-5 w-5 text-gray-500 hover:text-gray-700'/>
                    </Link>
                  </td>
                </tr>
              ))}
              {paginatedRequests.length === 0 && filteredRequests.length > 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No requests found on this page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
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
            Showing {filteredRequests.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length} entries
            {(searchTerm || filter !== 'all' || minAmount || maxAmount) && (
              <span className="text-blue-600"> (filtered from {requests.length} total)</span>
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
        </>
      )}
    </div>
  );
};

export default WithDrawRequests;