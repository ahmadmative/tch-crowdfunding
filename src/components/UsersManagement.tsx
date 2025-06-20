import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BASE_URL } from '../config/url';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';


const colors = ["#FF6384", "#36A2EB", "#FFCE56"];

const UsersManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('stats');
  const location = useLocation();
  const [quickStats, setQuickStats] = useState<any>({})
  const [roleDistribution, setRoleDistribution] = useState<any>()
  const [newUsers, setNewUsers] = useState<any>([])
  const [loading, setLoading] = useState<any>(true);
  const [users, setUsers] = useState<any>([])
  const [search, setSearch] = useState<any>("")
  const [role, setRole] = useState<any>("")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [originalUsers, setOriginalUsers] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
const [usersPerPage] = useState(10); // Adjust as needed

// Get current users
const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

// Change page
const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const roles = ["users", "admins", "permissions"]

  // const pathname = location.pathname;
  // useEffect(() => {
  //   console.log(pathname)
  //   const urlRole = pathname.split('/').pop();
  //   if (urlRole && roles.includes(urlRole)) {
  //     setSelectedTab(urlRole);
  //   }
  // }, [pathname]);

  useEffect(() => {
    if (!originalUsers.length) return;

    let filtered = [...originalUsers];


    if (search) {
      filtered = filtered.filter((user: any) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }


    if (role) {
      filtered = filtered.filter((user: any) =>
        user.role.toLowerCase().includes(role.toLowerCase())
      );
    }


    setUsers(filtered);
  }, [search, role, originalUsers]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/analytics/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setQuickStats(res.data)
        console.log(res.data)

        const res2 = await axios.get(`${BASE_URL}/analytics/users/roles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        const roleDistribution = res2.data.activeUsersByRole.map((item: any) => ({
          name: item.role.charAt(0).toUpperCase() + item.role.slice(1), // Capitalize role names
          value: item.activeCount
        }));
        setRoleDistribution(roleDistribution)
        console.log(res2.data)

        const res3 = await axios.get(`${BASE_URL}/analytics/users/trends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setNewUsers(res3.data.trends)
        console.log(res3.data)

        const res4 = await axios.get(`${BASE_URL}/analytics/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setOriginalUsers(res4.data);
        setUsers(res4.data)
        console.log(res4.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()

  }, [])

  const handleDelete = async (id: any) => {
    try {
      const res = await axios.delete(`${BASE_URL}/analytics/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      console.log(res.data)
      window.location.reload()

      setUsers(users.filter((user: any) => user.id !== id))
    } catch (err) {
      console.log(err)
    }
  }



  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };


  const handleChangeStatus = async (id: any, status: any) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/update-status/${id}`, {
        status: status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      console.log(res.data)
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  const closeAllDropdowns = () => {
    setOpenDropdownId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('stats')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'stats'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            User Statistics
          </button>

          <button
            onClick={() => setSelectedTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            User List
          </button>
          {/*  <button
            onClick={() => setSelectedTab('admins')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'admins'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Admin Management
          </button>
          <button
            onClick={() => setSelectedTab('permissions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'permissions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Role-Based Access Control
          </button> */}
        </nav>
      </div>


      {selectedTab === 'stats' && (
        <>
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Users & Roles Management</h1>
            <Link to={'/users/add'} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Add New User
            </Link>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-primary-600">{quickStats.totalUsers}</p>
              <p className="text-sm text-gray-600 mt-2">{quickStats.monthlyGrowth}% from last month</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Active Users</h3>
              <p className="text-3xl font-bold text-green-600">{quickStats.activeUsers}</p>
              <p className="text-sm text-gray-600 mt-2">{quickStats.activeUsersPercentage}% of total users</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">New Sign-ups</h3>
              <p className="text-3xl font-bold text-blue-600">{quickStats.newSignups}</p>
              <p className="text-sm text-gray-600 mt-2">{quickStats.monthlyGrowth}% from last month</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">User Distribution by Role</h3>
              <div className="h-[310px]">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {roleDistribution?.map((entry: any, index: any) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>



            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">New Users Over Time</h3>
              <div className="has-[310px]">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={newUsers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )
      }

      {/* Users Table */}
      {selectedTab === 'users' && (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User List</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select 
            onChange={(e) => setRole(e.target.value)} 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Last Active</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user: any) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">{dayjs(user.createdAt).format('DD-MM-YYYY')}</td>
                <td className="relative py-3 px-4 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <Link
                      to={`/users/edit/${user._id}`}
                      className="text-primary-600 hover:text-primary-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(user._id);
                    }}
                    className='p-2 hover:bg-slate-200 rounded-full cursor-pointer'
                  >
                    ...
                  </div>
                  {openDropdownId === user._id && (
                    <div
                      className='absolute right-0 top-10 w-40 bg-white shadow-lg rounded-lg p-2 z-10 border border-gray-200'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className='w-full text-left p-2 hover:bg-gray-100 rounded'
                        onClick={() => {
                          handleChangeStatus(user._id, 'active');
                          closeAllDropdowns();
                        }}
                      >
                        Active
                      </button>
                      <button
                        className='w-full text-left p-2 hover:bg-gray-100 rounded'
                        onClick={() => {
                          handleChangeStatus(user._id, 'suspended');
                          closeAllDropdowns();
                        }}
                      >
                        Suspend
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} entries
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}`}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            className={`px-3 py-1 border rounded ${
              currentPage === Math.ceil(users.length / usersPerPage) ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Admin Management Section */}
      {selectedTab === 'admins' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Admin Management</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Super Admin Permissions</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked readOnly />
                    <span>Manage All Users</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked readOnly />
                    <span>Manage Campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked readOnly />
                    <span>Manage Donations</span>
                  </li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Regular Admin Permissions</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>View Users</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Approve Campaigns</span>
                  </li>
                  <li className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Manage System Settings</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role-Based Access Control Section */}
      {selectedTab === 'permissions' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Role-Based Access Control</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4">Permission Matrix</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Permission</th>
                    <th className="text-center py-2 px-4">Super Admin</th>
                    <th className="text-center py-2 px-4">Admin</th>
                    <th className="text-center py-2 px-4">Campaign Creator</th>
                    <th className="text-center py-2 px-4">Donor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Manage Users</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">-</td>
                    <td className="text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Create Campaigns</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Make Donations</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                    <td className="text-center">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement; 