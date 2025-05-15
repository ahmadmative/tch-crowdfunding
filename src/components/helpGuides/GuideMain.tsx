import React from 'react'
import GuideCategory from './GuideCategory'
import Guides from './Guides'

const GuideMain = () => {
  return (
    <div className='w-full flex flex-col gap-4'>
      <GuideCategory/>
      <Guides/>
    </div>
  )
}

export default GuideMain
