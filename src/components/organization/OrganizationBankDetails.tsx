import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import MailModal from './MailModal';

interface BankDetail {
  _id: string;
  userId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  type: string;
  branch: string;
  branchCode: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  createdAt: string;
}

interface OrganizationBankDetailsProps {
  userId: string;
}

const OrganizationBankDetails: React.FC<OrganizationBankDetailsProps> = ({ userId }) => {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [orgData, setOrgData] = useState<any>({});

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/bank-details/query`, { userId });
      setBankDetails(res.data);
    } catch (error) {
      toast.error('Error fetching bank details');
      console.error('Error fetching bank details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBankDetails();
    }
  }, [userId]);

  const handleStatusUpdate = async (detailId: string, newStatus: 'approved' | 'rejected' | 'active', issues?: string) => {
    try {
      setUpdatingId(detailId);
      await axios.put(`${BASE_URL}/bank-details/status/${detailId}`, { status: newStatus });
      
      if (issues && newStatus === 'rejected') {
        await axios.post(`${BASE_URL}/issue-report`, {
          receiverId: userId,
          type: 'bankDetails',
          issue: issues
        });
      }
      
      toast.success(`Status updated to ${newStatus}`);
      fetchBankDetails(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRejectClick = (detailId: string) => {
    setSelectedBankId(detailId);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
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
      case 'active':
        return <CheckCircle className="inline-block ml-1 w-4 h-4" />;
      case 'rejected':
        return <XCircle className="inline-block ml-1 w-4 h-4" />;
      case 'pending':
        return <Clock className="inline-block ml-1 w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (bankDetails.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No bank details found for this organization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
      {bankDetails.map((bank: BankDetail) => (
        <div key={bank._id} className="border rounded-lg p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-gray-600">Bank Name</h5>
                <p className="text-gray-900">{bank.bankName}</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-600">Account Name</h5>
                <p className="text-gray-900">{bank.accountName}</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-600">Account Number</h5>
                <p className="text-gray-900">{bank.accountNumber}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-gray-600">Account Type</h5>
                <p className="text-gray-900 capitalize">{bank.type}</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-600">Branch</h5>
                <p className="text-gray-900">{bank.branch}</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-600">Branch Code</h5>
                <p className="text-gray-900">{bank.branchCode}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h5 className="font-semibold text-gray-600">Status</h5>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bank.status)}`}>
                    {bank.status?.toUpperCase()}
                    {getStatusIcon(bank.status)}
                  </span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-600">Created</h5>
                  <p className="text-sm text-gray-500">{dayjs(bank.createdAt).format('DD-MM-YYYY HH:mm')}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(bank._id, 'approved')}
                  disabled={updatingId === bank._id || bank.status === 'approved'}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    bank.status === 'approved'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                  }`}
                >
                  {updatingId === bank._id ? 'Updating...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleRejectClick(bank._id)}
                  disabled={updatingId === bank._id || bank.status === 'rejected'}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    bank.status === 'rejected'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
                  }`}
                >
                  {updatingId === bank._id ? 'Updating...' : 'Reject'}
                </button>
                
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {showModal && (
        <MailModal
          receiverId={userId}
          orgData={orgData}
          onClose={() => setShowModal(false)}
          onSubmit={async (issues: string) => {
            if (selectedBankId) {
              await handleStatusUpdate(selectedBankId, 'rejected', issues);
              setShowModal(false);
              setSelectedBankId(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default OrganizationBankDetails; 