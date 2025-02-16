import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import DoctorServiceApp from '../Components/DoctorServiceApp'

function ServiceDoctor() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
        <HeaderAdmin />
        <DoctorServiceApp/>
    </div>
</div>
  )
}

export default ServiceDoctor
