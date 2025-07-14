import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";

// Types
interface Fee {
  percent: number | string;
  total: number | string;
}

interface PaymentSettings {
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
      const res = await axios.get<{ data?: PaymentSettings }>(`${BASE_URL}/payment-settings?type=eft`);
      if (res.data.data) {
        setData(res.data.data);
        // Determine which mode was previously used
        if (res.data.data.platformFee.percent !== "") {
          setPlatformMode("percent");
        } else if (res.data.data.platformFee.total !== "") {
          setPlatformMode("total");
        }
        if (res.data.data.transactionFee.percent !== "") {
          setTransactionMode("percent");
        } else if (res.data.data.transactionFee.total !== "") {
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

      await axios.post(`${BASE_URL}/payment-settings`, payload);
      toast.success("EFT settings updated");
      setEdit(false);
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
              onChange={(e) => setPlatformMode(e.target.value as "percent" | "total")}
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
                      percent: platformMode === "percent" ? +e.target.value : "",
                      total: platformMode === "total" ? +e.target.value : "",
                    },
                  })
                }
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <p>{platformMode === "percent" 
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
              onChange={(e) => setTransactionMode(e.target.value as "percent" | "total")}
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
                      percent: transactionMode === "percent" ? +e.target.value : "",
                      total: transactionMode === "total" ? +e.target.value : "",
                    },
                  })
                }
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <p>{transactionMode === "percent" 
              ? `Percentage: ${data.transactionFee.percent || 0}%` 
              : `Fixed Amount: $${data.transactionFee.total || 0}`}
            </p>
          </div>
        )}
      </div>

      {isEdit && (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default EFTSettings;