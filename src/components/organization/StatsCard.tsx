import React from 'react'

interface Props {
  name: String,
  value: String
}

const StatsCard : React.FC<Props> = ({name, value}) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-4'>
      <p className='text-gray-500 '>{name}</p>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  )
}

export default StatsCard
