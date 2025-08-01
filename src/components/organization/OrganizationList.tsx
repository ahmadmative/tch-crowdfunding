import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL, SOCKET_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Organization {
  _id: string;
  name: string;
  logo: string;
  totalDonations: number;
  city: string;
  country: string;
  members: Member[];
  overallStatus: 'pending' | 'approved' | 'rejected';
  pendingSteps: string[] | string;
  componentStatuses: {
    organization: string;
    bankDetails: string;
    s18ADocument: string;
  };
}

const ITEMS_PER_PAGE = 5;

const OrganizationList: React.FC = () => {
  const [data, setData] = useState<Organization[]>([]);
  const [filteredData, setFilteredData] = useState<Organization[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);


  const getFullUrl = (filePath: string) =>
    filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get<Organization[]>(`${BASE_URL}/organization/with-status?statusFilter=approved`);
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      toast.error('Error fetching organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);


  const handleStatus = async (id: string, status: 'suspended' ) => {
    try {
      await axios.patch(`${BASE_URL}/organization/status/${id}`, { status });
      toast.success(`Organization ${status}`);
      fetchOrganizations();
    } catch (error) {
      toast.error(`Failed to ${status} organization`);
    }
  };




  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = data.filter((org) =>
      org.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-2xl font-semibold">Approved Organizations</h2>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name..."
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Logo</th>
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Total Members</th>
              <th className="text-left py-3 px-4">Donation Collected</th>
              {/* <th className="text-left py-3 px-4">City</th>
              <th className="text-left py-3 px-4">Country</th> */}
              {/* <th className="text-left py-3 px-4">Pending Steps</th> */}
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
                <td className="py-3 px-4">{org.members?.length || 0}</td>
                <td className="py-3 px-4">{org.totalDonations || 0}</td>
                {/* <td className="py-3 px-4">{org.city}</td>
                <td className="py-3 px-4">{org.country}</td> */}
                {/* <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      // Handle both string and array cases
                      let stepsArray: string[] = [];
                      if (Array.isArray(org.pendingSteps)) {
                        stepsArray = org.pendingSteps;
                      } else if (typeof org.pendingSteps === 'string' && org.pendingSteps.trim()) {
                        // If it's a string, try to split by comma or use as single item
                        stepsArray = org.pendingSteps.includes(',') 
                          ? org.pendingSteps.split(',').map(s => s.trim())
                          : [org.pendingSteps.trim()];
                      }

                      return stepsArray.length > 0 ? (
                        <>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            org.overallStatus === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : org.overallStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {stepsArray.length} pending
                          </span>
                          {stepsArray.map((step, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800"
                            >
                              {step}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          All complete
                        </span>
                      );
                    })()}
                  </div>
                </td> */}
                <td className="py-3 px-4 ">
                  <div className='flex gap-2 items-center  justify-end py-1 px-2 rounded-md'>
                    <Link
                    to={`/organizations/${org._id}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    <Eye/>
                  </Link>

                  <p className='text-red-600 hover:text-red-800 underline ml-2 cursor-pointer' onClick={() => handleStatus(org._id, 'suspended')}>Suspend</p>
                

                  </div>
                  
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default OrganizationList;
