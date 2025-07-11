import React, { useState } from "react";
import CardsSettings from "../components/paymentSettings/CardsSettings";
import EFTSettings from "../components/paymentSettings/EFTSettings";

const PaymentSettings = () => {
  const [tab, setTab] = useState("EFTPayment");

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <p className="text-xl font-semibold mb-4">Payment Settings</p>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === "CardsSettings" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("CardsSettings")}
        >
          Card Payment
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "EFTPayment" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("EFTPayment")}
        >
          EFT
        </button>
      </div>

      {tab === "CardsSettings" && <CardsSettings />}
      {tab === "EFTPayment" && <EFTSettings />}
    </div>
  );
};

export default PaymentSettings;
