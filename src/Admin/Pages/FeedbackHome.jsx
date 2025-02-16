import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import FeedbackHomeCard from '../Components/FeedbackHomeCard'

function FeedbackHome() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <FeedbackHomeCard/>
    </div>
  </div>
  )
}

export default FeedbackHome
