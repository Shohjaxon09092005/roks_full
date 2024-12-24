import React from 'react'
import '../AdminStyles/headerAdmin.css'
import { FiArrowUp } from "react-icons/fi";
import MenuAdminBar from './MenuAdminBar';

function HeaderAdmin() {
  return (
    <div className="header_admin_home">
      <div className="header_admin">
        <input type="text" placeholder="Search" className="search-bar_admin" />
        <div className="user-profile">
          <span id='search'>Zahra Mirzaei</span>
          <img src="https://via.placeholder.com/40" alt="Profile" className="profile-pic" />
          <a className='start_top' href="#search"><FiArrowUp /></a>

        </div>
      </div>
      <MenuAdminBar />
    </div>

  )
}

export default HeaderAdmin
