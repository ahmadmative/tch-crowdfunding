import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";
import { Landmark, Edit, X, Check, Percent, DollarSign } from "lucide-react";

// Types
interface Fee {
  percent?: number | string;
  total?: number | string;
}

interface PaymentSettings {
  _id?: string;
  paymentType: string;
  platformFee: Fee;
  transactionFee: Fee;
}

const EFTSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<PaymentSettings>({
    paymentType: "eft",
    platformFee: { percent: "", total: "" },
    transactionFee: { percent: "", total: "" },
  });
  const [isEdit, setEdit] = useState(false);
  const [platformMode, setPlatformMode] = useState<"percent" | "total">("percent");
  const [transactionMode, setTransactionMode] = useState<"percent" | "total">("percent");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/payment-settings?type=eft`);
      if (res.data) {
        const apiData = res.data;
        
        // Initialize platformFee with proper values
        const platformFee = {
          percent: apiData.platformFee?.percent ?? "",
          total: apiData.platformFee?.total ?? "",
        };
        
        // Initialize transactionFee with proper values
        const transactionFee = {
          percent: apiData.transactionFee?.percent ?? "",
          total: apiData.transactionFee?.total ?? "",
        };
        
        setData({
          _id: apiData._id,
          paymentType: apiData.paymentType,
          platformFee,
          transactionFee,
        });
        
        // Determine which mode was previously used
        if (apiData.platformFee?.percent !== undefined && apiData.platformFee?.percent !== null) {
          setPlatformMode("percent");
        } else {
          setPlatformMode("total");
        }
        
        if (apiData.transactionFee?.percent !== undefined && apiData.transactionFee?.percent !== null) {
          setTransactionMode("percent");
        } else {
          setTransactionMode("total");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch EFT settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        paymentType: "eft",
        platformFee: {
          ...(platformMode === "percent"
            ? { percent: data.platformFee.percent }
            : { total: data.platformFee.total }),
        },
        transactionFee: {
          ...(transactionMode === "percent"
            ? { percent: data.transactionFee.percent }
            : { total: data.transactionFee.total }),
        },
      };

      if (data._id) {
        // Update existing record
        await axios.put(`${BASE_URL}/payment-settings/${data._id}`, payload);
        toast.success("EFT settings updated successfully!");
      } else {
        // Create new record
        await axios.post(`${BASE_URL}/payment-settings`, payload);
        toast.success("EFT settings created successfully!");
      }

      setEdit(false);
      fetchData(); // Refresh data after update
    } catch (error) {
      toast.error("Failed to update EFT settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading EFT settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Landmark className="text-white w-5 h-5" />
            <h2 className="text-xl font-semibold text-white">EFT Payment Settings</h2>
          </div>
          <button
            onClick={() => setEdit(!isEdit)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isEdit 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-white hover:bg-gray-50 text-green-600"
              }
            `}
          >
            {isEdit ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Platform Fee */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Percent className="text-green-600 w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Platform Fee</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Fee charged by the platform for processing EFT payments
            </p>

            {isEdit ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Type
                  </label>
                  <select
                    value={platformMode}
                    onChange={(e) => {
                      const mode = e.target.value as "percent" | "total";
                      setPlatformMode(mode);
                      setData((prev) => ({
                        ...prev,
                        platformFee: {
                          percent: mode === "percent" ? prev.platformFee.percent : "",
                          total: mode === "total" ? prev.platformFee.total : "",
                        },
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="percent">Percentage</option>
                    <option value="total">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {platformMode === "percent" ? "Percentage Value" : "Fixed Amount"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {platformMode === "percent" ? (
                        <Percent className="text-gray-400 w-4 h-4" />
                      ) : (
                        <DollarSign className="text-gray-400 w-4 h-4" />
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder={platformMode === "percent" ? "Enter percentage" : "Enter amount"}
                      value={platformMode === "percent" ? data.platformFee.percent : data.platformFee.total}
                      onChange={(e) =>
                        setData({
                          ...data,
                          platformFee: {
                            percent: platformMode === "percent" ? e.target.value : "",
                            total: platformMode === "total" ? e.target.value : "",
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Setting:</span>
                  <span className="font-semibold text-gray-900">
                    {platformMode === "percent" 
                      ? `${data.platformFee.percent || 0}%` 
                      : `$${data.platformFee.total || 0}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Fee */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="text-blue-600 w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Transaction Fee</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Processing fee charged for each EFT transaction
            </p>

            {isEdit ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Type
                  </label>
                  <select
                    value={transactionMode}
                    onChange={(e) => {
                      const mode = e.target.value as "percent" | "total";
                      setTransactionMode(mode);
                      setData((prev) => ({
                        ...prev,
                        transactionFee: {
                          percent: mode === "percent" ? prev.transactionFee.percent : "",
                          total: mode === "total" ? prev.transactionFee.total : "",
                        },
                      }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="percent">Percentage</option>
                    <option value="total">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {transactionMode === "percent" ? "Percentage Value" : "Fixed Amount"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {transactionMode === "percent" ? (
                        <Percent className="text-gray-400 w-4 h-4" />
                      ) : (
                        <DollarSign className="text-gray-400 w-4 h-4" />
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder={transactionMode === "percent" ? "Enter percentage" : "Enter amount"}
                      value={transactionMode === "percent" ? data.transactionFee.percent : data.transactionFee.total}
                      onChange={(e) =>
                        setData({
                          ...data,
                          transactionFee: {
                            percent: transactionMode === "percent" ? e.target.value : "",
                            total: transactionMode === "total" ? e.target.value : "",
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Setting:</span>
                  <span className="font-semibold text-gray-900">
                    {transactionMode === "percent" 
                      ? `${data.transactionFee.percent || 0}%` 
                      : `$${data.transactionFee.total || 0}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEdit && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EFTSettings;