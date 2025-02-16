import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import ServiceFeedCard from '../Components/ServiceFeedCard'

function ServiceFeed() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <ServiceFeedCard/>
    </div>
  </div>
  )
}

export default ServiceFeed
