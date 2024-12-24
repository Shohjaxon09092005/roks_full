import React, { useState } from 'react'
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

function AboutHome() {
    const [icon, setIcon] = useState(true);
    function toggleAccordion() {
        setIcon(!icon);
    }
  return (
    <div className='about_admin_home banner_admin '>
       <h2 onClick={toggleAccordion}>Klinika haqida {icon ? <FiArrowDown/>:<FiArrowUp/>}</h2>
       {icon ? null:(
        <>
        <form className='banner_create' >
                <h3>Yaratish</h3>
                <input placeholder='description' type="text" />
                <button type="submit">Create</button>
            </form>
            <form className='banner_create' >
                <h3>Yaratish</h3>
                <input placeholder='title' type="text" />
                <input placeholder='number' type="text" />
                <button type="submit">Create</button>
            </form>
            <form className='banner_update' >
                <h3>Yangilash yoki O'chirish</h3>
                <input placeholder='description' type="text" />
                <div className="ban_upd_btn">
                    <button type="submit">Update</button>
                    <button className='del_banner'>Delete</button>
                </div>
            </form>
            <form className='banner_update' >
                <h3>Yangilash yoki O'chirish</h3>
                <input placeholder='title' type="text" />
                <input placeholder='number' type="text" />
                <div className="ban_upd_btn">
                    <button type="submit">Update</button>
                    <button className='del_banner'>Delete</button>
                </div>
            </form>
        </>
       )}
            
    </div>
  )
}

export default AboutHome
