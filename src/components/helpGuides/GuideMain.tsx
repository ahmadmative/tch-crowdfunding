import React from 'react'
import GuideCategory from './GuideCategory'
import Guides from './Guides'

const GuideMain = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Help Guides Management</h1>
        <p className='text-gray-600'>Manage guide categories and help documentation for your platform</p>
      </div>

      {/* Main Content */}
      <div className='space-y-8'>
        <GuideCategory/>
        <Guides/>
      </div>
    </div>
  )
}

export default GuideMain
