import React, { useRef } from 'react'
import { FiMenu } from 'react-icons/fi'
import logo from '../Images/Roks.png'
import '../AdminStyles/menuAdmin.css'
import { NavLink, useLocation } from 'react-router-dom';
function MenuAdminBar() {
    const location = useLocation();
    const menu=useRef()
    function menu_admin_open(){
        menu.current.classList.toggle("open_menu_admin")
    }
    function close_admin_menu(){
        menu.current.classList.remove("open_menu_admin")
    }
    return (
        <div className='Menu_admin_bar'>
            <div className="Menu_bar_wrapper">
                <img src={logo} alt="" />
                <FiMenu onClick={menu_admin_open} size={40}/>
            </div>
            <div ref={menu} className="sidebar_admin">
           
            <div  className="logo">
                <img src={logo} alt="roks.img" />
                <div onClick={close_admin_menu} className="close_admin">
                    X
                </div>
                </div>
            <ul className="menu">
                           <NavLink 
                               to="/admin-panel" 
                               className={location.pathname === "/admin-panel" ? "active_admin" : "ab"}
                           >
                               <li>Customers</li>
                           </NavLink> 
                           <NavLink 
                               to="/home_admin" 
                               className={location.pathname === "/home_admin" ? "active_admin" : "ab"}
                           >
                               <li>Bosh sahifa</li>
                           </NavLink> 
                           <NavLink 
                               to="/service_admin" 
                               className={location.pathname === "/service_admin" ? "active_admin" : "ab"}
                           >
                               <li>Xizmatlar</li>
                           </NavLink>       
                           <NavLink 
                               to="/serviceFeed_admin" 
                               className={location.pathname === "/serviceFeed_admin" ? "active_admin" : "ab"}
                           >
                               <li>Xizmatlar feedback</li>
                           </NavLink>       
                           <NavLink 
                               to="/doctor_admin" 
                               className={location.pathname === "/doctor_admin" ? "active_admin" : "ab"}
                           >
                               <li>Shifokorlar</li>
                           </NavLink> 
                           <NavLink 
                               to="/doctorFeed_admin" 
                               className={location.pathname === "/doctorFeed_admin" ? "active_admin" : "ab"}
                           >
                               <li>Shifokorlar feedback</li>
                           </NavLink> 
                           <NavLink 
                               to="/service_doctor" 
                               className={location.pathname === "/service_doctor" ? "active_admin" : "ab"}
                           >
                               <li>Shifokorlar-Xizmatlar</li>
                           </NavLink> 
                           <NavLink 
                               to="/news_admin" 
                               className={location.pathname === "/news_admin" ? "active_admin" : "ab"}
                           >
                               <li>Yangiliklar</li>
                           </NavLink> 
                           <NavLink 
                               to="/newsFeed_admin" 
                               className={location.pathname === "/newsFeed_admin" ? "active_admin" : "ab"}
                           >
                               <li>Yangiliklar feedback</li>
                           </NavLink> 
                           <NavLink 
                               to="/kasallik_admin" 
                               className={location.pathname === "/kasallik_admin" ? "active_admin" : "ab"}
                           >
                               <li>Kasalliklar Ensiklopediyasi</li>
                           </NavLink> 
                           <NavLink 
                               to="/kasallikFeed_admin" 
                               className={location.pathname === "/kasallikFeed_admin" ? "active_admin" : "ab"}
                           >
                               <li>Kasalliklar feedback</li>
                           </NavLink> 
                           <NavLink 
                               to="/social_admin" 
                               className={location.pathname === "/social_admin" ? "active_admin" : "ab"}
                           >
                               <li>Social Network</li>
                           </NavLink> 
                           <NavLink 
                               to="/qabul_admin" 
                               className={location.pathname === "/qabul_admin" ? "active_admin" : "ab"}
                           >
                               <li>Online arizalar</li>
                           </NavLink> 
                           <NavLink 
                               to="/feedback_admin" 
                               className={location.pathname === "/feedback_admin" ? "active_admin" : "ab"}
                           >
                               <li>Feedback</li>
                           </NavLink> 
                           <NavLink 
                               to="/contactFeed_admin" 
                               className={location.pathname === "/contactFeed_admin" ? "active_admin" : "ab"}
                           >
                               <li>Contact feedback</li>
                           </NavLink> 
                       </ul>
            <button className="logout">Logout</button>
        </div>
        </div>
    )
}

export default MenuAdminBar
