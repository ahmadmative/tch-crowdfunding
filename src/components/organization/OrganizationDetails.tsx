import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import OrganizationCampaigns from './OrganizationCampaigns';
import MailModal from './MailModal';
import OrganizationBankDetails from './OrganizationBankDetails';
import OrganizationS18ADocument from './OrganizationS18ADocument';

const OrganizationDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'organization' | 'bankDetails' | 's18aDocuments'>('organization');

  const getFullUrl = (filePath: string) =>
    filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization/orgId/${id}`);
      setData(res.data);
      setSelectedStatus(res.data.status || 'pending');
    } catch (error) {
      toast.error('Error fetching organization');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetch();
  }, []);



  const handleStatus = async (id: string | undefined, status: string, issues?: string) => {
    try {
      await axios.patch(`${BASE_URL}/organization/status/${id}`, { status });
      if(issues){
        await axios.post(`${BASE_URL}/issue-report`, {
          receiverId: userId._id,
          type: activeTab,
          issue: issues
        })
      }
      toast.success(`Organization status updated to "${status}"`);
      fetch();
    } catch (error) {
      toast.error(`Failed to update status to "${status}"`);
    }
  };

  const handleUpdateClick = () => {
    console.log("selected status",selectedStatus)
    if (selectedStatus == 'rejected') {
      setShowModal(true);
    } else {
      handleStatus(id, selectedStatus);
    }
  };

  if (loading) return <p className="text-center text-gray-600 mt-8">Loading...</p>;

  const {
    name,
    description,
    logo,
    address,
    phone,
    email,
    registrationNumber,
    vatNumber,
    emisNumber,
    organizationType,
    socialMediaLinks = [],
    status,
    createdAt,
    userId,
  } = data;

  const renderFilePreview = (filePath: string | undefined, label: string) => {
    if (!filePath) return <span className="text-gray-400">No {label}</span>;
    const url = getFullUrl(filePath);
    if (/\.(png|jpg|jpeg|gif|svg)$/i.test(filePath)) {
      return <img src={url} alt={label} className="h-24 object-contain border rounded-md shadow" />;
    }
    if (/\.(pdf|doc|docx)$/i.test(filePath)) {
      return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">📄 Download {label}</a>;
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download {label}</a>;
  };



  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link to="/organizations" className='p-2 cursor-pointer'><ArrowLeft className="w-6 h-6" /></Link>
      
      {/* Tab Navigation */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('organization')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'organization'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Organization Details
            </button>
            <button
              onClick={() => setActiveTab('bankDetails')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bankDetails'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bank Details
            </button>
            <button
              onClick={() => setActiveTab('s18aDocuments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 's18aDocuments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              S18A Documents
            </button>
          </nav>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'organization' ? (
            <>
              {/* Organization Details Content */}
              {/* Header */}
        <div className="flex items-center gap-4">
          {renderFilePreview(logo, 'Logo')}
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm text-gray-500">{status?.toUpperCase()}</p>
            <p className="text-xs text-gray-400">Created: {createdAt && dayjs(createdAt).format('DD-MM-YYYY')}</p>
          </div>
        </div>

        {/* Organization Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <h4 className="font-semibold text-gray-600">Organization Type</h4>
            <p className="capitalize">{organizationType}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Description</h4>
            <p>{description}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Registration Number</h4>
            <p>{registrationNumber || 'Not provided'}</p>
            <h4 className="font-semibold text-gray-600 mt-2">VAT Number</h4>
            <p>{vatNumber || 'Not provided'}</p>
            <h4 className="font-semibold text-gray-600 mt-2">EMIS Number</h4>
            <p>{emisNumber || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-600">Contact Information</h4>
            <p>Email: <a href={`mailto:${email}`} className="text-blue-600">{email}</a></p>
            <p>Phone: {phone}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Address</h4>
            <p>{address}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Social Media Links</h4>
            <ul className="list-disc list-inside text-blue-600">
              {socialMediaLinks.length > 0 ? socialMediaLinks.map((link: string, idx: number) => (
                <li key={idx}><a href={link} target="_blank" rel="noreferrer" className="hover:underline">{link}</a></li>
              )) : <li className="text-gray-400">No links</li>}
            </ul>
          </div>
        </div>



        {/* Creator Info */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold mb-2">Creator</h4>
          <div className="flex items-center gap-4">
            {userId?.profilePicture && (
              <img
                src={getFullUrl(userId.profilePicture)}
                alt="User"
                className="h-16 w-16 rounded-full border object-cover"
              />
            )}
            <div>
              <p className="font-medium">{userId?.name}</p>
              <p className="text-sm text-gray-500">{userId?.email}</p>
              {userId?.gender && (
                <p className="text-sm text-gray-500 capitalize">
                  {userId?.gender}, {userId?.dateOfBirth && dayjs(userId?.dateOfBirth).format('YYYY-MM-DD')}
                </p>
              )}
              {userId?.nationality && <p className="text-sm text-gray-500">{userId?.nationality}</p>}
            </div>
          </div>
        </div>

              {/* Status Update */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-600">Update Status</h4>
                <div className="flex items-center gap-4 mt-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button
                    onClick={handleUpdateClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            </>
          ) : activeTab === 'bankDetails' ? (
            <>
              {/* Bank Details Content */}
              <OrganizationBankDetails userId={data.userId?._id} />
            </>
          ) : (
            <>
              {/* S18A Documents Content */}
              <OrganizationS18ADocument userId={data.userId?._id} />
            </>
          )}
        </div>
      </div>

      {
        showModal && (
          <MailModal
            receiverId={userId?._id}
            orgData={data}
            onClose={() => setShowModal(false)}
            onSubmit={async (issues: string) => {
              await handleStatus(id, 'rejected', issues);
              setShowModal(false);
            }}
          />
        )
      }

      {/* Organization Campaigns */}
      <div className="mt-6">
        <OrganizationCampaigns />
      </div>
    </div>
  );
};

export default OrganizationDetails;
