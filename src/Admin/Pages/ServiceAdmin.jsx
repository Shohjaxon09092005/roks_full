import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import ServiceAdminCard from '../Components/ServiceAdminCard'

function ServiceAdmin() {
  return (
    <div className="app-containerAdmin">
      <SidebarAdmin/>
      <div className="main-contentAdmin">
        <HeaderAdmin/>
        <ServiceAdminCard/>
      </div>

    </div>
  )
}

export default ServiceAdmin
