import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../config/url';
import axios from 'axios';
import dayjs from 'dayjs';



const ReportsAnalytics: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('stats');
  const [dateRange, setDateRange] = useState('last30');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const roles = ["campaign", "donor", "custom"];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>('');
  const [quickStats, setQuickStats] = useState<any>({});
  const [donationTrends, setDonationTrends] = useState<any>([]);
  const [topFiveDonationRaisers, setTopFiveDonationRaisers] = useState<any>([]);
  const [campaignMetrics, setCampaignMetrics] = useState<any>([]);
  const [donorGrowth, setDonorGrowth] = useState<any>([]);
  const [topContributers, setTopContributers] = useState<any>([]);
  
  // Pagination state for campaign metrics
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedCampaignMetrics, setPaginatedCampaignMetrics] = useState<any>([]);
  
  // Filter states for campaign performance
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [minFundsRaised, setMinFundsRaised] = useState<string>('');
  const [maxFundsRaised, setMaxFundsRaised] = useState<string>('');
  const [filteredCampaignMetrics, setFilteredCampaignMetrics] = useState<any>([]);
  
  // Custom date range states
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  useEffect(() => {
    const fetchApis = async () => {

      try {
        const res = await axios.get(`${BASE_URL}/analytics/reports/quick-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setQuickStats(res.data);
        console.log(res.data);

        const res2 = await axios.get(`${BASE_URL}/analytics/reports/donation-trends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setDonationTrends(res2.data);
        console.log(res2.data);

        const res3 = await axios.get(`${BASE_URL}/analytics/reports/top-five-donation-raisers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setTopFiveDonationRaisers(res3.data);
        console.log(res3.data);

        const res4 = await axios.get(`${BASE_URL}/analytics/reports/campaign-metrics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setCampaignMetrics(res4.data);
        setFilteredCampaignMetrics(res4.data); // Initialize filtered data
        console.log(res4.data);

        const res5 = await axios.get(`${BASE_URL}/analytics/reports/donor-growth`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setDonorGrowth(res5.data.data);
        console.log(res5.data);

        const res6 = await axios.get(`${BASE_URL}/analytics/reports/top-contributers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setTopContributers(res6.data);
        console.log(res6.data);

      } catch (error: any) {
        console.log(error);
        setError(error.response);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApis();
  }, []);

  // Pagination helper functions
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Filter logic for campaign metrics
  useEffect(() => {
    if (!campaignMetrics.length) {
      setFilteredCampaignMetrics([]);
      return;
    }

    let filtered = [...campaignMetrics];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((campaign: any) =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter (based on success rate)
    if (statusFilter) {
      filtered = filtered.filter((campaign: any) => {
        const successRate = campaign.successRate;
        switch (statusFilter) {
          case 'high-performing':
            return successRate >= 75;
          case 'moderate':
            return successRate >= 50 && successRate < 75;
          case 'low-performing':
            return successRate < 50;
          case 'fully-funded':
            return successRate >= 100;
          default:
            return true;
        }
      });
    }

    // Funds raised range filter
    if (minFundsRaised) {
      filtered = filtered.filter((campaign: any) =>
        campaign.fundsRaised >= parseFloat(minFundsRaised)
      );
    }

    if (maxFundsRaised) {
      filtered = filtered.filter((campaign: any) =>
        campaign.fundsRaised <= parseFloat(maxFundsRaised)
      );
    }

    setFilteredCampaignMetrics(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [campaignMetrics, searchTerm, statusFilter, minFundsRaised, maxFundsRaised]);

  // Pagination logic for campaign metrics
  useEffect(() => {
    if (!filteredCampaignMetrics.length) {
      setPaginatedCampaignMetrics([]);
      setTotalPages(0);
      return;
    }

    const total = Math.ceil(filteredCampaignMetrics.length / itemsPerPage);
    setTotalPages(total);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredCampaignMetrics.slice(startIndex, endIndex);
    
    setPaginatedCampaignMetrics(paginated);
  }, [filteredCampaignMetrics, currentPage, itemsPerPage]);



  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setMinFundsRaised('');
    setMaxFundsRaised('');
    setCurrentPage(1);
  };

  useEffect(() => {
    const urlRole = pathname.split('/').pop();
    if (urlRole && roles.includes(urlRole)) {
      setSelectedTab(urlRole);
    }
  }, [pathname]);


  if (isLoading) {
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
            Campaign Statistics
          </button>

          <button
            onClick={() => setSelectedTab('campaign')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'campaign'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Campaign Performance
          </button>
          
          
        </nav>
      </div>


      {
        selectedTab === 'stats' && (
          <>
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
              {/* <div className="flex space-x-4">
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="last90">Last 90 Days</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>

              </div> */}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
                <p className="text-3xl font-bold text-primary-600">R {quickStats?.totalDonationAmount}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-green-500">↑ {quickStats?.monthlyGrowth}</span> vs. previous period
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Active Donors</h3>
                <p className="text-3xl font-bold text-green-600">{quickStats?.totalDonaters}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-green-500">↑ {quickStats?.donatersGrowth}%</span> vs. previous period
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Campaign Success Rate</h3>
                <p className="text-3xl font-bold text-blue-600">{quickStats?.campaignSuccessRate?.toFixed(2)}%</p>
                <p className="text-sm text-gray-600 mt-2">Based on goal achievement</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Average Donation</h3>
                <p className="text-3xl font-bold text-purple-600">R {quickStats?.averageDonationAmount}</p>
                <p className="text-sm text-gray-600 mt-2">Per donor</p>
              </div>
            </div>
          </>
        )
      }

      {/* Campaign Performance Tab */}
      {selectedTab === 'campaign' && (
        <div className="space-y-6">
          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Campaign
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter campaign name..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Performance Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Campaigns</option>
                  <option value="fully-funded">Fully Funded (100%+)</option>
                  <option value="high-performing">High Performing (75-99%)</option>
                  <option value="moderate">Moderate (50-74%)</option>
                  <option value="low-performing">Low Performing (Under 50%)</option>
                </select>
              </div>

              {/* Min Funds Raised */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Funds Raised (R)
                </label>
                <input
                  type="number"
                  value={minFundsRaised}
                  onChange={(e) => setMinFundsRaised(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Max Funds Raised */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Funds Raised (R)
                </label>
                <input
                  type="number"
                  value={maxFundsRaised}
                  onChange={(e) => setMaxFundsRaised(e.target.value)}
                  placeholder="No limit"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredCampaignMetrics.length} of {campaignMetrics.length} campaigns
                {(searchTerm || statusFilter || minFundsRaised || maxFundsRaised) && (
                  <span className="ml-2 text-primary-600">(filtered)</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Fundraising Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalAmount" name="Amount (R)" stroke="#0ea5e9" />
                    <Line type="monotone" dataKey="totalDonors" name="Donors" stroke="#6366f1" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Campaigns</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topFiveDonationRaisers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="title" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="totalAmount" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Metrics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Campaign</th>
                    <th className="text-left py-3 px-4">Funds Raised</th>
                    <th className="text-left py-3 px-4">Goal</th>
                    <th className="text-left py-3 px-4">Donors</th>
                    <th className="text-left py-3 px-4">Avg. Donation</th>
                    <th className="text-left py-3 px-4">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCampaignMetrics.map((campaign: any, index: any) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{campaign.title}</td>
                      <td className="py-3 px-4">R{campaign.fundsRaised.toLocaleString()}</td>
                      <td className="py-3 px-4">R{(campaign.amount).toLocaleString()}</td>
                      <td className="py-3 px-4">{campaign.totalDonors}</td>
                      <td className="py-3 px-4">R{campaign.averageDonation == null ? 0 : campaign.averageDonation.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <progress value={campaign.successRate} max="100" className="min-w-20 rounded-full"></progress>
                          <span>{campaign.successRate.toFixed(2)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedCampaignMetrics.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No campaign metrics found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>

              {/* Pagination info */}
              <div className="text-sm text-gray-700">
                Showing {filteredCampaignMetrics.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredCampaignMetrics.length)} of {filteredCampaignMetrics.length} entries
                {(searchTerm || statusFilter || minFundsRaised || maxFundsRaised) && (
                  <span className="text-primary-600"> (filtered from {campaignMetrics.length} total)</span>
                )}
              </div>

              {/* Pagination buttons */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((pageNum, index, array) => (
                    <React.Fragment key={pageNum}>
                      {index > 0 && array[index - 1] !== pageNum - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm border rounded transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                      {index < array.length - 1 && array[index + 1] !== pageNum + 1 && pageNum !== totalPages && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </React.Fragment>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      

      
    </div>
  );
};

export default ReportsAnalytics; 