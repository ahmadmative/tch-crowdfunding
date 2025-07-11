import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";

// ✅ Types
interface Fee {
  percent: number | string;
  total: number | string;
}

interface PaymentSettings {
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
      const res = await axios.get<{ data?: PaymentSettings }>(`${BASE_URL}/payment-settings`);
      if (res.data.data) {
        setData(res.data.data);
      } else {
        // If no data, keep defaults
        setData({
          paymentType: "card",
          platformFee: { percent: "", total: "" },
          transactionFee: { percent: "", total: "" },
        });
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
      toast.success("Payment settings updated");
      setEdit(false);
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
        {isEdit && (
          <div className="flex gap-4 mb-2">
            <label>
              <input
                type="radio"
                checked={platformMode === "percent"}
                onChange={() => setPlatformMode("percent")}
              />{" "}
              Percent
            </label>
            <label>
              <input
                type="radio"
                checked={platformMode === "total"}
                onChange={() => setPlatformMode("total")}
              />{" "}
              Total
            </label>
          </div>
        )}

        <div className="flex justify-between">
          {isEdit ? (
            <>
              <input
                type="number"
                className="border px-2 py-1 w-20"
                disabled={platformMode !== "percent"}
                value={data.platformFee.percent}
                onChange={(e) =>
                  setData({
                    ...data,
                    platformFee: {
                      ...data.platformFee,
                      percent: +e.target.value,
                      total: platformMode === "total" ? "" : data.platformFee.total,
                    },
                  })
                }
              />
              <input
                type="number"
                className="border px-2 py-1 w-20"
                disabled={platformMode !== "total"}
                value={data.platformFee.total}
                onChange={(e) =>
                  setData({
                    ...data,
                    platformFee: {
                      ...data.platformFee,
                      total: +e.target.value,
                      percent: platformMode === "percent" ? "" : data.platformFee.percent,
                    },
                  })
                }
              />
            </>
          ) : (
            <>
              <p>Percent: {data.platformFee.percent || 0}%</p>
              <p>Total: ${data.platformFee.total || 0}</p>
            </>
          )}
        </div>
      </div>

      {/* Transaction Fee */}
      <div className="mb-6">
        <p className="font-medium mb-2">Transaction Fee</p>
        {isEdit && (
          <div className="flex gap-4 mb-2">
            <label>
              <input
                type="radio"
                checked={transactionMode === "percent"}
                onChange={() => setTransactionMode("percent")}
              />{" "}
              Percent
            </label>
            <label>
              <input
                type="radio"
                checked={transactionMode === "total"}
                onChange={() => setTransactionMode("total")}
              />{" "}
              Total
            </label>
          </div>
        )}

        <div className="flex justify-between">
          {isEdit ? (
            <>
              <input
                type="number"
                className="border px-2 py-1 w-20"
                disabled={transactionMode !== "percent"}
                value={data.transactionFee.percent}
                onChange={(e) =>
                  setData({
                    ...data,
                    transactionFee: {
                      ...data.transactionFee,
                      percent: +e.target.value,
                      total: transactionMode === "total" ? "" : data.transactionFee.total,
                    },
                  })
                }
              />
              <input
                type="number"
                className="border px-2 py-1 w-20"
                disabled={transactionMode !== "total"}
                value={data.transactionFee.total}
                onChange={(e) =>
                  setData({
                    ...data,
                    transactionFee: {
                      ...data.transactionFee,
                      total: +e.target.value,
                      percent: transactionMode === "percent" ? "" : data.transactionFee.percent,
                    },
                  })
                }
              />
            </>
          ) : (
            <>
              <p>Percent: {data.transactionFee.percent || 0}%</p>
              <p>Total: ${data.transactionFee.total || 0}</p>
            </>
          )}
        </div>
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

export default CardsSettings;
