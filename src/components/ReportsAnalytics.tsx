import React, { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, DocumentArrowDownIcon, ClockIcon } from '@heroicons/react/24/outline';

// Mock data for the charts
const fundraisingTrendsData = [
  { month: 'Jan', amount: 25000, donors: 150 },
  { month: 'Feb', amount: 45000, donors: 280 },
  { month: 'Mar', amount: 38000, donors: 220 },
  { month: 'Apr', amount: 52000, donors: 310 },
  { month: 'May', amount: 48000, donors: 290 },
  { month: 'Jun', amount: 65000, donors: 380 },
];

const donorDistributionData = [
  { name: 'Recurring Donors', value: 65, color: '#0ea5e9' },
  { name: 'One-time Donors', value: 35, color: '#6366f1' },
];

const topCampaignsData = [
  { name: 'Save the Forests', amount: 85000 },
  { name: 'Clean Water Initiative', amount: 72000 },
  { name: 'Education for All', amount: 65000 },
  { name: 'Healthcare Access', amount: 58000 },
  { name: 'Food Security Program', amount: 45000 },
];

// Mock data for scheduled reports
const scheduledReportsData = [
  {
    id: 1,
    name: 'Monthly Campaign Performance',
    frequency: 'Monthly',
    recipients: ['admin@example.com', 'manager@example.com'],
    nextRun: '2024-03-01',
  },
  {
    id: 2,
    name: 'Weekly Donor Activity',
    frequency: 'Weekly',
    recipients: ['admin@example.com'],
    nextRun: '2024-02-29',
  },
  {
    id: 3,
    name: 'Quarterly Financial Summary',
    frequency: 'Quarterly',
    recipients: ['finance@example.com', 'admin@example.com'],
    nextRun: '2024-04-01',
  },
];

const ReportsAnalytics: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('campaign');
  const [dateRange, setDateRange] = useState('last30');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Donations</h3>
          <p className="text-3xl font-bold text-primary-600">$273,000</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-500">↑ 15%</span> vs. previous period
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Active Donors</h3>
          <p className="text-3xl font-bold text-green-600">1,630</p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="text-green-500">↑ 8%</span> vs. previous period
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Campaign Success Rate</h3>
          <p className="text-3xl font-bold text-blue-600">92%</p>
          <p className="text-sm text-gray-600 mt-2">Based on goal achievement</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Average Donation</h3>
          <p className="text-3xl font-bold text-purple-600">$168</p>
          <p className="text-sm text-gray-600 mt-2">Per donor</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('campaign')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'campaign'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Campaign Performance
          </button>
          <button
            onClick={() => setSelectedTab('donor')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'donor'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Donor Insights
          </button>
          <button
            onClick={() => setSelectedTab('custom')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'custom'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Custom Reports
          </button>
        </nav>
      </div>

      {/* Campaign Performance Tab */}
      {selectedTab === 'campaign' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Fundraising Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fundraisingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" name="Amount ($)" stroke="#0ea5e9" />
                    <Line type="monotone" dataKey="donors" name="Donors" stroke="#6366f1" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Campaigns</h3>
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

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Metrics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Campaign</th>
                    <th className="text-left py-3 px-4">Funds Raised</th>
                    <th className="text-left py-3 px-4">Goal</th>
                    <th className="text-left py-3 px-4">Donors</th>
                    <th className="text-left py-3 px-4">Avg. Donation</th>
                    <th className="text-left py-3 px-4">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topCampaignsData.map((campaign, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{campaign.name}</td>
                      <td className="py-3 px-4">${campaign.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">${(campaign.amount * 1.2).toLocaleString()}</td>
                      <td className="py-3 px-4">{Math.floor(campaign.amount / 168)}</td>
                      <td className="py-3 px-4">$168</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-primary-600 h-2.5 rounded-full"
                              style={{ width: '85%' }}
                            ></div>
                          </div>
                          <span>85%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Donor Insights Tab */}
      {selectedTab === 'donor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Donor Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donorDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {donorDistributionData.map((entry, index) => (
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
              <h3 className="text-lg font-semibold mb-4">Donor Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fundraisingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="donors" name="Total Donors" stroke="#0ea5e9" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Donor</th>
                    <th className="text-left py-3 px-4">Total Donated</th>
                    <th className="text-left py-3 px-4">Campaigns Supported</th>
                    <th className="text-left py-3 px-4">Last Donation</th>
                    <th className="text-left py-3 px-4">Donor Type</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">Donor {index + 1}</td>
                      <td className="py-3 px-4">${((5 - index) * 1000).toLocaleString()}</td>
                      <td className="py-3 px-4">{6 - index}</td>
                      <td className="py-3 px-4">2024-02-27</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                          {index < 3 ? 'Recurring' : 'One-time'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reports Tab */}
      {selectedTab === 'custom' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Report Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="campaign">Campaign Performance</option>
                    <option value="donor">Donor Activity</option>
                    <option value="financial">Financial Summary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="flex space-x-4">
                    <input
                      type="date"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="date"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metrics</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked />
                      <span>Funds Raised</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked />
                      <span>Donor Growth</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked />
                      <span>Campaign Success Rate</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="pdf">PDF Report</option>
                    <option value="csv">CSV Export</option>
                    <option value="excel">Excel Spreadsheet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (Optional)</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">No Schedule</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                  <input
                    type="text"
                    placeholder="Enter email addresses"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Scheduled Reports</h3>
            <div className="space-y-4">
              {scheduledReportsData.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{report.name}</p>
                    <p className="text-sm text-gray-600">
                      {report.frequency} • {report.recipients.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 inline mr-1" />
                      Next: {report.nextRun}
                    </div>
                    <button className="text-primary-600 hover:text-primary-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics; 