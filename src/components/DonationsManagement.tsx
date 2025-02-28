import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EyeIcon, ArrowPathIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'react-router-dom';

// Mock data for the charts
const donationTrendsData = [
  { date: '2024-01', amount: 25000 },
  { date: '2024-02', amount: 45000 },
  { date: '2024-03', amount: 38000 },
  { date: '2024-04', amount: 52000 },
  { date: '2024-05', amount: 48000 },
  { date: '2024-06', amount: 65000 },
];

const paymentMethodsData = [
  { name: 'Credit Card', value: 60, color: '#0ea5e9' },
  { name: 'PayPal', value: 25, color: '#22c55e' },
  { name: 'Bank Transfer', value: 10, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#6366f1' },
];

const topCampaignsData = [
  { name: 'Save the Forests', amount: 85000 },
  { name: 'Clean Water Initiative', amount: 72000 },
  { name: 'Education for All', amount: 65000 },
  { name: 'Healthcare Access', amount: 58000 },
  { name: 'Food Security Program', amount: 45000 },
];

// Mock data for transactions
const transactionsData = [
  {
    id: 1,
    donor: 'John Smith',
    amount: 1000,
    campaign: 'Save the Forests',
    paymentMethod: 'Credit Card',
    status: 'Successful',
    date: '2024-02-27 14:30',
  },
  {
    id: 2,
    donor: 'Sarah Johnson',
    amount: 500,
    campaign: 'Clean Water Initiative',
    paymentMethod: 'PayPal',
    status: 'Successful',
    date: '2024-02-27 12:15',
  },
  {
    id: 3,
    donor: 'Mike Brown',
    amount: 250,
    campaign: 'Education for All',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    date: '2024-02-27 10:45',
  },
  {
    id: 4,
    donor: 'Emily Davis',
    amount: 750,
    campaign: 'Healthcare Access',
    paymentMethod: 'Credit Card',
    status: 'Failed',
    date: '2024-02-27 09:30',
  },
];

const DonationsManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('transactions');
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const location = useLocation();
  const pathname = location.pathname;
  const roles=  ["transactions", "payments", "logs", "settings"]

  useEffect(() => {
    console.log(pathname)
    const urlRole = pathname.split('/').pop();
    if (urlRole && roles.includes(urlRole)) {
      setSelectedTab(urlRole);
    }
  }, [pathname]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Donations Management</h1>
        <div className="flex space-x-4">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Download Reports
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-3xl font-bold text-primary-600">$273,000</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-500">↑ 15%</span> from last month
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Successful Transactions</h3>
          <p className="text-3xl font-bold text-green-600">1,156</p>
          <p className="text-sm text-gray-600 mt-2">95.2% success rate</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Failed Transactions</h3>
          <p className="text-3xl font-bold text-red-600">58</p>
          <p className="text-sm text-gray-600 mt-2">4.8% failure rate</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Average Donation</h3>
          <p className="text-3xl font-bold text-blue-600">$236</p>
          <p className="text-sm text-gray-600 mt-2">Per transaction</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Donation Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donationTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#0ea5e9" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Campaigns</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCampaignsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="amount" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              (selectedTab === 'transactions' || selectedTab === 'settings')
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transaction List
          </button>
          <button
            onClick={() => setSelectedTab('payments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'payments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payment Settings
          </button>
          <button
            onClick={() => setSelectedTab('logs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'logs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Receipt Logs
          </button>
        </nav>
      </div>

      {/* Transactions Table */}
      {(selectedTab === 'transactions' || selectedTab === 'settings') && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Transaction List</h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Payment Methods</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank-transfer">Bank Transfer</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Statuses</option>
                  <option value="successful">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Campaign</th>
                    <th className="text-left py-3 px-4">Payment Method</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-3 px-4">{transaction.donor}</td>
                      <td className="py-3 px-4">${transaction.amount}</td>
                      <td className="py-3 px-4">{transaction.campaign}</td>
                      <td className="py-3 px-4">{transaction.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{transaction.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-gray-600 hover:text-gray-800">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <ArrowPathIcon className="h-5 w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <DocumentArrowDownIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing 1 to 10 of 1,214 transactions
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
                <button className="px-3 py-1 border rounded bg-primary-600 text-white">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {selectedTab === 'payments' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Payment Processing Settings</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Gateway Settings */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Payment Gateways</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Stripe</p>
                      <p className="text-sm text-gray-600">Credit Card Processing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">PayPal</p>
                      <p className="text-sm text-gray-600">PayPal Integration</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recurring Donations Settings */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Recurring Donations</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Enable Recurring Donations</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Allow Donor Cancellation</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" checked />
                    <span>Send Renewal Notifications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="flex justify-end mt-6">
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Logs */}
      {selectedTab === 'logs' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Receipt Logs</h2>
          <div className="space-y-4">
            {transactionsData.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{transaction.donor}</p>
                  <p className="text-sm text-gray-600">
                    ${transaction.amount} - {transaction.campaign}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-primary-600 hover:text-primary-800">
                    Download
                  </button>
                  <button className="px-3 py-1 text-primary-600 hover:text-primary-800">
                    Resend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManagement; 