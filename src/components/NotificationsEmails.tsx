import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BellIcon, EnvelopeIcon, DocumentDuplicateIcon, MagnifyingGlassIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';
import EmailTemplateEditorModal from './templates/Editor';
import AdminMailModal from './AdminMails/AdminMailModal';
import axios from 'axios';
import { BASE_URL } from '../config/url';
import dayjs from 'dayjs';
import TemplatesComponent from './templates/Templates';
import { Link } from 'react-router-dom';


const notificationsData = [
  {
    id: 1,
    type: 'donation',
    title: 'New Large Donation',
    message: 'R5,000 donation received for Save the Forests campaign',
    timestamp: '2 hours ago',
    status: 'unread',
  },
  {
    id: 2,
    type: 'milestone',
    title: 'Campaign Milestone Reached',
    message: 'Clean Water Initiative has reached 80% of its goal',
    timestamp: '4 hours ago',
    status: 'read',
  },
  {
    id: 3,
    type: 'approval',
    title: 'Campaign Approved',
    message: 'Education for All campaign has been approved',
    timestamp: '1 day ago',
    status: 'read',
  },
];



const NotificationsEmails: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('stats');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [templates, setTemplates] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const pathname = location.pathname;
  const roles = ["center", "emails", "templates"]

  useEffect(() => {
    const fetchTempaltes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/template/all`);
        console.log(res.data);
        setTemplates(res.data);

      } catch (error) {
        setError("Error fetching templates");
      } finally {
        setLoading(false);
      }
    }

    fetchTempaltes();

  }, [])



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}(token expired), please SignIn again</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-6">


      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('stats')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'stats'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Statistics
          </button>
         
          <button
            onClick={() => setSelectedTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === 'templates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Template Library
          </button>
        </nav>
      </div>

      {
        selectedTab === 'stats' && (
          <>
            {/* Page Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Notifications & Emails</h1>
              <button onClick={() => setIsEmailModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Compose Email
              </button>
            </div>

            <AdminMailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Total Emails Sent</h3>
                <p className="text-3xl font-bold text-primary-600">12,847</p>
                <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Average Open Rate</h3>
                <p className="text-3xl font-bold text-green-600">72%</p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-green-500">↑ 5%</span> vs. last month
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Click-through Rate</h3>
                <p className="text-3xl font-bold text-blue-600">28%</p>
                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-green-500">↑ 3%</span> vs. last month
                </p>
              </div>
            </div>
          </>
        )
      }

      {/* Notification Center Tab */}
      {selectedTab === 'center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
              <div className="space-y-4">
                {notificationsData.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg ${notification.status === 'unread' ? 'bg-primary-50' : 'bg-gray-50'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                      </div>
                      {notification.status === 'unread' && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Donation Alerts</p>
                    <p className="text-sm text-gray-600">Notify when new donations are received</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Campaign Milestones</p>
                    <p className="text-sm text-gray-600">Notify when campaigns reach milestones</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Campaign Approvals</p>
                    <p className="text-sm text-gray-600">Notify when campaigns need approval</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      

      {/* Template Library Tab */}
      {selectedTab === 'templates' && (
        <div className="space-y-6">
          <EmailTemplateEditorModal
            isOpen={isTemplateModalOpen}
            onClose={() => setIsTemplateModalOpen(false)}
          />

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex  justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <Link
                to={"/builder"}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Template
              </Link>
              {/* <EmailTemplateEditorModal/> */}
            </div>
            <TemplatesComponent templates={templates} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Template Variables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Donor Variables</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code>{`{donor_name}`}</code> - Full name of the donor</li>
                  <li><code>{`{donation_amount}`}</code> - Donation amount</li>
                  <li><code>{`{donation_date}`}</code> - Date of donation</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Campaign Variables</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><code>{`{campaign_name}`}</code> - Name of the campaign</li>
                  <li><code>{`{campaign_goal}`}</code> - Campaign fundraising goal</li>
                  <li><code>{`{progress_percentage}`}</code> - Progress towards goal</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsEmails; 