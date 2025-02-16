import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import ContactFeedCard from '../Components/ContactFeedCard'

function ContactAdminFeed() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <ContactFeedCard/>
    </div>
  </div>
  )
}

export default ContactAdminFeed
