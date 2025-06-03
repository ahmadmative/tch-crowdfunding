import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EyeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { HeartIcon } from 'lucide-react';
import { toast } from 'react-toastify';


const fetchWithAuth = (endpoint: string) => {
  return axios.get(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

const fetchCampaignStats = () => fetchWithAuth('/analytics/campaign/stats');
const fetchCampaignStatus = () => fetchWithAuth('/analytics/campaign/status');
const fetchFundsRaised = () => fetchWithAuth('/analytics/campaign/funds-raised');
const fetchTopCampaigns = () => fetchWithAuth('/analytics/campaign/top-campaigns');
const fetchAllCampaigns = () => fetchWithAuth('/analytics/campaign/all-campaigns')

const CampaignsManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('stats');
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [cardData, setCardData] = useState<any>([])
  const [campaignStatusData, setCampaignStatusData] = useState<any>([])
  const [fundsOverTimeData, setFundsOverTimeData] = useState<any>([])
  const [topCampaignsData, setTopCampaignsData] = useState<any>([])
  const [campaignsData, setCampaignsData] = useState<any>([])
  const [loading, setLoading] = useState<any>(true)
  const [error, setError] = useState<any>("")
  const [search, setSearch] = useState<any>("")
  const [status, setStatus] = useState<any>("")
  const [originalCampaignsData, setOriginalCampaignsData] = useState<any>([]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const location = useLocation();
  const pathname = location.pathname;
  const roles = ["all", "pending", "active"]

  // useEffect(() => {
  //   console.log(pathname)
  //   const urlRole = pathname.split('/').pop();
  //   if (urlRole && roles.includes(urlRole)) {
  //     setSelectedTab(urlRole);
  //   }
  // }, [pathname]);




  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          statsRes,
          statusRes,
          fundsRes,
          topRes,
          allRes
        ] = await Promise.all([
          fetchCampaignStats(),
          fetchCampaignStatus(),
          fetchFundsRaised(),
          fetchTopCampaigns(),
          fetchAllCampaigns()
        ]);

        setCardData(statsRes.data);
        setCampaignStatusData(statusRes.data);
        setFundsOverTimeData(fundsRes.data);
        setTopCampaignsData(topRes.data);
        setOriginalCampaignsData(allRes.data);
        setCampaignsData(allRes.data);

        console.log('Stats:', statsRes.data);
        console.log('Status:', statusRes.data);
        console.log('Funds:', fundsRes.data);
        console.log('Top:', topRes.data);
        console.log('All:', allRes.data);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);


  // filter 
  useEffect(() => {
    if (!originalCampaignsData.length) return;

    let filtered = [...originalCampaignsData];

    if (search) {
      filtered = filtered.filter((campaign: any) =>
        campaign.title.toLowerCase().includes(search.toLowerCase())
      );
    }


    if (status) {
      filtered = filtered.filter((campaign: any) =>
        campaign.status.toLowerCase().includes(status.toLowerCase())
      );
    }


    if (selectedTab !== 'all') {
      filtered = filtered.filter((campaign: any) =>
        campaign.status.toLowerCase().includes(selectedTab.toLowerCase())
      );
    }

    setCampaignsData(filtered);
  }, [search, status, selectedTab, originalCampaignsData]);


  const handleFavourite=async(id:number)=>{
    try {
      const res = await axios.patch(`${BASE_URL}/campaigns/favourite/${id}`)
      
      toast.success("Favourite Status Updated");

      const allRes = await fetchAllCampaigns()
      setCampaignsData(allRes.data);

      
    } catch (error: any) {
      toast.error("something went wrong");
    }
  }
   



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
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
            Campaigns Statistics
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            All Campaigns
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => setSelectedTab('active')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'active'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Active Campaigns
          </button>
        </nav>
      </div>

      {
        selectedTab === "stats" && (
          <>
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Campaigns Management</h1>
              <Link to={"/admin/campaigns/create"} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Create Campaign
              </Link>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Campaigns</h3>
                <p className="text-3xl font-bold text-primary-600">{cardData.totalCampaigns}</p>
                <p className="text-sm text-gray-600 mt-2">Across all statuses</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Active Campaigns</h3>
                <p className="text-3xl font-bold text-green-600">{cardData.activeCampaigns}</p>
                <p className="text-sm text-gray-600 mt-2">Currently running</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Funds Raised</h3>
                <p className="text-3xl font-bold text-blue-600">R{cardData.totalFundsRaised}</p>
                <p className="text-sm text-gray-600 mt-2">All time</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                <p className="text-3xl font-bold text-purple-600">{cardData.successRate}%</p>
                <p className="text-sm text-gray-600 mt-2">Goal achievement</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Campaigns by Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Funds Raised Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fundsOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" tickFormatter={(value) => dayjs(value).format('DD MMM YYYY')} />
                      <YAxis />
                      <Tooltip labelFormatter={(value) => dayjs(value).format('DD MMMM YYYY')} />
                      <Line type="monotone" dataKey="totalAmount" stroke="#0ea5e9" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Campaigns Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top 5 Campaigns</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {topCampaignsData.map((campaign: any, index: any) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 truncate">{campaign.title}</h4>
                    <p className="text-primary-600 font-bold mt-2">R{campaign.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      }

      {/* Campaigns Table */}
      {selectedTab !== "stats" &&<div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Campaign List</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search campaigns..."
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Creator</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Funds Raised</th>
                  <th className="text-left py-3 px-4">Progress</th>
                  <th className="text-left py-3 px-4">Start Date</th>
                  <th className="text-left py-3 px-4">End Date</th>
                  <th className="text-left py-3 px-4">Favourite</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaignsData.map((campaign: any) => (
                  <tr key={campaign._id} className="border-b">
                    <td className="py-3 px-4">{campaign.title}</td>
                    <td className="py-3 px-4">{campaign.userDetails.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">R{campaign.totalDonations.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${(campaign.totalDonations / campaign.amount) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {((campaign.totalDonations / campaign.amount) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">{dayjs(campaign.startDate).format('DD-MM-YYYY')}</td>
                    <td className="py-3 px-4">{dayjs(campaign.endDate).format('DD-MM-YYYY')}</td>
                    <td className="py-3 px-4">{campaign.isFavourite? <HeartIcon className="w-5 h-5 text-red-500" onClick={() => handleFavourite(campaign._id)}/>  : <HeartIcon className="w-5 h-5 text-gray-500" onClick={() => handleFavourite(campaign._id)}/>}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/campaigns/${campaign._id}`}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        {campaign.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-800">
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 1 to 10 of 72 campaigns
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
              <button className="px-3 py-1 border rounded bg-primary-600 text-white">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
            </div>
          </div>
        </div>
      </div>}

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Campaign Details</h2>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {campaignsData.find((c: any) => c.id === selectedCampaign) && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600">
                    {campaignsData.find((c: any) => c.id === selectedCampaign)?.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Goal</h3>
                    <p className="text-gray-600">
                      ${campaignsData.find((c: any) => c.id === selectedCampaign)?.goal.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Funds Raised</h3>
                    <p className="text-gray-600">
                      ${campaignsData.find((c: any) => c.id === selectedCampaign)?.totalDonations.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Close
                  </button>
                  {campaignsData.find((c: any) => c.id === selectedCampaign)?.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsManagement; 