import React, { useState } from 'react';
import '../AdminStyles/bannerAdmin.css';
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

function BannerAdmin() {
    const [icon, setIcon] = useState(false);

    // Strelka holatini almashtiradigan funksiya
    function toggleAccordion() {
        setIcon(!icon);
    }

    return (
        <div className='banner_admin'>
            {/* Bosilganda toggleAccordion funksiyasini chaqiradi */}
            <h2 onClick={toggleAccordion}>
                Banner {icon ? <FiArrowDown /> : <FiArrowUp />}
            </h2>

            {/* Formalarni ko‘rinishini strelka holatiga qarab boshqarish */}
            {icon ? null : (
                <>
                    <form className='banner_create'>
                        <h3>Yaratish</h3>
                        <input placeholder='title' type="text" />
                        <input placeholder='description' type="text" />
                        <button type="submit">Create</button>
                    </form>

                    <form className='banner_update'>
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
    );
}

export default BannerAdmin;
