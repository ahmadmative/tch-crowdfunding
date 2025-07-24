import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import MailModal from './MailModal';

interface S18ADocument {
  _id: string;
  userId: string;
  registered: boolean;
  reference: string;
  trustNumber: string;
  pbo: string;
  npo: string;
  signature: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const OrganizationS18ADocument = ({ userId }: { userId: string }) => {
  const [s18ADocument, setS18ADocument] = useState<S18ADocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orgData, setOrgData] = useState<any>({});

  const fetchS18ADocument = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/s18a/get/${userId}`);
      setS18ADocument(res.data);
    } catch (error) {
      console.error('Error fetching S18A document:', error);
      toast.error('Error fetching S18A document');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchS18ADocument();
    }
  }, [userId]);

  const handleStatusUpdate = async (documentId: string, newStatus: 'approved' | 'rejected', issues?: string) => {
    try {
      setUpdatingId(documentId);
      await axios.put(`${BASE_URL}/s18a/status/${documentId}`, { status: newStatus });
      
      if (issues && newStatus === 'rejected') {
        await axios.post(`${BASE_URL}/issue-report`, {
          receiverId: userId,
          type: 's18aDocuments',
          issue: issues
        });
      }
      
      toast.success(`Status updated to ${newStatus}`);
      fetchS18ADocument(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRejectClick = () => {
    setShowModal(true);
  };

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

    if (!s18ADocument) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No S18A document found for this organization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">S18A Document</h3>
      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-gray-600">Registered</h5>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                s18ADocument.registered 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {s18ADocument.registered ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <h5 className="font-semibold text-gray-600">Reference Number</h5>
              <p className="text-gray-900">{s18ADocument.reference}</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-600">Trust Number</h5>
              <p className="text-gray-900">{s18ADocument.trustNumber}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-gray-600">PBO Number</h5>
              <p className="text-gray-900">{s18ADocument.pbo}</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-600">NPO Number</h5>
              <p className="text-gray-900">{s18ADocument.npo}</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-600">Signature</h5>
              <img src={`${BASE_URL}/${s18ADocument.signature}`} alt="/" className='h-20 w-20' />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h5 className="font-semibold text-gray-600">Status</h5>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(s18ADocument.status)}`}>
                  {s18ADocument.status?.toUpperCase()}
                  {getStatusIcon(s18ADocument.status)}
                </span>
              </div>
              <div>
                <h5 className="font-semibold text-gray-600">Created</h5>
                <p className="text-sm text-gray-500">{dayjs(s18ADocument.createdAt).format('DD-MM-YYYY HH:mm')}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate(s18ADocument._id, 'approved')}
                disabled={updatingId === s18ADocument._id || s18ADocument.status === 'approved'}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  s18ADocument.status === 'approved'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
                }`}
              >
                {updatingId === s18ADocument._id ? 'Updating...' : 'Approve'}
              </button>
              <button
                onClick={() => handleRejectClick()}
                disabled={updatingId === s18ADocument._id || s18ADocument.status === 'rejected'}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  s18ADocument.status === 'rejected'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
                }`}
              >
                {updatingId === s18ADocument._id ? 'Updating...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showModal && (
        <MailModal
          receiverId={userId}
          orgData={orgData}
          onClose={() => setShowModal(false)}
          onSubmit={async (issues: string) => {
            if (s18ADocument) {
              await handleStatusUpdate(s18ADocument._id, 'rejected', issues);
              setShowModal(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default OrganizationS18ADocument;