import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EyeIcon, ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, SOCKET_URL } from '../config/url';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import EFTDonation from './donation/EFTDonation';
import { toast } from 'react-toastify';






const COLORS = ["#4CAF50", "#2196F3", "#FF5722", "#FFC107", "#9C27B0"];

const DonationsManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('stats');
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  const [donationStats, setDonationStats] = useState<any>(null);
  const [donationTrends, setDonationTrends] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [topCampaigns, setTopCampaigns] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [originalTransactions, setOriginalTransactions] = useState<any>([]);
  const [exportStartDate, setExportStartDate] = useState<string>("");
  const [exportEndDate, setExportEndDate] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedTransactions, setPaginatedTransactions] = useState<any>([]);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const location = useLocation();
  const pathname = location.pathname;
  const roles = ["transactions", "payments", "logs", "settings"]
  const [donorName, setDonorName] = useState("");

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


  useEffect(() => {
    console.log(pathname)
    const urlRole = pathname.split('/').pop();
    if (urlRole && roles.includes(urlRole)) {
      setSelectedTab(urlRole);
    }
  }, [pathname]);

  useEffect(() => {
    if (!originalTransactions.length) return;

    let filtered = [...originalTransactions];

    // Apply donor name filter
    if (donorName) {
      filtered = filtered.filter(transaction =>
        transaction?.donorId?.name?.toLowerCase().includes(donorName.toLowerCase())
      );
    }

    // Apply payment method filter
    if (paymentMethod) {
      filtered = filtered.filter(transaction =>
        transaction.paymentMethod === paymentMethod
      );
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter(transaction =>
        transaction.status === status
      );
    }

    setTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [donorName, paymentMethod, status, originalTransactions]);

  // Pagination logic
  useEffect(() => {
    if (!transactions.length) {
      setPaginatedTransactions([]);
      setTotalPages(0);
      return;
    }

    const total = Math.ceil(transactions.length / itemsPerPage);
    setTotalPages(total);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = transactions.slice(startIndex, endIndex);
    
    setPaginatedTransactions(paginated);
  }, [transactions, currentPage, itemsPerPage]);


  useEffect(() => {
    const fetchDonationStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/analytics/donations/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setDonationStats(response.data)
        console.log(donationStats)
        setLoading(false);

        const response2 = await axios.get(`${BASE_URL}/analytics/donations/trends`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setDonationTrends(response2.data.trends)
        console.log(donationTrends)
        setLoading(false);

        const response3 = await axios.get(`${BASE_URL}/analytics/donations/payment-methods`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setPaymentMethods(response3.data.data)
        console.log(paymentMethods)
        setLoading(false);

        const response4 = await axios.get(`${BASE_URL}/analytics/donations/top-campaigns`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setTopCampaigns(response4.data.topCampaigns)
        console.log(topCampaigns)
        setLoading(false);

        const response5 = await axios.get(`${BASE_URL}/analytics/donations/all-transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })
        setOriginalTransactions(response5.data.transactions);
        setTransactions(response5.data.transactions)
        console.log(transactions)
        setLoading(false);

      } catch (error) {
        setError("Error fetching donation stats");
        setLoading(false);
      }

    }
    fetchDonationStats()
  }, [])



  const handlePrint = async (donation : any) => {
    const toastId = toast.loading("Generating S18A Certificate...");

    try {
      const res = await axios.post(`${BASE_URL}/s18/document`, donation);

      toast.update(toastId, {
        render: "Certificate generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Get the outputPath and convert to browser-accessible URL
      const outputPath = res.data.outputPath;
      if (outputPath) {
        const fileName =
          outputPath.split("certificates\\").pop() ||
          outputPath.split("certificates/").pop();
        const fileUrl = `${SOCKET_URL}/certificates/${fileName}`;
        window.open(fileUrl, "_blank");
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to generate S18A Certificate",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Error generating S18A Certificate: ", error);
    }
  };

  // CSV export utility (no external package)
  const handleExportCSV = () => {
    // Filter by date if set
    let filtered = [...transactions];
    if (exportStartDate) {
      filtered = filtered.filter((t) =>
        dayjs(t.date).isAfter(dayjs(exportStartDate).subtract(1, "day"))
      );
    }
    if (exportEndDate) {
      filtered = filtered.filter((t) =>
        dayjs(t.date).isBefore(dayjs(exportEndDate).add(1, "day"))
      );
    }

    // Prepare CSV header and rows
    const header = [
      "Date",
      "Reference",
      "Donor",
      "Campaign",
      "Organization",
      "CampaignId",
      "Base",
      "Contribution",
      "SubTotal",
      "PlatformFee",
      "TxnFee",
      "Due",
      "PaymentMethod",
      "Status"
    ];
    const rows = filtered.map((t: any) => [
      dayjs(t.date).format("YYYY-MM-DD"),
      t.referenceId,
      t.donor?.name,
      t.campaign?.title || "N/A",
      t.organization?.name || "N/A",
      t.campaign?._id || "N/A",
      t.totalAmount - t.tip,
      t.tip,
      t.totalAmount,
      t.platformFee,
      t.transactionFee,
      t.amount,
      t.paymentMethod,
      t.status,
    ]);
    const csvContent =
      [header, ...rows]
        .map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && (cell.includes(",") || cell.includes('"'))
                ? `"${cell.replace(/"/g, '""')}"`
                : cell
            )
            .join(",")
        )
        .join("\r\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Donations Transactions.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
            className={`py-4 px-1 border-b-2 font-medium text-sm ${(selectedTab === 'stats')
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Donation Statistics
          </button>
          <button
            onClick={() => setSelectedTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${(selectedTab === 'transactions' || selectedTab === 'settings')
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Transaction List
          </button>
          
          {/* <button
            onClick={() => setSelectedTab('logs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'logs'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Receipt Logs
          </button> */}
          <button
            onClick={() => setSelectedTab('eft')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${(selectedTab === 'eft')
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            EFT TRansactions
          </button>
        </nav>
      </div>


      {
        selectedTab == "eft" && (
          <EFTDonation/>
        )
      }


      {
        selectedTab === "stats" && (
          <>
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Donations Management</h1>
              <div className="flex space-x-4">
                {/* <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Download Reports
                </button> */}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
                <p className="text-3xl font-bold text-primary-600">R{donationStats?.totalAmount}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-green-500">↑ {donationStats?.monthlyGrowth}</span> from last month
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Successful Transactions</h3>
                <p className="text-3xl font-bold text-green-600">{donationStats?.donationsCompleted}</p>
                <p className="text-sm text-gray-600 mt-2">{Number(donationStats?.completedPercentage).toFixed(2)}% success rate</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Failed Transactions</h3>
                <p className="text-3xl font-bold text-red-600">{donationStats?.donationsFailed}</p>
                <p className="text-sm text-gray-600 mt-2">{Number(donationStats?.failedPercentage).toFixed(2)}% rate</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Average Donation</h3>
                <p className="text-3xl font-bold text-blue-600">R{Number(donationStats?.avergeDonation).toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-2">Per transaction</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Donation Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={donationTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="totalAmount" stroke="#0ea5e9" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        nameKey="paymentMethod"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethods.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>


                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Top Campaigns</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCampaigns} layout="vertical">
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
          </>
        )
      }



      {/* Transactions Table */}
      {(selectedTab === 'transactions' || selectedTab === 'settings') && (
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center gap-4 p-4">
            <label className="text-sm">
              From:{" "}
              <input
                type="date"
                value={exportStartDate}
                onChange={e => setExportStartDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm ml-1"
              />
            </label>
            <label className="text-sm">
              To:{" "}
              <input
                type="date"
                value={exportEndDate}
                onChange={e => setExportEndDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm ml-1"
              />
            </label>
            
            <button
              onClick={() => {
                setExportStartDate("");
                setExportEndDate("");
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
            >
              Export CSV
            </button>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Transaction List</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search donor name..."
                  onChange={(e) => setDonorName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select onChange={(e) => setPaymentMethod(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Payment Methods</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="EFT">EFT</option>
                  
                </select>
                <select onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Statuses</option>
                  <option value="completed">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Txn Reference</th>
                    <th className="text-left py-3 px-4 min-w-[200px]">Donor</th>
                    <th className="text-left py-3 px-4 min-w-[200px]">Campaign</th>
                    <th className="text-left py-3 px-4 min-w-[200px]">Organization</th>
                    <th className="text-left py-3 px-4 min-w-[200px]">Campaign Id</th>
                    <th className="text-left py-3 px-4 min-w-[130px]">Base</th>
                    
                    
                    <th className="text-left py-3 px-4 min-w-[130px]">Contribution</th>
                    <th className="text-left py-3 px-4 min-w-[130px]">Sub Total</th>
                    <th className="text-left py-3 px-4 min-w-[130px]">Platform Fee</th>
                    <th className="text-left py-3 px-4 min-w-[130px]">Txn Fee</th>
                    <th className="text-left py-3 px-4 min-w-[130px]">Due</th>
                    
                    <th className="text-left py-3 px-4 min-w-[130px]">Payment Method</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions?.map((transaction: any) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-3 px-4">{dayjs(transaction?.date).format('DD-MM-YYYY')}</td>
                      <td className="py-3 px-4">{transaction?.referenceId}</td>
                      <td className="py-3 px-4">{transaction?.donor?.name}</td>
                      <td className="py-3 px-4">{transaction?.campaign?.title || "N/A"} </td>
                      <td className="py-3 px-4">{transaction?.organization?.name || "N/A"}</td>
                      <td className="py-3 px-4">{transaction?.campaign?._id|| "N/A"}</td>
                      <td className="py-3 px-4">R{transaction?.totalAmount - transaction?.tip}</td>

                      <td className="py-3 px-4">R{transaction?.tip}</td>
                      <td className="py-3 px-4 ">R{transaction?.totalAmount}</td>
                      <td className="py-3 px-4">R{transaction?.platformFee}</td>
                      <td className="py-3 px-4">R{transaction?.transactionFee}</td>
                      <td className="py-3 px-4">R{transaction?.amount}</td>
                      <td className="py-3 px-4">{transaction?.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(transaction?.status)}`}>
                          {transaction?.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/donations/${transaction?._id}`} className="text-gray-600 hover:text-gray-800">
                            <EyeIcon className="h-5 w-5" />
                          </Link>

                          {
                            transaction.s18aRecord.length> 0 && (
                              <button onClick={() => handlePrint(transaction.s18aRecord[0])} className="text-gray-600 hover:text-gray-800">
                                <DocumentArrowDownIcon className="h-5 w-5" />
                              </button>
                            )
                          }
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {transactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Items per page:</label>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 border rounded transition-colors ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {currentPage > 3 && (
                    <>
                      <button 
                        onClick={() => handlePageChange(1)}
                        className="px-3 py-1 border rounded hover:bg-gray-100 text-gray-700"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="text-gray-500">...</span>}
                    </>
                  )}
                  
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="text-gray-500">...</span>}
                      <button 
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 py-1 border rounded hover:bg-gray-100 text-gray-700"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 border rounded transition-colors ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {selectedTab === 'payments' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Payment Processing Settings</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Gateway Settings */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Payment Gateways</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Stripe</p>
                      <p className="text-sm text-gray-600">Credit Card Processing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">PayPal</p>
                      <p className="text-sm text-gray-600">PayPal Integration</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recurring Donations Settings */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Recurring Donations</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Enable Recurring Donations</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Allow Donor Cancellation</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Send Renewal Notifications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="flex justify-end mt-6">
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Logs */}
      {selectedTab === 'logs' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Receipt Logs</h2>
          <div className="space-y-4">
            {transactions?.map((transaction: any) => (
              <div key={transaction?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{transaction?.donorId?.name}</p>
                  <p className="text-sm text-gray-600">
                    R{transaction?.amount} - {transaction?.campaignId?.title}
                  </p>
                  <p className="text-xs text-gray-500">{dayjs(transaction?.date).format('DD-MM-YYYY')}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-primary-600 hover:text-primary-800">
                    Download
                  </button>
                  <button className="px-3 py-1 text-primary-600 hover:text-primary-800">
                    Resend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManagement;