import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";

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
        toast.success("Payment settings updated");
      } else {
        await axios.post(`${BASE_URL}/payment-settings`, payload);
        toast.success("Payment settings created");
      }

      setEdit(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to update payment settings");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-md bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">Cards Settings</p>
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

export default CardsSettings;
