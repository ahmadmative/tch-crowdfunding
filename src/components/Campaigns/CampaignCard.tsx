import React, { useState, useTransition } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import Notification from "../notification/Notification";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

dayjs.extend(relativeTime); // ✅ This is required to enable `fromNow()`

interface Campaign {
  _id: string;
  image: string;
  title: string;
  description: string;
  city: string;
  createdAt: string;
  amount: number;
  totalDonations: number;
  lastDonationDate: string;
  verified: boolean;
}

const CampaignCard: React.FC<{
  campaign: Campaign;
  admin?: boolean;
  campaigner?: boolean;
}> = ({ campaign, admin = false, campaigner = false }) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);
  const [isVerified, setIsVerified] = useState(campaign.verified);
  const [isVerifying, setIsVerifying] = useState(false);
  const raised = campaign.totalDonations;
  const goal = campaign.amount;
  const progress = (raised / goal) * 100;

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await axios.delete(
          `${BASE_URL}/campaigns/delete/${campaign._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res);
        setIsDeleted(true);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleVerifyToggle = async () => {
    if (isVerified) return; // Don't allow un-verification
    
    setIsVerifying(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/campaigns/verify/${campaign._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      setIsVerified(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="font-sans flex flex-col border border-[#020D1914] p-4 gap-4 rounded-lg overflow-hidden max-w-[400px] hover:shadow-lg hover:border-gray-900 transition-all duration-300">
      {isDeleted && (
        <Notification
          isOpen={isDeleted}
          onClose={() => setIsDeleted(false)}
          title="Success"
          message="Campaign deleted successfully"
        />
      )}

      {/* Campaign Image */}
      <img
        src={campaign.image}
        alt="campaign-card"
        className="w-full h-[200px] object-cover rounded-lg"
      />

      {/* Campaign Title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold font-onest">{campaign.title}</p>
          {admin && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${isVerified ? 'text-green-600' : 'text-gray-500'}`}>
                {isVerified ? 'Verified' : 'Unverified'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={handleVerifyToggle}
                  disabled={isVerified || isVerifying}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
              </label>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {campaign.description.split(" ").slice(0, 15).join(" ")}
          {campaign.description.split(" ").length > 15 && "..."}
        </p>
      </div>

      {/* Campaign Details */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-gray-600" />
          <p className="text-xs font-bold">{campaign.city}</p>
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-600" />
          <p className="text-xs font-bold">
            {dayjs(campaign.createdAt).fromNow()}
          </p>
         
        </div>
      </div>

      <p className="text-xs font-bold">
        Last Donation :{" "}
        <span className="text-xs text-gray-500 font-normal">
          {campaign.lastDonationDate
            ? dayjs(campaign.lastDonationDate).fromNow()
            : "No donations yet"}
        </span>
      </p>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-end">
          <p className="text-sm font-bold text-gray-900">
            {Number(progress).toFixed(2)}% Funded
          </p>
        </div>

        <progress
          value={raised}
          max={goal}
          className="w-full h-2 rounded-full 
                        [&::-webkit-progress-bar]:bg-gray-300 
                        [&::-webkit-progress-value]:bg-gray-900 
                        [&::-moz-progress-bar]:bg-gray-900"
        />
      </div>

      {/* {!admin && !campaigner && (
        <div className="flex items-center justify-center">
          <Link
            to={`/home/campaigns/${campaign._id}`}
            className="bg-gray-900 text-center hover:bg-gray-700 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-full w-full"
          >
            Donate Now
          </Link>
        </div>
      )} */}

      {admin && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-center text-gray-900 disabled:opacity-50 border border-gray-900 transition-colors duration-200 hover:text-gray-700 font-semibold px-4 py-2 rounded-full w-full"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <Link
            to={`/admin/campaigns/${campaign._id}`}
            className="bg-gray-900 text-center hover:bg-gray-700 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-full w-full"
          >
            Preview
          </Link>
        </div>
      )}

      {campaigner && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-center text-gray-900 disabled:opacity-50 border border-gray-700 transition-colors duration-200 hover:text-black font-semibold px-4 py-2 rounded-full w-full"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <Link
            to={`/user/dashboard/campaigns/${campaign._id}`}
            className="bg-gray-900 text-center hover:bg-gray-700 transition-colors duration-200 text-black font-semibold px-4 py-2 rounded-full w-full"
          >
            Preview
          </Link>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
