import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";

interface Organization {
  name: string;
}

interface Campaign {
  title: string;
}

interface Donation {
  _id: string;
  organizationId: Organization;
  campaignId?: Campaign | null;
  donorName: string;
  amount: number;
  tip: number;
  transactionFee: number;
  status: string;
  date: string;
  referenceId?: string;
  paymentMethod: string;
}

const EFTDonation: React.FC = () => {
  const [data, setData] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveLoadingId, setApproveLoadingId] = useState<string | null>(null); // ✅ Loader for Approve button

  // Filters
  const [orgFilter, setOrgFilter] = useState("");
  const [donorFilter, setDonorFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donations/eft/all`);
      setData(res.data);
    } catch (error) {
      toast.error("Error while fetching EFT donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleApprove = async (id: string) => {
    setApproveLoadingId(id); // ✅ Start loader for this specific row
    try {
      await axios.put(`${BASE_URL}/donations/eft/approve/${id}`);
      toast.success("Donation approved successfully!");
      fetchDonations(); // refresh table
    } catch (error) {
      toast.error("Error approving donation");
    } finally {
      setApproveLoadingId(null); // ✅ Stop loader
    }
  };

  // Filter logic
  const filteredData = data.filter((donation) => {
    return (
      donation.organizationId.name.toLowerCase().includes(orgFilter.toLowerCase()) &&
      donation.donorName.toLowerCase().includes(donorFilter.toLowerCase()) &&
      (donation.referenceId?.toLowerCase() || "").includes(referenceFilter.toLowerCase()) &&
      (statusFilter ? donation.status === statusFilter : true)
    );
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Loading donations...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">EFT Donations</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Organization"
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by Donor"
          value={donorFilter}
          onChange={(e) => setDonorFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by Reference"
          value={referenceFilter}
          onChange={(e) => setReferenceFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Organization</th>
              <th className="px-4 py-2 text-left">Campaign</th>
              <th className="px-4 py-2">Donor</th>
              <th className="px-4 py-2">Amount (R)</th>
              <th className="px-4 py-2">Tip</th>
              <th className="px-4 py-2">Transaction Fee</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-500">
                  No EFT donations found.
                </td>
              </tr>
            ) : (
              filteredData.map((donation) => (
                <tr key={donation._id} className="border-b border-gray-600">
                  <td className="px-4 py-2">{donation.organizationId?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    {donation.campaignId ? donation.campaignId.title : "-"}
                  </td>
                  <td className="px-4 py-2">{donation.donorName}</td>
                  <td className="px-4 py-2 font-semibold">R{donation.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{donation.tip < 0 ? 0 : donation.tip}</td>
                  <td className="px-4 py-2">{donation.transactionFee}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        donation.status === "completed"
                          ? "bg-green-600 text-white"
                          : donation.status === "pending"
                          ? "bg-yellow-500 text-black"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(donation.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{donation.referenceId || "-"}</td>
                  <td className="px-4 py-2">{donation.paymentMethod}</td>
                  <td className="px-4 py-2">
                    {donation.status === "pending" && (
                      <button
                        onClick={() => handleApprove(donation._id)}
                        className={`bg-blue-600 text-white px-3 py-1 rounded flex items-center justify-center ${
                          approveLoadingId === donation._id ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                        }`}
                        disabled={approveLoadingId === donation._id}
                      >
                        {approveLoadingId === donation._id ? (
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                            ></path>
                          </svg>
                        ) : (
                          "Approve"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EFTDonation;
