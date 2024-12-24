import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import ContactAdminCard from '../Components/ContactAdminCard'

function ContactAdmin() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <ContactAdminCard/>
    </div>
  </div>
  )
}

export default ContactAdmin
