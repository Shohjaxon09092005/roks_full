import React, { useState, useEffect, useReducer } from 'react';
import {  useParams } from 'react-router-dom';
import translations from '../translate/TranslationDocAbout';
import { useLanguage } from '../translate/LanguageContext';
import '../styles/doctorsAbout.css';
import { FaStar } from "react-icons/fa";
import { URL } from '../Admin/Utils/url';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { fetchTokens } from '../util/authUtil';
import { refreshToken } from '../Admin/Utils/authRefreshToken';
function DoctorsAbout() {
  const { id } = useParams();
  const { language } = useLanguage(); // Faol tilni olish
  const t = translations[language]; // Faol tilga mos tarjimalar

  const [feedback, setFeedback] = useState('');
  const [allFeedback, setAllFeedback] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [ratingError, setRatingError] = useState(false); // Reyting tanlanmagan holatni tekshirish uchun
  // Update
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {

  }, [update])
  const handleStarClick = (value) => {
    setRating(value);
    setRatingError(false); // Reyting tanlanganida xatolikni yo'q qilish
  };

  const handleStarHover = (value) => {
    setHover(value);
  };

  const handleStarLeave = () => {
    setHover(0);
  };
  //get
  useEffect(() => {
    getAboutDoc()
  }, [])
  const [docAbout, serDocAbout] = useState(null)
  async function getAboutDoc() {
    let fetchDocAbout = await fetch(`${URL}/doctors`);
    let jsonDocAbout = await fetchDocAbout.json();
    serDocAbout(jsonDocAbout);
  }
  const filterDocAbout = docAbout?.doctors.find((a) => a.id === Number(id));



  //POST
  //navigate

  // Shifrlangan ma'lumotni cookie'dan olish
  const encryptedAccessToken = Cookies.get('access_token');
  const encryptedStoredTime = Cookies.get('stored_time');

  // Ma'lumotni dekodlash
  const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (!rating) {
      setRatingError(true); // Agar reyting tanlanmagan bo'lsa, xatolikni ko'rsatish
      return;
    }
    if (!feedback.trim()) return;

    if (!decryptedAccessToken && !decryptedStoredTime) {
      await fetchTokens();
    } else {
      const current_time = new Date();
      const stored_time = decryptedStoredTime;
      const timeDiff = (current_time - new Date(stored_time)) / 60000;
      let readyDoc = {
        doctor_id: Number(id),
        feedback: feedback,
        rating: Number(rating)
      }
      console.log(readyDoc);
      
      if (timeDiff < 9.5) {
        try {
          const responceDocFed = await fetch(`${URL}/doctor-feedback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${decryptedAccessToken}`,
            },
            body: JSON.stringify(readyDoc)
          });
          if (responceDocFed.ok) {
            const result = await responceDocFed.json();
            forceUpdate();
            console.log("Disease created successfully:", result);
            alert("Muvaffaqiyatli yuborildi")
            setFeedback("")
          } else if (responceDocFed.status === 401) {
            alert("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...")
            Cookies.remove("role");
          } else {
            alert("Xatolik yuz berdi:",
              `${responceDocFed.statusText} errors, or phone number may be valid.`)

          }


        } catch (error) {
          console.log("Serverga ulanishda xatolik:", error.message);
          alert("Serverga ulanishda xatolik:", error.message)
        }
      }
      else {
        // Tokenni yangilash
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          handleFeedbackSubmit(e); // Yangi token bilan qayta chaqirish
        } else {
          console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        }
      }
    }




    // Fikrga yulduzlar qo'shish
    const userFeedback = (
      <>
        <span>
          {feedback} ({[...Array(rating)].map((_, i) => (
            <FaStar key={i} size={14} className="star active" />
          ))})
        </span>
      </>
    );

    setAllFeedback((prev) => [...prev, userFeedback]);
    setFeedback('');
    setRating(0); // Reytingni qayta boshlash

  };


  if (!filterDocAbout) {
    return <h2>{t.doctorNotFound}</h2>;
  }

  return (
    <div className='container docAbout'>
      <div className="doctor-details">
        <img src={`https://clinic-web-back.onrender.com/${filterDocAbout?.image}`} alt={filterDocAbout?.full_name} />
        <h1>{filterDocAbout?.full_name}</h1>
        <p><strong>{t.specialty}:</strong> {language === "uz" ? filterDocAbout?.specialist_uz : language === "ru" ? filterDocAbout?.specialist_ru : filterDocAbout?.specialist_eng}</p>
        <p><strong>{t.experience}:</strong> {filterDocAbout?.experience}</p>
        <p><strong>{t.bio}:</strong>{language === "uz" ? filterDocAbout?.description_uz : language === "ru" ? filterDocAbout?.description_ru : filterDocAbout?.description_eng}</p>
        <p><strong>{t.workingHours}:</strong> {filterDocAbout?.working_hours}</p>

        <div className="feedback-section">
          <h2>{t.feedbackSection}</h2>
          {allFeedback.length ? (
            <ul>
              {allFeedback.map((fb, index) => (
                <li key={index}>{fb}</li>
              ))}
            </ul>
          ) : (
            <p>{t.noFeedback}</p>
          )}

          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            {/* Reyting (Yulduzchalar) */}
            <div className="star-rating">
              <p>{t.rating} </p>
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  size={24}
                  className={`star ${value <= (hover || rating) ? "active" : ""}`}
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => handleStarHover(value)}
                  onMouseLeave={handleStarLeave}
                />
              ))}
            </div>
            {ratingError && <p className="error-message">{t.selectRating}</p>}
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t.leaveFeedback}
              rows="4"
            ></textarea>
            <button type="submit">{t.submitFeedback}</button>
          </form>
        </div>
      </div>


    </div>
  );
}

export default DoctorsAbout;
