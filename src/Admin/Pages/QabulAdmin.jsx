import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AdminStyles/qabulAdmin.css'
import SidebarAdmin from '../Components/SidebarAdmin';
import HeaderAdmin from '../Components/HeaderAdmin';
function QabulAdmin() {
    const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [responseData, setResponseData] = useState({
    date: "",
    time: "",
    doctor: "",
    roomNumber: "",
    reason: "",
  });

  // Qabul qilingan ma'lumotlarni olish
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments"); // API manzil
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  // Ma'lumotlarni o'zgartirish funksiyasi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponseData((prev) => ({ ...prev, [name]: value }));
  };

  // Javob jo‘natish funksiyasi
  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      await axios.post(`/api/appointments/${selectedAppointment.id}/response`, responseData);
      alert("Javob muvaffaqiyatli jo‘natildi!");
      setResponseData({ date: "", time: "", doctor: "", roomNumber: "", reason: "" });
      setSelectedAppointment(null);
    } catch (err) {
      console.error("Error sending response:", err);
      alert("Javobni jo‘natishda xatolik yuz berdi.");
    }
  };
  return (
    <div className='qabul_admin app-containerAdmin'>
        <SidebarAdmin/>
       <div className="admin-panel main-contentAdmin">
       <HeaderAdmin/>

      <h1>Online arizalar</h1>
      <div className="appointments">
      <h2>Qabul qilingan ma'lumotlar</h2>
        <table>
          <thead>
            <tr>
              <th>Ism va Familiya</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Sana</th>
              <th>Vaqt</th>
              <th>Tavsif</th>
              <th>Javob berish</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr key={app.id}>
                <td>{app.fullName}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.date}</td>
                <td>{app.time}</td>
                <td>{app.description}</td>
                <td>
                  <button
                    onClick={() => setSelectedAppointment(app)}
                    className="response-btn"
                  >
                    Javob yozish
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedAppointment && (
        <div className="response-form">
          <h2>Javob yozish</h2>
          <form onSubmit={handleResponseSubmit}>
            <label>
              Sana:
              <input
                type="date"
                name="date"
                value={responseData.date}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Vaqt:
              <input
                type="time"
                name="time"
                value={responseData.time}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Shifokor:
              <input
                type="text"
                name="doctor"
                value={responseData.doctor}
                onChange={handleChange}
                placeholder="Shifokor ismi"
                required
              />
            </label>
            <label>
              Xona raqami:
              <input
                type="text"
                name="roomNumber"
                value={responseData.roomNumber}
                onChange={handleChange}
                placeholder="Xona raqami"
                required
              />
            </label>
            <label>
              Kasallik sababi:
              <textarea
                name="reason"
                value={responseData.reason}
                onChange={handleChange}
                placeholder="Kasallik sababi"
                required
              />
            </label>
            <button type="submit">Jo'natish</button>
          </form>
        </div>
      )}
    
    </div>
    </div>
  )
}

export default QabulAdmin
