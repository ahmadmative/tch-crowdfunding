import axios from 'axios';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface Organization {
  _id: string;
  name: string;
  logo: string;
  city: string;
  country: string;
  members?: any[];
  totalDonations?: number;
  overallStatus: 'pending' | 'approved' | 'rejected';
  pendingSteps: string[] | string;
  componentStatuses: {
    organization: string;
    bankDetails: string;
    s18ADocument: string;
  };
}

const getFullUrl = (filePath: string) =>
  filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

const OrganizationRequests: React.FC = () => {
  const [data, setData] = useState<Organization[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization/with-status?statusFilter=pending`);
      setData(res.data);
    } catch (error) {
      toast.error('Error fetching organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleStatus = async (id: string, status: 'active' | 'rejected') => {
    try {
      await axios.patch(`${BASE_URL}/organization/status/${id}`, { status });
      toast.success(`Organization ${status}`);
      fetchOrganizations();
    } catch (error) {
      toast.error(`Failed to ${status} organization`);
    }
  };

  const filteredData = data.filter((org) =>
    org.name.toLowerCase().includes(search)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Pending Organisations</h2>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name..."
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Logo</th>
              <th className="text-left py-3 px-4">Name</th>
              {/* <th className="text-left py-3 px-4">City</th> */}
              <th className="text-left py-3 px-4">Total Steps Pending</th>
              <th className="text-left py-3 px-4">Pending Steps</th>
              <th className="text-left py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((org) => (
              <tr key={org._id} className="border-b">
                <td className="py-3 px-4">
                  <img
                    src={getFullUrl(org.logo)}
                    alt={org.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="py-3 px-4">{org.name}</td>
                {/* <td className="py-3 px-4">{org.city}</td>
                <td className="py-3 px-4">{org.country}</td> */}
                <td className="py-3 px-4">
                  {(() => {
                    // Handle both string and array cases for count
                    let stepsArray: string[] = [];
                    if (Array.isArray(org.pendingSteps)) {
                      stepsArray = org.pendingSteps;
                    } else if (typeof org.pendingSteps === 'string' && org.pendingSteps.trim()) {
                      stepsArray = org.pendingSteps.includes(',') 
                        ? org.pendingSteps.split(',').map(s => s.trim())
                        : [org.pendingSteps.trim()];
                    }

                    return (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        org.overallStatus === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : org.overallStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {stepsArray.length}
                      </span>
                    );
                  })()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      // Handle both string and array cases for individual steps
                      let stepsArray: string[] = [];
                      if (Array.isArray(org.pendingSteps)) {
                        stepsArray = org.pendingSteps;
                      } else if (typeof org.pendingSteps === 'string' && org.pendingSteps.trim()) {
                        stepsArray = org.pendingSteps.includes(',') 
                          ? org.pendingSteps.split(',').map(s => s.trim())
                          : [org.pendingSteps.trim()];
                      }

                      return stepsArray.length > 0 ? (
                        stepsArray.map((step, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
                          >
                            {step}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">No pending steps</span>
                      );
                    })()}
                  </div>
                </td>
                <td className="py-3 px-4 flex gap-2">
                  <Link
                    to={`/organizations/${org._id}`}
                    className="text-blue-600 mt-4 hover:text-blue-800 underline"
                    title="View"
                  >
                    <Eye size={18} />
                  </Link>
                  {/* <button
                    onClick={() => handleStatus(org._id, 'active')}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(org._id, 'rejected')}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Rejected
                  </button> */}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationRequests;
