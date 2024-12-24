import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import BannerAdmin from '../Components/BannerAdmin'
import Advertising from '../Components/Advertising'
import AboutHome from '../Components/AboutHome'
import Qadriyat from '../Components/Qadriyat'

function HomeAdmin() {
  return (
    <div className="app-containerAdmin">
    <SidebarAdmin />
    <div className="main-contentAdmin">
      <HeaderAdmin />
      <BannerAdmin/>
      <Advertising/>
      <AboutHome/>
      <Qadriyat/>
    </div>
  </div>
  )
}

export default HomeAdmin
