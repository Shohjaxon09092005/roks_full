import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { URL } from "../Utils/url";
import '../AdminStyles/contactAdmin.css'
function ContactAdminCard() {
    const [contactInfo, setContactInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  const phoneRef = useRef();
  const emailRef = useRef();
  const addressRef = useRef();
  const telegramRef = useRef();
  const instagramRef = useRef();
  const facebookRef = useRef();
  const locationRef = useRef();

  useEffect(() => {
    getContactInfo();
  }, []);

  // Ma'lumotlarni olish (GET)
  const getContactInfo = async () => {
    try {
      const response = await axios.get(`${URL}/contact`);
      setContactInfo(response.data);
    } catch (error) {
      console.error("Bog‘lanish ma‘lumotlarini olishda xatolik:", error);
    }
  };

  // Yangi ma'lumot yaratish (POST)
  const createContactInfo = async (e) => {
    e.preventDefault();
    const newInfo = {
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      address: addressRef.current.value,
      telegram: telegramRef.current.value,
      instagram: instagramRef.current.value,
      facebook: facebookRef.current.value,
      location: locationRef.current.value,
    };

    try {
      await axios.post(`${URL}/contact`, newInfo);
      alert("Ma’lumotlar muvaffaqiyatli yaratildi!");
      setCreateMode(false);
      getContactInfo();
    } catch (error) {
      console.error("Ma‘lumotlarni yaratishda xatolik:", error);
    }
  };

  // Ma'lumotlarni yangilash (PUT)
  const updateContactInfo = async (e) => {
    e.preventDefault();
    const updatedInfo = {
      phone: phoneRef.current.value,
      email: emailRef.current.value,
      address: addressRef.current.value,
      telegram: telegramRef.current.value,
      instagram: instagramRef.current.value,
      facebook: facebookRef.current.value,
      location: locationRef.current.value,
    };

    try {
      await axios.put(`${URL}/contact`, updatedInfo);
      alert("Ma’lumotlar muvaffaqiyatli yangilandi!");
      setEditMode(false);
      getContactInfo();
    } catch (error) {
      console.error("Ma‘lumotlarni yangilashda xatolik:", error);
    }
  };

  // Ma'lumotlarni o'chirish (DELETE)
  const deleteContactInfo = async () => {
    if (window.confirm("Haqiqatan ham ma’lumotni o‘chirmoqchimisiz?")) {
      try {
        await axios.delete(`${URL}/contact`);
        alert("Ma’lumotlar muvaffaqiyatli o‘chirildi!");
        setContactInfo(null);
      } catch (error) {
        console.error("Ma’lumotlarni o‘chirishda xatolik:", error);
      }
    }
  };
  return (
    <div className="contactAdmin">
    <h2>Bog‘lanish Ma‘lumotlari</h2>

    {/* Agar ma'lumot mavjud bo'lmasa */}
    {!contactInfo && !createMode && (
      <div>
        <p>Hozircha bog‘lanish ma’lumotlari yo‘q.</p>
        <button onClick={() => setCreateMode(true)}>Yangi Ma’lumot Qo‘shish</button>
      </div>
    )}

    {/* Ma'lumotlarni ko'rish yoki tahrirlash */}
    {contactInfo && (
      editMode ? (
        <form onSubmit={updateContactInfo}>
          <label>Telefon:</label>
          <input type="text" defaultValue={contactInfo.phone} ref={phoneRef} placeholder="Telefon raqami" />

          <label>Email:</label>
          <input type="email" defaultValue={contactInfo.email} ref={emailRef} placeholder="Email manzili" />

          <label>Manzil:</label>
          <input type="text" defaultValue={contactInfo.address} ref={addressRef} placeholder="Manzil" />

          <label>Telegram:</label>
          <input type="url" defaultValue={contactInfo.telegram} ref={telegramRef} placeholder="Telegram havolasi" />

          <label>Instagram:</label>
          <input type="url" defaultValue={contactInfo.instagram} ref={instagramRef} placeholder="Instagram havolasi" />

          <label>Facebook:</label>
          <input type="url" defaultValue={contactInfo.facebook} ref={facebookRef} placeholder="Facebook havolasi" />

          <label>Locatsiya (Google Maps):</label>
          <input type="url" defaultValue={contactInfo.location} ref={locationRef} placeholder="Locatsiya havolasi" />

          <button type="submit">Saqlash</button>
          <button type="button" onClick={() => setEditMode(false)}>Bekor qilish</button>
        </form>
      ) : (
        <div>
          <p><strong>Telefon:</strong> {contactInfo.phone}</p>
          <p><strong>Email:</strong> {contactInfo.email}</p>
          <p><strong>Manzil:</strong> {contactInfo.address}</p>
          <p><strong>Telegram:</strong> <a href={contactInfo.telegram} target="_blank" rel="noopener noreferrer">{contactInfo.telegram}</a></p>
          <p><strong>Instagram:</strong> <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">{contactInfo.instagram}</a></p>
          <p><strong>Facebook:</strong> <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer">{contactInfo.facebook}</a></p>
          <p><strong>Locatsiya:</strong> <a href={contactInfo.location} target="_blank" rel="noopener noreferrer">{contactInfo.location}</a></p>

          <button onClick={() => setEditMode(true)}>Tahrirlash</button>
          <button onClick={deleteContactInfo}>O‘chirish</button>
        </div>
      )
    )}

    {/* Yangi ma'lumot yaratish */}
    {createMode && (
      <form onSubmit={createContactInfo}>
        <label>Telefon:</label>
        <input type="text" ref={phoneRef} placeholder="Telefon raqami" />

        <label>Email:</label>
        <input type="email" ref={emailRef} placeholder="Email manzili" />

        <label>Manzil:</label>
        <input type="text" ref={addressRef} placeholder="Manzil" />

        <label>Telegram:</label>
        <input type="url" ref={telegramRef} placeholder="Telegram havolasi" />

        <label>Instagram:</label>
        <input type="url" ref={instagramRef} placeholder="Instagram havolasi" />

        <label>Facebook:</label>
        <input type="url" ref={facebookRef} placeholder="Facebook havolasi" />

        <label>Locatsiya (Google Maps):</label>
        <input type="url" ref={locationRef} placeholder="Locatsiya havolasi" />

        <button type="submit">Yaratish</button>
        <button type="button" onClick={() => setCreateMode(false)}>Bekor qilish</button>
      </form>
    )}
  </div>
  )
}

export default ContactAdminCard
