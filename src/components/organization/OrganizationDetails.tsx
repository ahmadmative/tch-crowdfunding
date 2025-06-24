import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import OrganizationCampaigns from './OrganizationCampaigns';

const OrganizationDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);



  const getFullUrl = (filePath: string) =>
    filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;


  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization/orgId/${id}`);
      setData(res.data);
    } catch (error) {
      toast.error('Error fetching organization');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <p className="text-center text-gray-600 mt-8">Loading...</p>;

  const {
    name,
    organizationType,
    tags,
    description,
    logo,
    supportingDoc,
    address1,
    address2,
    postalCode,
    city,
    state,
    country,
    email,
    phone,
    web,
    socialMediaLinks = [],
    firstName,
    lastName,
    personPhone,
    role,
    founderId,
    founderDocument,
    accountHolderName,
    identificationType,
    identification,
    reference,
    accountNo,
    accountType,
    bankName,
    bankDocument,
    donorsRange,
    staff,
    crowdfund,
    eventCrowdfund,
    suppoters,
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
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
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
            <h4 className="font-semibold text-gray-600">Type</h4>
            <p>{organizationType}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Tags</h4>
            <p>{tags}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Description</h4>
            <p>{description}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Donors Range</h4>
            <p>{donorsRange}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Supporters</h4>
            <p>{suppoters}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Crowdfund</h4>
            <p>{crowdfund ? 'Yes' : 'No'}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Event Crowdfund</h4>
            <p>{eventCrowdfund ? 'Yes' : 'No'}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Staff</h4>
            <p>{staff ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-600">Contact</h4>
            <p>Email: <a href={`mailto:${email}`} className="text-blue-600">{email}</a></p>
            <p>Phone: {phone}</p>
            <p>Website: <a href={web} className="text-blue-600" target="_blank" rel="noreferrer">{web}</a></p>
            <h4 className="font-semibold text-gray-600 mt-2">Social Media Links</h4>
            <ul className="list-disc list-inside text-blue-600">
              {socialMediaLinks && socialMediaLinks.length > 0 ? socialMediaLinks.map((link: string, idx: number) => (
                <li key={idx}><a href={link} target="_blank" rel="noreferrer" className="hover:underline">{link}</a></li>
              )) : <li className="text-gray-400">No links</li>}
            </ul>
          </div>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <h4 className="font-semibold text-gray-600">Address 1</h4>
            <p>{address1}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Address 2</h4>
            <p>{address2}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Postal Code</h4>
            <p>{postalCode}</p>
            <h4 className="font-semibold text-gray-600 mt-2">City</h4>
            <p>{city}</p>
            <h4 className="font-semibold text-gray-600 mt-2">State</h4>
            <p>{state}</p>
            <h4 className="font-semibold text-gray-600 mt-2">Country</h4>
            <p>{country}</p>
          </div>
        </div>

        {/* Main Contact Person */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <h4 className="font-semibold text-gray-600">Main Contact Person</h4>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
            <p>Phone: {personPhone}</p>
            <p>Role: {role}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <h4 className="font-semibold text-gray-600">Account Details</h4>
            <p>Account Holder Name: {accountHolderName}</p>
            <p>Identification Type: {identificationType}</p>
            <p>Identification: {identification}</p>
            <p>Reference: {reference}</p>
            <p>Account No: {accountNo}</p>
            <p>Account Type: {accountType}</p>
            <p>Bank Name: {bankName}</p>
          </div>
        </div>

        {/* Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          
          <div>
            <h4 className="font-semibold text-gray-600">S18A Document</h4>
            {renderFilePreview(supportingDoc, 'Supporting Document')}
          </div>
          <div>
            <h4 className="font-semibold text-gray-600">Founder ID</h4>
            {renderFilePreview(founderId, 'Founder ID')}
          </div>
          <div>
            <h4 className="font-semibold text-gray-600">Founder Document</h4>
            {renderFilePreview(founderDocument, 'Founder Document')}
          </div>
          <div>
            <h4 className="font-semibold text-gray-600">Bank Document</h4>
            {renderFilePreview(bankDocument, 'Bank Document')}
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
              {userId?.gender && <p className="text-sm text-gray-500 capitalize">{userId?.gender}, {userId?.dateOfBirth && dayjs(userId?.dateOfBirth).format('YYYY-MM-DD')}</p>}
              {userId?.nationality && <p className="text-sm text-gray-500">{userId?.nationality}</p>}
            </div>
          </div>
        </div>
      </div>
      <div>
        <OrganizationCampaigns/>
      </div>
    </div>
  );
};

export default OrganizationDetails;

