import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import NewsFeedCard from '../Components/NewsFeedCard'

function NewsFeed() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <NewsFeedCard/>
    </div>
  </div>
  )
}

export default NewsFeed
