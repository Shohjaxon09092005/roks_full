import React from 'react'
import '../AdminStyles/sidebarAdmin.css'
import logo from '../Images/Roks.png'
import { NavLink, useLocation } from 'react-router-dom'
function SidebarAdmin() {
    const location = useLocation(); // Hozirgi manzilni oladi

    return (
        <div className="sidebar_admin">
           
            <div  className="logo"><img src={logo} alt="roks.img" /></div>
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
                    to="/doctor_admin" 
                    className={location.pathname === "/doctor_admin" ? "active_admin" : "ab"}
                >
                    <li>Shifokorlar</li>
                </NavLink> 
                <NavLink 
                    to="/news_admin" 
                    className={location.pathname === "/news_admin" ? "active_admin" : "ab"}
                >
                    <li>Yangiliklar</li>
                </NavLink> 
                <NavLink 
                    to="/kasallik_admin" 
                    className={location.pathname === "/kasallik_admin" ? "active_admin" : "ab"}
                >
                    <li>Kasalliklar Ensiklopediyasi</li>
                </NavLink> 
                <NavLink 
                    to="/contact_admin" 
                    className={location.pathname === "/contact_admin" ? "active_admin" : "ab"}
                >
                    <li>Bog‘lanish</li>
                </NavLink> 
                <NavLink 
                    to="/qabul_admin" 
                    className={location.pathname === "/qabul_admin" ? "active_admin" : "ab"}
                >
                    <li>Online arizalar</li>
                </NavLink> 
            </ul>
            <button className="logout">Logout</button>
        </div>
    );
}

export default SidebarAdmin;
