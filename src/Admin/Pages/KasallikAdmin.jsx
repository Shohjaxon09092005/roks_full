import React from 'react'
import HeaderAdmin from '../Components/HeaderAdmin'
import SidebarAdmin from '../Components/SidebarAdmin'
import KasallikAdminCard from '../Components/KasallikAdminCard'

function KasallikAdmin() {
    return (
        <div className="app-containerAdmin">
            <SidebarAdmin />
            <div className="main-contentAdmin">
                <HeaderAdmin />
                <KasallikAdminCard />
            </div>
        </div>
    )
}

export default KasallikAdmin
