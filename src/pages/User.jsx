import React, { useState } from 'react'
import '../styles/user.css'
import Sidebar from '../components/Sidebar'
function User() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
      fullName: "Shohjaxon Qodiraliyev",
      email: "shohjaxon@example.com",
      phone: "+998 90 123 45 67",
      address: "Toshkent shahri, Chilonzor tumani",
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleEditToggle = () => {
      setIsEditing((prev) => !prev);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsEditing(false);
      // Ma'lumotni serverga jo'natish uchun API qo'shing
      console.log("Yangi ma'lumotlar:", formData);
    }
    return (
        <div className="personal">
            <div className="container">
            <div className="profile-page">
                <Sidebar />

                <main className="main-content">
                    <div className="profile-header">
                        <div className="avatar"></div>
                        <h1>Profil</h1>
                        <h2>Shohjaxon Qodiraliyev</h2>
                    </div>
                    <div className="profile-info">
                    <h2>Shaxsiy Ma'lumotlar</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="personal-info-form">
          <div className="form-group">
            <label htmlFor="fullName">To'liq Ism</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon Raqam</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Manzil</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleEditToggle}>
              Bekor qilish
            </button>
            <button type="submit">Saqlash</button>
          </div>
        </form>
      ) : (
        <div className="personal-info-display">
          <p>
            <strong>To'liq Ism:</strong> {formData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Telefon Raqam:</strong> {formData.phone}
          </p>
          <p>
            <strong>Manzil:</strong> {formData.address}
          </p>
          <button onClick={handleEditToggle}>Tahrirlash</button>
        </div>
      )}
                    </div>
                </main>
            </div>
        </div>  
        </div>
      

    )
}

export default User
