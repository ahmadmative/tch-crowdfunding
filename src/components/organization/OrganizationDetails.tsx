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
    logo,
    description,
    email,
    phone,
    address,
    postalCode,
    city,
    country,
    socialMediaLinks,
    certificate,
    supportingDocument,
    cnic,
    status,
    createdAt,
    userId,
  } = data;

  return (
    <div className="max-w-5xl mx-auto p-6">
        <Link to="/organizations" className='p-2 cursor-pointer'><ArrowLeft className="w-6 h-6" /></Link>
      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Organization Logo"
            className="h-20 w-20 object-cover rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm text-gray-500">{status.toUpperCase()}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-md">{description}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-600">Contact</h4>
            <p>Email: <a href={`mailto:${email}`} className="text-blue-600">{email}</a></p>
            <p>Phone: {phone}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">Location</h4>
            <p>{address}</p>
            <p>{city}, {postalCode}, {country}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">CNIC</h4>
            <p>{cnic}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-600">Created At</h4>
            <p>{dayjs(createdAt).format('DD-MM-YYYY')}</p>
          </div>
        </div>

        {/* Creator Info */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold mb-2">Creator</h4>
          <div className="flex items-center gap-4">
            <img
              src={userId?.profilePicture}
              alt="User"
              className="h-16 w-16 rounded-full border object-cover"
            />
            <div>
              <p className="font-medium">{userId?.name}</p>
              <p className="text-sm text-gray-500">{userId?.email}</p>
              <p className="text-sm text-gray-500 capitalize">{userId?.gender}, {dayjs(userId?.dateOfBirth).format('YYYY-MM-DD')}</p>
              <p className="text-sm text-gray-500">{userId?.nationality}</p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <h4 className="font-semibold mb-1">Certificate</h4>
            <img src={certificate} alt="Certificate" className="w-full h-40 object-contain rounded-lg border" />
          </div>

          <div>
            <h4 className="font-semibold mb-1">Supporting Document</h4>
            <a
              href={`${SOCKET_URL}/${supportingDocument}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Supporting Document
            </a>
          </div>
        </div>

        {/* Social Media */}
        {socialMediaLinks.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-1">Social Media</h4>
            <ul className="list-disc list-inside text-blue-600">
              {socialMediaLinks.map((link: string, index: number) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noreferrer" className="hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <OrganizationCampaigns/>
      </div>
    </div>
  );
};

export default OrganizationDetails;
