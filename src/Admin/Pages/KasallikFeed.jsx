import React from 'react'
import KasallikFeedCard from '../Components/KasallikFeedCard'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'

function KasallikFeed() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <KasallikFeedCard/>
    </div>
  </div>
  )
}

export default KasallikFeed
