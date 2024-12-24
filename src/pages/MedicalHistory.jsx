import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import '../styles/medHistory.css'
function MedicalHistory() {
    const [history, setHistory] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
  
    useEffect(() => {
      // Tibbiy tarix ma'lumotlarini simulyatsiya qilish
      const fetchHistory = async () => {
        const dummyData = [
          { id: 1, date: "2024-12-01", condition: "Gripp", treatment: "Dorilar va issiq dam olish" },
          { id: 2, date: "2024-11-20", condition: "Yurak og'rig'i", treatment: "Shifokor ko'rigidan o'tish" },
          { id: 3, date: "2024-10-15", condition: "Oshqozon og'rig'i", treatment: "Parhez va dorilar" },
        ];
        setHistory(dummyData);
      };
  
      fetchHistory();
    }, []);
  
    const handleViewDetails = (entry) => {
      setSelectedEntry(entry);
    };
  
    const handleCloseDetails = () => {
      setSelectedEntry(null);
    };
  
  return (
    <div className='personal'>
      <div className="container">
        <div className="profile-page">
            <Sidebar/>
            <main className="main-content">
            <div className="medical-history">
      <h2>Tibbiy tarix</h2>
      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.id} className="history-item">
            <p>
              <strong>Sana:</strong> {entry.date}
            </p>
            <p>
              <strong>Kasal holati:</strong> {entry.condition}
            </p>
            <button onClick={() => handleViewDetails(entry)}>Batafsil</button>
          </div>
        ))}
      </div>

      {selectedEntry && (
        <div className="history-details">
          <h3>Tarix tafsilotlari</h3>
          <p>
            <strong>Sana:</strong> {selectedEntry.date}
          </p>
          <p>
            <strong>Kasal holati:</strong> {selectedEntry.condition}
          </p>
          <p>
            <strong>Davolash:</strong> {selectedEntry.treatment}
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

export default MedicalHistory
