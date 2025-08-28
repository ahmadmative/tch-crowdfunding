import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Clock, AlertTriangle, Download, X } from 'lucide-react';
import VerificationModal from './VerificationModal';

interface OrganizationVerificationProps {
  userId: string;
}

const OrganizationVerification: React.FC<OrganizationVerificationProps> = ({ userId }) => {
  const [verificationData, setVerificationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [showModal, setShowModal] = useState(false);
  const [issues, setIssues] = useState<string>('');

  const getFullUrl = (filePath: string) =>
    filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

  const downloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchVerificationData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/verification-documents/${userId}`);
      if (res.data && res.data._id) {
        setVerificationData(res.data);
        setSelectedStatus(res.data.status || 'pending');
      } else {
        setVerificationData(null);
        setSelectedStatus('pending');
      }
    } catch (error) {
      console.log('No verification documents found for user');
      setVerificationData(null);
      setSelectedStatus('pending');
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/issue-report/${userId}?type=verificationDocuments`);
      if (res.data.type === "verificationDocuments") {
        setIssues(res.data.issue || '');
      }
    } catch (error) {
      // No issues found
    }
  };

  useEffect(() => {
    if (userId) {
      fetchVerificationData();
      fetchIssues();
    }
  }, [userId]);

  const handleStatusUpdate = async (status: string, issues?: string) => {
    if (!verificationData?._id) return;
    
    setLoading(true);
    try {
      await axios.patch(`${BASE_URL}/verification-documents/status/${verificationData._id}`, { status });
      
      if (issues && status === 'rejected') {
        await axios.post(`${BASE_URL}/issue-report`, {
          receiverId: userId,
          type: 'verificationDocuments',
          issue: issues
        });
      }
      
      toast.success(`Verification documents status updated to "${status}"`);
      fetchVerificationData();
      fetchIssues();
    } catch (error) {
      toast.error(`Failed to update status to "${status}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = () => {
    if (selectedStatus === 'rejected') {
      setShowModal(true);
    } else {
      handleStatusUpdate(selectedStatus);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="inline-block ml-1 text-sm" />;
      case 'rejected':
        return <XCircle className="inline-block ml-1 text-sm" />;
      case 'pending':
        return <Clock className="inline-block ml-1 text-sm" />;
      default:
        return null;
    }
  };

  const docFields = [
    { key: "registeration", label: "Registration Certificate", required: true },
    { key: "VATRegisteration", label: "VAT Registration", required: false },
    { key: "bankVerification", label: "Bank Verification", required: true },
    { key: "SARSSection18A", label: "SARS Section 18A", required: false },
    { key: "NPOCertification", label: "NPO Certification", required: false },
    { key: "PBOCertification", label: "PBO Certification", required: false },
    { key: "principalID", label: "Principal ID", required: true },
    { key: "AuthorisationLetter", label: "Authorisation Letter", required: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Verification Documents</h2>
          <p className="text-sm text-gray-600">Review and manage organization verification documents</p>
        </div>
        {verificationData && (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(verificationData.status)}`}>
            {verificationData.status.charAt(0).toUpperCase() + verificationData.status.slice(1)}
            {getStatusIcon(verificationData.status)}
          </div>
        )}
      </div>

      {/* Issues Alert - Show if rejected */}
      {verificationData?.status === "rejected" && issues && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Issues Found with Verification Documents
              </h3>
              <div className="text-sm text-red-700">
                <p className="mb-2">The following issues were identified:</p>
                <div className="bg-white border border-red-200 rounded-md p-3">
                  <p className="font-medium">Issue:</p>
                  <p className="mt-1">{issues}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      {verificationData ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docFields.map((field) => (
              <div key={field.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {verificationData[field.key] ? (
                    <CheckCircle className="text-green-500 text-sm" />
                  ) : (
                    <XCircle className="text-red-500 text-sm" />
                  )}
                </div>
                {verificationData[field.key] ? (
                  <div className="flex items-center gap-2">
                    {verificationData[field.key].includes('.pdf') ? (
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <img 
                        src={getFullUrl(verificationData[field.key])} 
                        alt={`${field.label} Preview`} 
                        className="w-8 h-8 object-cover rounded border" 
                      />
                    )}
                    <button
                      onClick={() => downloadDocument(
                        getFullUrl(verificationData[field.key]), 
                        `${field.label.replace(/\s+/g, '_')}.${verificationData[field.key].includes('.pdf') ? 'pdf' : 'jpg'}`
                      )}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm underline transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not uploaded</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Verification Documents Found</h3>
          <p className="text-gray-600">This organization has not uploaded any verification documents yet.</p>
        </div>
      )}

      {/* Status Update Section */}
      {verificationData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Update Document Status</h3>
          <div className="flex items-center gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleUpdateClick}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      )}

              {/* Issue Modal */}
        {showModal && (
          <VerificationModal
            verificationData={verificationData}
            onClose={() => setShowModal(false)}
            onSubmit={(issues) => {
              handleStatusUpdate('rejected', issues);
              setShowModal(false);
            }}
          />
        )}
    </div>
  );
};

export default OrganizationVerification;