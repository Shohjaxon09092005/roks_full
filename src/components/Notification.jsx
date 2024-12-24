import React, { useEffect, useState } from 'react'
import '../styles/notification.css'
import bell from '../images/notification.png'
import { NavLink } from 'react-router-dom';
function Notification({ message }) {
    const [shake, setShake] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
          setShake(true); // Animatsiyani yoqish
          setTimeout(() => setShake(false), 1000); // 1 sekunddan keyin to'xtatish
        }, 10000); 
    
        return () => clearInterval(interval); // Komponent unmount bo'lganda tozalash
      }, []);
  return (
   <NavLink to="/chat">
    <div className={`notification-container ${shake ? 'border-glow' : ''}`}>
    <div className="speech-bubble">{message}</div>
    <div className={`bell-icon ${shake ? 'shake' : ''}`}>
      <span className="notification-count">1</span>
      <img
        src={bell}
        alt="Bell Icon"
        className="bell-image"
      />
    </div>
  </div>
   </NavLink> 
  )
}

export default Notification
