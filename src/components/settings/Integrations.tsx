import React from 'react'

const Integrations = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Amazon Section */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4">Amazon</h2>
        <label htmlFor="amazon" className="block text-sm font-medium text-gray-700 mb-1">
          Amazon API Key
        </label>
        <input
          type="password"
          id="amazon"
          placeholder="Enter Amazon API Key"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* SMS Section */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4">SMS</h2>
        <label htmlFor="sms" className="block text-sm font-medium text-gray-700 mb-1">
          Google SMS Key
        </label>
        <input
          type="password"
          id="sms"
          placeholder="Enter Google SMS Key"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Payments Section */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4">Payments</h2>
        <label htmlFor="payments" className="block text-sm font-medium text-gray-700 mb-1">
          Google Payments Key
        </label>
        <input
          type="password"
          id="payments"
          placeholder="Enter Google Payments Key"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className='bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors'>Save</button>
    </div>
  )
}

export default Integrations
