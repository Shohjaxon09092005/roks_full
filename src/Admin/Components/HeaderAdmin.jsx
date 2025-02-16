import React from 'react'
import '../AdminStyles/headerAdmin.css'
import { FiArrowUp } from "react-icons/fi";
import MenuAdminBar from './MenuAdminBar';
import logoAdmin from '../Images/superAdmin.png'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
function HeaderAdmin() {
  // Shifrlangan ma'lumotni cookie'dan olish
    const encryptedStoredRole = Cookies.get('role');
    const encryptedStoredFull_name = Cookies.get('full_name');
  
    // Ma'lumotni dekodlash
    const decryptedStoredRole = CryptoJS.AES.decrypt(encryptedStoredRole, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedStoredFull_name = CryptoJS.AES.decrypt(encryptedStoredFull_name, 'secret-key').toString(CryptoJS.enc.Utf8);
  return (
    <div className="header_admin_home">
      <div className="header_admin">
        <input type="text" placeholder="Search" className="search-bar_admin" />
        <div className="user-profile">
          {decryptedStoredRole==="super_admin"?<span id='search'>Super admin</span>:<span id='search'>{decryptedStoredFull_name}</span>}
          
          <img src={logoAdmin} alt="Profile" className="profile-pic" />
          <a className='start_top' href="#search"><FiArrowUp /></a>

        </div>
      </div>
      <MenuAdminBar />
    </div>

  )
}

export default HeaderAdmin
