import React, { useState, useEffect } from "react";
import axios from "axios";
import '../AdminStyles/docAdmin.css'
function DocAdminCard() {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({
      name: "",
      specialization: "",
      experience: "",
      details: "",
      workingHours: "",
      rating: ""
    });
  
    useEffect(() => {
      // Fetch initial data
      axios
        .get("https://example.com/api/doctors") // Replace with actual API endpoint
        .then((response) => setDoctors(response.data))
        .catch((error) => console.error(error));
    }, []);
    const handleAddDoctor = () => {
        axios
          .post("https://example.com/api/doctors", newDoctor)
          .then((response) => {
            setDoctors([...doctors, response.data]);
            setNewDoctor({ name: "", specialization: "", experience: "", details: "", workingHours: "", rating: "" });
          })
          .catch((error) => console.error(error));
      };
    
      const handleDeleteDoctor = (id) => {
        axios
          .delete(`https://example.com/api/doctors/${id}`)
          .then(() => setDoctors(doctors.filter((doctor) => doctor.id !== id)))
          .catch((error) => console.error(error));
      };
      const handleEditDoctor = (id, updatedDoctor) => {
        axios
          .put(`https://example.com/api/doctors/${id}`, updatedDoctor)
          .then((response) => {
            setDoctors(doctors.map((doctor) => (doctor.id === id ? response.data : doctor)));
          })
          .catch((error) => console.error(error));
      };
          
  return (
    <div className="admin-panel">
      <h1>Admin Panel - Shifokorlar</h1>

      {/* Add New Doctor Form */}
      <div className="add-doctor-form">
        <h2>Yangi Shifokor Qo'shish</h2>
        <input
          type="text"
          placeholder="Ism"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mutaxassislik"
          value={newDoctor.specialization}
          onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tajriba"
          value={newDoctor.experience}
          onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
        />
        <textarea
          placeholder="Batafsil"
          value={newDoctor.details}
          onChange={(e) => setNewDoctor({ ...newDoctor, details: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ish vaqti"
          value={newDoctor.workingHours}
          onChange={(e) => setNewDoctor({ ...newDoctor, workingHours: e.target.value })}
        />
        <input
          type="text"
          placeholder="Reyting"
          value={newDoctor.rating}
          onChange={(e) => setNewDoctor({ ...newDoctor, rating: e.target.value })}
        />
        <button onClick={handleAddDoctor}>Qo'shish</button>
      </div>

      {/* Doctors List */}
      <div className="doctors-list">
        <h2>Shifokorlar Ro'yxati</h2>
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p>Mutaxassislik: {doctor.specialization}</p>
            <p>Tajriba: {doctor.experience} yil</p>
            <p>Batafsil: {doctor.details}</p>
            <p>Ish vaqti: {doctor.workingHours}</p>
            <p>Reyting: {doctor.rating}</p>
            <button onClick={() => handleDeleteDoctor(doctor.id)}>O'chirish</button>
            <button onClick={() => handleEditDoctor(doctor.id, { ...doctor, name: "Updated Name" })}>Tahrirlash</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocAdminCard
