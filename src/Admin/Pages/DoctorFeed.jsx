import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import DoctorFeedCard from '../Components/DoctorFeedCard'

function DoctorFeed() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <DoctorFeedCard/>
    </div>
  </div>
  )
}

export default DoctorFeed
