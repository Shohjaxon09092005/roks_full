import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import translations from '../translate/TranslationDocAbout';
import { useLanguage } from '../translate/LanguageContext';
import '../styles/doctorsAbout.css';
import avatar from '../images/doctor1.jpg';
import { FaStar } from "react-icons/fa";

function DoctorsAbout() {
  const { id } = useParams();
  const { language } = useLanguage(); // Faol tilni olish
  const t = translations[language]; // Faol tilga mos tarjimalar
  const doctor = t.doctorsData.find((doc) => doc.id === id);

  const [feedback, setFeedback] = useState('');
  const [allFeedback, setAllFeedback] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ratingError, setRatingError] = useState(false); // Reyting tanlanmagan holatni tekshirish uchun

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

  useEffect(() => {
    if (doctor) {
      setAllFeedback(doctor.feedback || []);
    }
    // SessionStorage'dan name va surname'ni olish
    const storedName = sessionStorage.getItem('name');
    const storedSurname = sessionStorage.getItem('surname');
    if (storedName && storedSurname) {
      setName(storedName);
      setSurname(storedSurname);
    }
  }, [language, doctor]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      setRatingError(true); // Agar reyting tanlanmagan bo'lsa, xatolikni ko'rsatish
      return;
    }
    if (!feedback.trim()) return;

    if (!name || !surname) {
      setShowModal(true); // Agar ism yoki familiya mavjud bo'lmasa, modal oynani ko'rsatish
      return;
    }

    // Fikrga yulduzlar qo'shish
    const userFeedback = (
      <>
        <span>
          {name} {surname}: {feedback} ({[...Array(rating)].map((_, i) => (
            <FaStar key={i} size={14} className="star active" />
          ))})
        </span>
      </>
    );

    setAllFeedback((prev) => [...prev, userFeedback]);
    setFeedback('');
    setRating(0); // Reytingni qayta boshlash
  };

  const saveUserName = (e) => {
    e.preventDefault();
    if (name.trim() === '' || surname.trim() === '') return;

    sessionStorage.setItem('name', name);
    sessionStorage.setItem('surname', surname);
    setShowModal(false); // Modalni yopish
  };

  if (!doctor) {
    return <h2>{t.doctorNotFound}</h2>;
  }

  return (
    <div className='container docAbout'>
      <div className="doctor-details">
        <img src={avatar} alt={doctor.name} />
        <h1>{doctor.name}</h1>
        <p><strong>{t.specialty}:</strong> {doctor.specialty}</p>
        <p><strong>{t.experience}:</strong> {doctor.experience}</p>
        <p><strong>{t.bio}:</strong> {doctor.bio}</p>
        <p><strong>{t.workingHours}:</strong> {doctor.workingHours}</p>

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
              <p>{t.rating}</p>
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

      {/* Modal oyna */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{t.enterNameAndSurname}</h2>
            <form onSubmit={saveUserName}>
              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder={t.surnamePlaceholder}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              /> <br />
              <button type="submit">{t.save}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsAbout;
