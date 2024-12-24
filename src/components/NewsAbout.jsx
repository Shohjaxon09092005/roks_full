import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../translate/LanguageContext';
import translations from '../translate/NewsAbout';
import '../styles/newsAbout.css';

function NewsAbout() {
  const { id } = useParams();
  const { language } = useLanguage();
  const t = translations[language] || translations['uz'];

  const news = t.allNews.find((item) => item.id.toString() === id);

  const [feedback, setFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(sessionStorage.getItem('name') || '');
  const [surname, setSurname] = useState(sessionStorage.getItem('surname') || '');

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!name || !surname) {
      setIsModalOpen(true); // Agar ism va familiya yo'q bo'lsa, modalni ochish
    } else {
      console.log(`Feedback: ${feedback}, Name: ${name}, Surname: ${surname}`);
      setFeedback('');
      alert(`Fikringiz uchun rahmat ${name} `)
    }
  };

  const handleSaveNameSurname = () => {
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('surname', surname);
    setIsModalOpen(false); // Modalni yopish
  };

  if (!news) {
    return <h2>{t.newsNotFound || 'Yangilik topilmadi'}</h2>;
  }

  return (
    <div className="NewsAbout">
      <div className="news-details">
        <img className="news-image" src={news.image} alt={news.title} />
        <div className="news-content">
          <h1>{news.title}</h1>
          <p className="news-date">{news.date}</p>
          <p>{news.description}</p>
        </div>
        <form className="comment-form" onSubmit={handleFeedbackSubmit}>
          <h3>{t.leaveFeedback || 'Fikr-mulohazalar qoldiring'}</h3>
          <textarea
            placeholder={t.writeYourFeedback || 'Fikringizni yozing...'}
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button type="submit">{t.submit || 'Jo‘natish'}</button>
        </form>
        <Link to="/yangiliklar" className="back-button">
          {t.backButton || 'Ortga'}
        </Link>
      </div>

      {/* Modal oyna */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{t.enterNameAndSurname || 'Ismingiz va familiyangizni kiriting'}</h2>
            <input
              type="text"
              placeholder={t.namePlaceholder || 'Ism'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder={t.surnamePlaceholder || 'Familiya'}
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            /> <br />
            <button onClick={handleSaveNameSurname}>
              {t.save || 'Saqlash'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsAbout;
