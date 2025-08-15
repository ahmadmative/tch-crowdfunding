import React, { useEffect, useState, useTransition } from "react";
import { useLocation, useParams } from "react-router-dom";
import DonationForm from "../components/donation/DonationForm";
import DonorCard from "../components/donation/DonorCard";
import { BASE_URL } from "../config/url";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ArrowLeft, User } from "lucide-react";

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"Hot" | "All">("Hot");
  const [admin, setAdmin] = useState(false);
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");
  const [campaigner, setCampaigner] = useState(false);
  const [dropDownStatus, setDropDownStatus] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    const pathArray = path.split("/");
    if (pathArray.includes("admin")) {
      setAdmin(true);
    } else if (pathArray.includes("user")) {
      setCampaigner(true);
    }
  }, [location]);

  const handleStatusChange = async () => {
    console.log(status);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await axios.put(
          `${BASE_URL}/campaigns/updateStatus/${id}`,
          { status: dropDownStatus },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res);
        setStatus(dropDownStatus);
        toast.success("Campaign status updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update campaign status");
      }
    });
  };

  const handleVerifyToggle = async () => {
    if (isVerified) return; // Don't allow un-verification
    
    setIsVerifying(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/campaigns/verify/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      setIsVerified(true);
      toast.success("Campaign verified successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify campaign");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await axios.get(`${BASE_URL}/campaigns/get/${id}`);
      setCampaign(response.data);
      setRaised(response.data.totalDonations);
      setGoal(response.data.amount);
      const progress =
        (response.data.totalDonations / response.data.amount) * 100;
      setProgress(progress);
      console.log(response.data);
      console.log(response.data.totalDonations);
      setStatus(response.data.status);
      setIsVerified(response.data.verified || false);
    };
    fetchCampaign();
  }, [id]);

  if (!campaign)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto p-4 flex md:flex-row flex-col gap-5 justify-between pt-[40px] overflow-x-hidden font-sans">
      <Link to={"/campaigns"}>
        <ArrowLeft className="w-6 h-6 text-black" />
      </Link>
      {/* top section */}
      <div className="flex justify-between md:w-[75%] w-full">
        <div className="flex flex-col bg-white p-4 border border-gray-400 rounded-xl">
          {/* image section */}
          <div className="relative flex items-center border border-b-gray-400 mb-4 gap-2 rounded-xl overflow-hidden">
            <img
              src={campaign?.image}
              alt="arrow-left"
              className="w-full h-full rounded-lg"
            />

            {/* gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-white to-transparent flex items-end p-4">
              {/* Progress Bar */}
              <div className="w-full pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-gray-600" />
                    <p className="text-xs font-bold text-black">
                      {campaign?.city}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-black text-right mb-1">
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
            </div>
          </div>

          {/* basic details section */}
          <div className="flex md:flex-row bg-white p-4 border border-gray-200 rounded-xl flex-col items-center justify-between gap-2">
            {/* avatar and location section */}

            <div className="flex items-center gap-2 h-[50px]">
              {campaign?.userDetails?.[0]?.profilePicture ? (
                <img
                  src={campaign.userDetails[0].profilePicture}
                  alt="UP"
                  className="w-[50px] h-full rounded-md"
                />
              ) : (
                <User className="w-[50px] h-full rounded-md" />
              )}


              <div className="flex flex-col h-full justify-between">
                <p className="text-normal font-bold text-black font-onest">
                  {campaign?.userDetails[0]?.name}
                </p>

                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-gray-600" />
                  <p className="text-xs font-bold text-gray-600 font-onest">
                    {dayjs(campaign?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>

            {/* funds required section */}
            <div className="flex flex-col items-center gap-2">
              <p className=" font-bold text-black font-onest">Required Funds</p>
              <p className="text-gray-900 font-bold text-2xl font-onest">
                R{campaign?.amount}
              </p>
            </div>
          </div>

          {/* campaign details section */}

          <div className="flex flex-col gap-2 py-6">
            {/* title & story section */}
            <div className="flex flex-col">
              <p className="text-sm font-bold text-black py-2 font-onest">
                {campaign?.title}
              </p>
              <p className="text-xs text-gray-600 leading-6">
                {campaign?.story}
              </p>
            </div>

            {/* goal section */}
            <div className="flex flex-col">
              <p className="text-sm font-bold text-black py-2 font-onest">
                Our Challenge & Goal
              </p>
              <p className="text-xs text-gray-600 leading-6">
                {campaign?.goal}
              </p>
            </div>
          </div>
          {admin && (
            <>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Start Date:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.startDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  End Date:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.endDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Posted on:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.createdAt).format("DD-MM-YYYY")}
                </p>
                <p className="text-sm font-bold text-black py-2 font-onest">
                  at
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.createdAt).format("HH:mm")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Status:
                </p>
                <p
                  className={`flex items-center justify-center text-sm font-bold py-1 font-onest rounded-full px-4 ${
                    status === "active"
                      ? "bg-green-400 text-green-800"
                      : status === "cancelled"
                      ? "bg-red-500 text-red-800"
                      : status === "pending"
                      ? "bg-yellow-500 text-yellow-900"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {status}
                </p>
              </div>

              <div className="flex items-center gap-4 py-2">
                <p className="text-sm font-bold text-black font-onest">
                  Verification:
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isVerified ? 'text-green-600' : 'text-gray-500'}`}>
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
                  {isVerifying && <span className="text-xs text-gray-500">Verifying...</span>}
                </div>
              </div>
            </>
          )}

          <div className="w-full p-4">
            <p className="text-sm font-bold text-black py-2 font-onest">
              Admin Actions:
            </p>

            <div className="flex  items-center justify-between gap-3">
              {/* Dropdown */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="action"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Action
                </label>

                <select
                  id="action"
                  name="action"
                  onChange={(e) => setDropDownStatus(e.target.value)}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                >
                  <option value="">Select Action</option>
                  <option value="active">Approve</option>
                  <option value="cancelled">Reject</option>
                  <option value="inactive">Pause</option>
                </select>
                <button
                  className="bg-gray-900  mt-4 flex items-center justify-center text-white px-4 py-2 rounded-full text-sm font-bold h-[40px] shadow-md hover:scale-105 transition-transform  duration-300"
                  onClick={handleStatusChange}
                >
                  Apply Changes
                </button>
              </div>

              {/* Edit Button */}
              <Link
                to={`/admin/campaigns/${id}/edit`}
                className="bg-gray-900 w-[100px] flex items-center justify-center text-white px-4 py-2 rounded-full text-sm font-bold h-[40px] shadow-md hover:scale-105 transition-transform  duration-300"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* donors section */}
      <div className="flex flex-col md:w-[25%] w-full">
        <p className="text-sm font-bold text-black py-2 font-onest">
          Donations
        </p>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] scrollbar-hide border border-gray-300 rounded-lg p-4">
          {/* filter section */}
          <div className="flex items-center gap-2 p-2">
            {["Hot", "All"].map((tab) => (
              <p
                key={tab}
                className={`text-sm font-bold cursor-pointer px-4 py-1 rounded-full transition-all duration-300 
                                ${
                                  activeTab === tab
                                    ? "bg-gray-900 text-white"
                                    : "bg-white border border-gray-300 text-gray-600"
                                }`}
                onClick={() => setActiveTab(tab as "Hot" | "All")}
              >
                {tab}
              </p>
            ))}
          </div>

          <p>{campaign?.donations?.donorDetails?.length}</p>
          {/* card */}
          {campaign?.donations.map((donor: any) => (
            <DonorCard key={donor._id} donor={donor} />
          ))}
        </div>
      </div>

      {/* details section */}
    </div>
  );
};

export default CampaignDetails;
