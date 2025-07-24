import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";
import { CreditCard, Edit, X, Check, Percent, DollarSign } from "lucide-react";

// ✅ Types
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

const CardsSettings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [data, setData] = useState<PaymentSettings>({
    paymentType: "card",
    platformFee: { percent: "", total: "" },
    transactionFee: { percent: "", total: "" },
  });
  const [isEdit, setEdit] = useState<boolean>(false);
  const [platformMode, setPlatformMode] = useState<"percent" | "total">("percent");
  const [transactionMode, setTransactionMode] = useState<"percent" | "total">("percent");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/payment-settings?type=card`);
      const apiData = res.data;

      if (apiData) {
        const platformFee = {
          percent: apiData.platformFee?.percent ?? "",
          total: apiData.platformFee?.total ?? "",
        };

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

        setPlatformMode(apiData.platformFee?.percent != null ? "percent" : "total");
        setTransactionMode(apiData.transactionFee?.percent != null ? "percent" : "total");
      }
    } catch (error) {
      toast.error("Failed to fetch payment settings");
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
        paymentType: data.paymentType,
        platformFee: platformMode === "percent"
          ? { percent: Number(data.platformFee.percent) }
          : { total: Number(data.platformFee.total) },
        transactionFee: transactionMode === "percent"
          ? { percent: Number(data.transactionFee.percent) }
          : { total: Number(data.transactionFee.total) },
      };

      if (data._id) {
        await axios.put(`${BASE_URL}/payment-settings/${data._id}`, payload);
        toast.success("Payment settings updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/payment-settings`, payload);
        toast.success("Payment settings created successfully!");
      }

      setEdit(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update payment settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading card settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="text-white w-5 h-5" />
            <h2 className="text-xl font-semibold text-white">Card Payment Settings</h2>
          </div>
          <button
            onClick={() => setEdit(!isEdit)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isEdit 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-white hover:bg-gray-50 text-blue-600"
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
              <div className="bg-blue-100 p-2 rounded-lg">
                <Percent className="text-blue-600 w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Platform Fee</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Fee charged by the platform for processing card payments
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="text-green-600 w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Transaction Fee</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Processing fee charged for each card transaction
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
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

export default CardsSettings;
