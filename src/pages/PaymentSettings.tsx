import React, { useState } from "react";
import CardsSettings from "../components/paymentSettings/CardsSettings";
import EFTSettings from "../components/paymentSettings/EFTSettings";
import { CreditCard, Landmark } from "lucide-react";

const PaymentSettings = () => {
  const [tab, setTab] = useState("EFTPayment");

  const tabs = [
    {
      id: "CardsSettings",
      label: "Card Payment",
      icon: CreditCard,
      description: "Configure credit and debit card payment fees"
    },
    {
      id: "EFTPayment", 
      label: "EFT Payment",
      icon: Landmark,
      description: "Set up electronic funds transfer settings"
    }
  ];

  return (
    <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4 sm:p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Payment Settings
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Configure payment processing fees and settings for your platform
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {tabs.map((tabItem) => {
              const IconComponent = tabItem.icon;
              return (
                <button
                  key={tabItem.id}
                  className={`
                    w-full sm:w-auto flex items-center justify-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 min-w-[200px]
                    ${tab === tabItem.id
                      ? "bg-blue-500 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102"
                    }
                  `}
                  onClick={() => setTab(tabItem.id)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Description */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              {tabs.find(t => t.id === tab)?.description}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300 ease-in-out">
          {tab === "CardsSettings" && <CardsSettings />}
          {tab === "EFTPayment" && <EFTSettings />}
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
