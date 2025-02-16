import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import CustomersAdmin from '../Components/CustomersAdmin'
import '../AdminStyles/adminPanel.css'
function AdminPanel() {
 
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <CustomersAdmin />
    </div>
  </div>
  )
}

export default AdminPanel
