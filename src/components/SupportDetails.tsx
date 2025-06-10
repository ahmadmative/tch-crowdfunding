import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL, SOCKET_URL } from "../config/url";
import { toast } from "react-toastify";
import { ArrowLeftFromLine } from "lucide-react";
import ReplyModal from "./support/ReplyModal";

interface SupportTicket {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  existingProject: boolean;
  department: string;
  subject: string;
  query: string;
  image?: string | null;
  file?: string | null;
  __v: number;
}

const SupportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendReply = async (subject: string, message: string) => {
    setIsSending(true);
    try {
      await axios.post(`${BASE_URL}/notifications/email`, { email, subject, message }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Sending reply to:", { subject, message });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } finally {
      setIsSending(false);
      setIsModalOpen(false);
    }
  };

  const fetchTicket = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/support/${id}`);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Ticket not found</p>
        <Link
          to="/support"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to support tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/support"
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeftFromLine /> Back to tickets
      </Link>

      {isModalOpen && (
        <ReplyModal
          email={email}
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendReply}
          isLoading={isSending}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">{data.subject}</h1>
          <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600">
            <span className="mr-4">
              <span className="font-medium">Department:</span> {data.department}
            </span>
            <span className="mr-4">
              <span className="font-medium">Status:</span>{" "}
              {data.existingProject ? "Existing Project" : "New Project"}
            </span>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Sender Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-800">
                  {data.firstName} {data.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{data.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{data.phone}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Message</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p className="whitespace-pre-line text-gray-800">{data.query}</p>
            </div>
          </div>

          {(data.image || data.file) && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Attachments
              </h2>
              <div className="flex flex-wrap gap-4">
                {data.image && (
                  <div className="border rounded p-3">
                    <p className="text-sm font-medium mb-2">Image</p>
                    <img
                      src={`${SOCKET_URL}/${data.image}`}
                      alt="Support ticket attachment"
                      className="max-w-xs max-h-40 object-contain"
                    />
                    <a
                      href={`${SOCKET_URL}/${data.image}`}
                      download
                      className="text-blue-600 text-sm hover:underline block mt-2"
                    >
                      Download
                    </a>
                  </div>
                )}
                {data.file && (
                  <div className="border rounded p-3">
                    <p className="text-sm font-medium mb-2">File</p>
                    <div className="text-gray-800 mb-2">
                      {data.file.split("/").pop()}
                    </div>
                    <a
                      href={`${SOCKET_URL}/${data.file}`}
                      download
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Open
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setEmail(data.email);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportDetails;
