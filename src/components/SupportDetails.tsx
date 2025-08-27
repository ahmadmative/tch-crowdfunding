import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL, SOCKET_URL } from "../config/url";
import { toast } from "react-toastify";
import { ArrowLeftFromLine, MessageCircle, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
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
  status: string;
  lastReplyAt?: string | null;
  replyCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface SupportReply {
  _id: string;
  supportTicketId: string;
  sender: "admin" | "user";
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  isHtml: boolean;
  templateId?: {
    _id: string;
    subject: string;
  };
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TicketData {
  ticket: SupportTicket;
  replies: SupportReply[];
  totalReplies: number;
}

const SupportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendReply = async (subject: string, message: string, templateId?: string, isHtml?: boolean) => {
    setIsSending(true);
    try {
      const response = await axios.post(`${BASE_URL}/support/${id}/reply`, {
        subject,
        message,
        senderName: "Admin", // You might want to get this from user context
        senderEmail: "admin@support.com", // You might want to get this from user context
        isHtml: isHtml || false,
        templateId: templateId || null,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Reply sent:", response.data);
      toast.success("Reply sent successfully!");
      
      // Update the ticket status locally if provided in response
      if (response.data.updatedTicket && data) {
        setData(prevData => ({
          ...prevData!,
          ticket: {
            ...prevData!.ticket,
            status: response.data.updatedTicket.status,
            lastReplyAt: response.data.updatedTicket.lastReplyAt,
            replyCount: response.data.updatedTicket.replyCount
          }
        }));
      }
      
      // Refresh the ticket data to show the new reply
      await fetchTicketWithReplies();
      
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setIsSending(false);
      setIsModalOpen(false);
    }
  };

  const fetchTicketWithReplies = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/support/${id}/with-replies`);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    
    // Handle different date formats
    let date: Date;
    if (typeof dateString === 'string') {
      // Try parsing ISO string or other formats
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return 'Invalid Date';
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatRelativeDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'spam': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  useEffect(() => {
    fetchTicketWithReplies();
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

  const { ticket, replies } = data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        to="/support"
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeftFromLine className="w-4 h-4 mr-2" /> Back to tickets
      </Link>

      {isModalOpen && (
        <ReplyModal
          email={email}
          ticketData={{
            _id: ticket._id,
            firstName: ticket.firstName,
            lastName: ticket.lastName,
            subject: ticket.subject
          }}
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendReply}
          isLoading={isSending}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Conversation Thread */}
        <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Ticket Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{ticket.subject}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {ticket.firstName} {ticket.lastName}
                    </span>
                                        <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatRelativeDate(ticket.createdAt)}
            </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
            </div>
          </div>

            {/* Conversation Thread */}
            <div className="p-6">
              {/* Original Message */}
          <div className="mb-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
            </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {ticket.firstName} {ticket.lastName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {ticket.query}
          </div>

                      {/* Attachments */}
                      {(ticket.image || ticket.file) && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex flex-wrap gap-3">
                            {ticket.image && (
                              <div className="border rounded p-2 bg-white">
                                <p className="text-xs font-medium mb-1">Image</p>
                                <img
                                  src={`${SOCKET_URL}/${ticket.image}`}
                      alt="Support ticket attachment"
                                  className="max-w-xs max-h-20 object-contain rounded"
                    />
                    <a
                                  href={`${SOCKET_URL}/${ticket.image}`}
                      download
                                  className="text-blue-600 text-xs hover:underline block mt-1"
                    >
                      Download
                    </a>
                  </div>
                )}
                            {ticket.file && (
                              <div className="border rounded p-2 bg-white">
                                <p className="text-xs font-medium mb-1">File</p>
                                <div className="text-gray-800 text-xs mb-1">
                                  {ticket.file.split("/").pop()}
                    </div>
                    <a
                                  href={`${SOCKET_URL}/${ticket.file}`}
                      download
                                  className="text-blue-600 text-xs hover:underline"
                    >
                                  Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {replies.map((reply, index) => (
                <div key={reply._id} className="mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        reply.sender === 'admin' 
                          ? 'bg-green-100' 
                          : 'bg-blue-100'
                      }`}>
                        {reply.sender === 'admin' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <User className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`rounded-lg p-4 ${
                        reply.sender === 'admin' 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {reply.senderName}
                            </h3>
                            {reply.sender === 'admin' && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Admin
                              </span>
                            )}
                            {reply.templateId && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Template
                              </span>
                            )}
                          </div>
                                                  <span className="text-xs text-gray-500">
                          {formatRelativeDate(reply.createdAt)}
                        </span>
                        </div>
                        
                        <div className="text-sm font-medium text-gray-800 mb-2">
                          Subject: {reply.subject}
                        </div>
                        
                        <div className="text-sm text-gray-700">
                          {reply.isHtml ? (
                            <div 
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: reply.message }}
                            />
                          ) : (
                            <div className="whitespace-pre-line">
                              {reply.message}
                            </div>
                          )}
                        </div>

                        {reply.readAt && (
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Read on {formatDate(reply.readAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Reply Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
                    setEmail(ticket.email);
              setIsModalOpen(true);
            }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Reply to Ticket
          </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Ticket Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Ticket Information</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Sender Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sender Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-sm text-gray-800">
                      {ticket.firstName} {ticket.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm text-gray-800">{ticket.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm text-gray-800">{ticket.phone}</p>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Ticket Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-sm text-gray-800">{ticket.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Project Type</p>
                    <p className="text-sm text-gray-800">
                      {ticket.existingProject ? "Existing Project" : "New Project"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm text-gray-800">{formatDate(ticket.createdAt)}</p>
                  </div>
                  {ticket.lastReplyAt && (
                    <div>
                      <p className="text-sm text-gray-500">Last Reply</p>
                      <p className="text-sm text-gray-800">{formatDate(ticket.lastReplyAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Replies</span>
                    <span className="text-sm text-gray-800">{replies.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Admin Replies</span>
                    <span className="text-sm text-gray-800">
                      {replies.filter(r => r.sender === 'admin').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User Replies</span>
                    <span className="text-sm text-gray-800">
                      {replies.filter(r => r.sender === 'user').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SupportDetails };
export default SupportDetails;