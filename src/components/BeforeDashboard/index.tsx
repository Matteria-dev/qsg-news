import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to Quicksilver News!</h4>
      </Banner>
      Here&apos;s what to do to make a news post.<br/> - Click on Posts, either on the side menu or the collections below.<br/> - Click Create, or view an old post and duplicate if you want to quickly edit content.




    </div>
  )
}

export default BeforeDashboard
