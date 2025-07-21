import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config/url';
import Loading from './Loading';
import dayjs from 'dayjs';
import { ArrowUpIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from 'lucide-react';

const WithDrawRequestsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/requests/${id}`);
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      toast.error("Error fetching withdrawal request details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    if (!data?.withDrawRequest) return;
    
    try {
      setUpdatingStatus(true);
      
      if (status === 'approved') {
        await axios.post(`${BASE_URL}/account/withdraw/${data.withDrawRequest.userId}`, {
          amount: data.withDrawRequest.amount,
        });
      }
      
      await axios.patch(`${BASE_URL}/requests/${id}`, { status });
      
      // Update local state
      setData((prev: any) => ({
        ...prev,
        withDrawRequest: {
          ...prev.withDrawRequest,
          status
        }
      }));
      
      toast.success(`Request ${status} successfully!`);
      
      // Refresh data to get updated information
      await fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };
  

  if (loading) return <Loading />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = data?.allTransactions?.filter((req: any) => 
    filter === 'all' || req.status === filter
  ) || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <ArrowLeftIcon onClick={()=>window.history.back()} className='h-5 w-5 text-gray-500 cursor-pointer'/>
        <h1 className="text-2xl font-bold">Withdrawal Request Details</h1>
        <p className="text-sm text-gray-500">
          View the details of the withdrawal request
        </p>
      </div>

      {/* Withdrawal Request Info */}
      {data?.withDrawRequest && (
        <div className="p-4 border rounded-lg bg-white shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-medium">{data.withDrawRequest.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium text-lg text-green-600">R{data.withDrawRequest.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(data.withDrawRequest.status)}`}>
                {data.withDrawRequest.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{dayjs(data.withDrawRequest.createdAt).format('DD MMM YYYY')}</p>
            </div>
          </div>
          
          {/* Action Buttons for Pending Requests */}
          {data.withDrawRequest.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => handleStatusUpdate('approved')}
                disabled={updatingStatus}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckIcon className="h-4 w-4" />
                {updatingStatus ? 'Approving...' : 'Approve Request'}
              </button>
              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updatingStatus}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <XMarkIcon className="h-4 w-4" />
                {updatingStatus ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Dropdown */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* All Transactions Table */}
      {filteredRequests.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ArrowUpIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            No transactions found
          </h2>
          <p className="text-gray-500">
            When users make transactions, they'll appear here
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request: any) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={request.donorId?.profilePicture || '/user.png'}
                      alt={request.donorId?.name}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {request.donorId?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R{request.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(request.date).format('DD MMM YYYY')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WithDrawRequestsDetail;
