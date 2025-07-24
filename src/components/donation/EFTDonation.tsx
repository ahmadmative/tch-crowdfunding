import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";
import { Search, Filter, CheckCircle, Clock, XCircle, Eye, Download, RefreshCw } from "lucide-react";

interface Organization {
  _id: string;
  name: string;
}

interface Campaign {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Donation {
  _id: string;
  organizationId: Organization;
  campaignId?: Campaign | null;
  donorId: User;
  donorName: string;
  donorEmail: string;
  amount: number;
  totalAmount?: number; // Optional for legacy data
  tipAmount?: number; // Optional for legacy data
  platformFee?: number; // Optional for legacy data
  transactionFee?: number; // Optional for legacy data
  status: "pending" | "completed" | "failed";
  date: string;
  referenceId?: string;
  paymentMethod: string;
  anonymous: boolean;
  mobile?: string;
  comment?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  // Legacy fields
  tip?: number; // Legacy tip field
}

const EFTDonation: React.FC = () => {
  const [data, setData] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveLoadingId, setApproveLoadingId] = useState<string | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Helper functions to safely handle legacy data
  const safeAmount = (donation: Donation): number => {
    return donation.amount || 0;
  };

  const safeTotalAmount = (donation: Donation): number => {
    // Use totalAmount if available, otherwise fall back to amount + tip
    if (donation.totalAmount !== undefined) {
      return donation.totalAmount;
    }
    // For legacy data, calculate from amount + tip
    const baseAmount = safeAmount(donation);
    const legacyTip = donation.tip || donation.tipAmount || 0;
    return baseAmount + legacyTip;
  };

  const safeTipAmount = (donation: Donation): number => {
    return donation.tipAmount ?? donation.tip ?? 0;
  };

  const safePlatformFee = (donation: Donation): number => {
    return donation.platformFee ?? 0;
  };

  const safeTransactionFee = (donation: Donation): number => {
    return donation.transactionFee ?? 0;
  };

  const safeTotalFees = (donation: Donation): number => {
    return safePlatformFee(donation) + safeTransactionFee(donation);
  };

  const safeNetAmount = (donation: Donation): number => {
    // For legacy data without proper fee breakdown, use the amount field as net amount
    if (donation.totalAmount === undefined) {
      return safeAmount(donation);
    }
    // For new data with proper breakdown, amount should be the net amount
    return safeAmount(donation);
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/donations/eft/all`);
      console.log("📊 Raw EFT Donations data:", res.data);
      
      // Log a sample donation to see the structure
      if (res.data.length > 0) {
        console.log("📝 Sample donation structure:", {
          donation: res.data[0],
          hasNewFields: {
            totalAmount: res.data[0].totalAmount !== undefined,
            platformFee: res.data[0].platformFee !== undefined,
            tipAmount: res.data[0].tipAmount !== undefined
          }
        });
      }
      
      setData(res.data);
    } catch (error) {
      console.error("❌ Error fetching EFT donations:", error);
      toast.error("Error while fetching EFT donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleApprove = async (id: string) => {
    setApproveLoadingId(id);
    try {
      await axios.put(`${BASE_URL}/donations/eft/approve/${id}`);
      toast.success("EFT donation approved successfully!");
      fetchDonations(); // refresh table
    } catch (error) {
      console.error("❌ Error approving donation:", error); 
      toast.error("Error approving donation");
    } finally {
      setApproveLoadingId(null);
    }
  };

  const handleViewDetails = (donation: Donation) => {
    console.log("👁️ Viewing donation details:", {
      donation,
      calculatedValues: {
        safeAmount: safeAmount(donation),
        safeTotalAmount: safeTotalAmount(donation),
        safeTipAmount: safeTipAmount(donation),
        safePlatformFee: safePlatformFee(donation),
        safeTransactionFee: safeTransactionFee(donation)
      }
    });
    setSelectedDonation(donation);
    setShowDetailsModal(true);
  };

  // Filter logic
  const filteredData = data.filter((donation) => {
    const matchesSearch = 
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.organizationId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.campaignId?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.referenceId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? donation.status === statusFilter : true;
    const matchesPaymentMethod = paymentMethodFilter ? donation.paymentMethod === paymentMethodFilter : true;
    
    const matchesDateRange = 
      (!dateRange.from || new Date(donation.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(donation.date) <= new Date(dateRange.to));

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDateRange;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate totals with safe functions
  const totalDonations = filteredData.length;
  const totalAmount = filteredData.reduce((sum, donation) => sum + safeTotalAmount(donation), 0);
  const totalNetAmount = filteredData.reduce((sum, donation) => sum + safeNetAmount(donation), 0); 
  const totalFees = filteredData.reduce((sum, donation) => sum + safeTotalFees(donation), 0);
  const pendingCount = filteredData.filter(d => d.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading EFT donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EFT Donations Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and approve Electronic Funds Transfer donations
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={fetchDonations}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">#{totalDonations}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                <p className="text-2xl font-semibold text-gray-900">{totalDonations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-semibold">R</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Charged</p>
                <p className="text-2xl font-semibold text-gray-900">R{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">$</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net to Recipients</p>
                <p className="text-2xl font-semibold text-gray-900">R{totalNetAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by donor, organization, campaign, reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethodFilter}
                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Methods</option>
                    <option value="EFT">EFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setPaymentMethodFilter("");
                    setDateRange({ from: "", to: "" });
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              EFT Donations ({filteredData.length} of {data.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor & Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financial Breakdown
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No EFT donations found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((donation) => (
                    <tr key={donation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {donation.anonymous ? "Anonymous Donor" : donation.donorName}
                          </div>
                          <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            → {donation.organizationId?.name || "Unknown Organization"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {donation.campaignId ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {donation.campaignId.title}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              General Donation
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-900">
                            Total: R{safeTotalAmount(donation).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Net: R{safeNetAmount(donation).toFixed(2)}
                          </div>
                          {safeTotalFees(donation) > 0 && (
                            <div className="text-xs text-gray-400">
                              Fees: R{safeTotalFees(donation).toFixed(2)}
                            </div>
                          )}
                          {safeTipAmount(donation) > 0 && (
                            <div className="text-xs text-green-600">
                              Tip: R{safeTipAmount(donation).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(donation.status)}`}>
                            {getStatusIcon(donation.status)}
                            <span className="ml-1 capitalize">{donation.status}</span>
                          </span>
                          <div className="text-xs text-gray-500">
                            {new Date(donation.date).toLocaleDateString('en-ZA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-gray-900">
                          {donation.referenceId || "-"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {donation.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(donation)}
                            className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {donation.status === "pending" && (
                            <button
                              onClick={() => handleApprove(donation._id)}
                              disabled={approveLoadingId === donation._id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approveLoadingId === donation._id ? (
                                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              {approveLoadingId === donation._id ? "Approving..." : "Approve"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(startIndex + itemsPerPage, filteredData.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredData.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Donation Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-white hover:text-gray-200 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Donor Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Donor Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Name:</span>
                        <p className="text-sm text-gray-900">
                          {selectedDonation.anonymous ? "Anonymous" : selectedDonation.donorName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Email:</span>
                        <p className="text-sm text-gray-900">{selectedDonation.donorEmail}</p>
                      </div>
                      {selectedDonation.mobile && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Mobile:</span>
                          <p className="text-sm text-gray-900">{selectedDonation.mobile}</p>
                        </div>
                      )}
                      {selectedDonation.address && (
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium text-gray-600">Address:</span>
                          <p className="text-sm text-gray-900">
                            {selectedDonation.address}
                            {selectedDonation.city && `, ${selectedDonation.city}`}
                            {selectedDonation.province && `, ${selectedDonation.province}`}
                            {selectedDonation.postalCode && ` ${selectedDonation.postalCode}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Breakdown</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Base Donation:</span>
                        <span className="text-sm font-medium text-gray-900">
                          R{(safeTotalAmount(selectedDonation) - safeTipAmount(selectedDonation)).toFixed(2)}
                        </span>
                      </div>
                      {safeTipAmount(selectedDonation) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tip:</span>
                          <span className="text-sm font-medium text-green-600">
                            +R{safeTipAmount(selectedDonation).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {safePlatformFee(selectedDonation) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Platform Fee:</span>
                          <span className="text-sm font-medium text-red-500">
                            -R{safePlatformFee(selectedDonation).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {safeTransactionFee(selectedDonation) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Transaction Fee:</span>
                          <span className="text-sm font-medium text-red-500">
                            -R{safeTransactionFee(selectedDonation).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <hr className="my-2" />
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-gray-900">Total Charged:</span>
                        <span className="text-blue-600">R{safeTotalAmount(selectedDonation).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-gray-900">Net to Recipient:</span>
                        <span className="text-green-600">R{safeNetAmount(selectedDonation).toFixed(2)}</span>
                      </div>
                      
                      {/* Legacy Data Warning */}
                      {selectedDonation.totalAmount === undefined && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            ⚠️ This is legacy data from before the fee structure update. 
                            Financial breakdown may be limited.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Reference ID:</span>
                        <p className="text-sm font-mono text-gray-900">{selectedDonation.referenceId || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                        <p className="text-sm text-gray-900">{selectedDonation.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedDonation.status)}`}>
                          {getStatusIcon(selectedDonation.status)}
                          <span className="ml-1 capitalize">{selectedDonation.status}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Date:</span>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedDonation.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                {selectedDonation.comment && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900">{selectedDonation.comment}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                  {selectedDonation.status === "pending" && (
                    <button
                      onClick={() => {
                        handleApprove(selectedDonation._id);
                        setShowDetailsModal(false);
                      }}
                      disabled={approveLoadingId === selectedDonation._id}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      Approve Donation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EFTDonation;
