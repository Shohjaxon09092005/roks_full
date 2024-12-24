import React from 'react'
import SidebarAdmin from '../Components/SidebarAdmin'
import HeaderAdmin from '../Components/HeaderAdmin'
import DocAdminCard from '../Components/DocAdminCard'

function DoctorAdmin() {
    return (
        <div className="app-containerAdmin">
            <SidebarAdmin />
            <div className="main-contentAdmin">
                <HeaderAdmin />
                <DocAdminCard/>
            </div>
        </div>
    )
}

export default DoctorAdmin
