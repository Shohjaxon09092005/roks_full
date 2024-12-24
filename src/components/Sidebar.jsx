import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Sidebar holatini boshqarish
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("users");
    sessionStorage.removeItem("users");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Ochib-yopish funksiyasi
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? "❮" : "❯"} {/* Strelka belgisi */}
      </div>
      <div className={`menu ${isOpen ? "show" : "hide"}`}>
        <h2>Mening ma'lumotlarim</h2>
        <ul>
          <NavLink
            to="/user"
            className={({ isActive }) => (isActive ? "active-link" : "default-link")}
          >
            <li>Shaxsiy ma'lumotlar</li>
          </NavLink>
          <NavLink
            to="/qabulUser"
            className={({ isActive }) => (isActive ? "active-link" : "default-link")}
          >
            <li>Qabul yozuvlari</li>
          </NavLink>
          <NavLink
            to="/medHistory"
            className={({ isActive }) => (isActive ? "active-link" : "default-link")}
          >
            <li>Tibbiy tarix</li>
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) => (isActive ? "active-link" : "default-link")}
          >
            <li>Online chat</li>
          </NavLink>
          <NavLink onClick={handleLogout} className="default-link linkClose">
            <li>Chiqish</li>
          </NavLink>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
