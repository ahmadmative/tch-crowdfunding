import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";

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
        toast.success("EFT settings updated");
      } else {
        // Create new record
        await axios.post(`${BASE_URL}/payment-settings`, payload);
        toast.success("EFT settings created");
      }

      setEdit(false);
      fetchData(); // Refresh data after update
    } catch (error) {
      toast.error("Failed to update EFT settings");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-md bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">EFT Settings</p>
        <button
          onClick={() => setEdit(!isEdit)}
          className="text-sm text-blue-500 hover:underline"
        >
          {isEdit ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Platform Fee */}
      <div className="mb-6">
        <p className="font-medium mb-2">Platform Fee</p>
        {isEdit ? (
          <div className="flex gap-4 items-center mb-2">
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
              className="border px-2 py-1 rounded"
            >
              <option value="percent">Percentage</option>
              <option value="total">Fixed Amount</option>
            </select>
            <div className="flex-1">
              <input
                type="number"
                className="border px-2 py-1 w-full"
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
        ) : (
          <div className="flex justify-between">
            <p>
              {platformMode === "percent" 
                ? `Percentage: ${data.platformFee.percent || 0}%` 
                : `Fixed Amount: $${data.platformFee.total || 0}`}
            </p>
          </div>
        )}
      </div>

      {/* Transaction Fee */}
      <div className="mb-6">
        <p className="font-medium mb-2">Transaction Fee</p>
        {isEdit ? (
          <div className="flex gap-4 items-center mb-2">
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
              className="border px-2 py-1 rounded"
            >
              <option value="percent">Percentage</option>
              <option value="total">Fixed Amount</option>
            </select>
            <div className="flex-1">
              <input
                type="number"
                className="border px-2 py-1 w-full"
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
        ) : (
          <div className="flex justify-between">
            <p>
              {transactionMode === "percent" 
                ? `Percentage: ${data.transactionFee.percent || 0}%` 
                : `Fixed Amount: $${data.transactionFee.total || 0}`}
            </p>
          </div>
        )}
      </div>

      {isEdit && (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default EFTSettings;