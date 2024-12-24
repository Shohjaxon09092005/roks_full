import React, { useState } from 'react'
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
function Advertising() {
    const [icon, setIcon] = useState(true);
    function toggleAccordion() {
        setIcon(!icon);
    }
    return (
        <div className='ad_home banner_admin'>
            <h2 onClick={toggleAccordion}>Reklama banneri {icon ? <FiArrowDown/>:<FiArrowUp/>}</h2>
            {icon ? null:(
                <>
               <form className='banner_create' >
                <h3>Yaratish</h3>
                <input placeholder='title' type="text" />
                <input placeholder='description' type="text" />
                <button type="submit">Create</button>
            </form>
            <form className='banner_update' >
                <h3>Yangilash yoki O'chirish</h3>
                <input placeholder='title' type="text" />
                <input placeholder='description' type="text" />
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

export default Advertising
