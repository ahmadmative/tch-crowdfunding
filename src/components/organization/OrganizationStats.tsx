import React from 'react'
import StatsCard from './StatsCard'


const stats = [
    {
      name: 'Total Organizations',
      value: '1000'
    },
    {
      name: 'Total Amount to Withdraw',
      value: '500'
    },
    {
      name: 'Total Amount Withdrawn',
      value: '300'
    },
    {
      name: 'Total Amount Raised',
      value: '800'
    },
    {
      name: 'Total Amount Spent',
      value: '200'
    },
    {
      name: 'Total Amount Left',
      value: '600'
    },
  ]


const OrganizationStats = () => {
  return (
    <div>
      <p>Organization Stats</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} name={stat.name} value={stat.value} />
        ))}
      </div>

    </div>
  )
}

export default OrganizationStats
