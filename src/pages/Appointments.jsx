import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import '../styles/Appointment.css'
function Appointments() {
    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    useEffect(() => {
        // API orqali ma'lumot olishni simulyatsiya qilish
        const fetchRecords = async () => {
            const dummyData = [
                { id: 1, date: "2024-12-01", doctor: "Dr. Ahmadov", reason: "Bosh og'rig'i" },
                { id: 2, date: "2024-11-25", doctor: "Dr. Karimova", reason: "Yurak tekshiruvi" },
                { id: 3, date: "2024-11-20", doctor: "Dr. Tursunov", reason: "Sovuq qotish" },
            ];
            setRecords(dummyData);
        };

        fetchRecords();
    }, []);

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
    };

    const handleCloseDetails = () => {
        setSelectedRecord(null);
    };

    return (
        <div className='personal'>

            <div className="container">
                <div className="profile-page">
                    <Sidebar />
                    <main className="main-content">
                        <div className="admission-records">
                            <h2>Qabul yozuvlari</h2>
                            <div className="records-list">
                                {records.map((record) => (
                                    <div key={record.id} className="record-item">
                                        <p>
                                            <strong>Sana:</strong> {record.date}
                                        </p>
                                        <p>
                                            <strong>Shifokor:</strong> {record.doctor}
                                        </p>
                                        <button onClick={() => handleViewDetails(record)}>Batafsil</button>
                                    </div>
                                ))}
                            </div>

                            {selectedRecord && (
                                <div className="record-details">
                                    <h3>Qabul tafsilotlari</h3>
                                    <p>
                                        <strong>Sana:</strong> {selectedRecord.date}
                                    </p>
                                    <p>
                                        <strong>Shifokor:</strong> {selectedRecord.doctor}
                                    </p>
                                    <p>
                                        <strong>Sabab:</strong> {selectedRecord.reason}
                                    </p>
                                    <button onClick={handleCloseDetails}>Yopish</button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

        </div>
    )
}

export default Appointments
