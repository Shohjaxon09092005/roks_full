import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import NewsAdminCard from '../Components/NewsAdminCard'

function NewsAdmin() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <NewsAdminCard/>
    </div>
  </div>
  )
}

export default NewsAdmin
