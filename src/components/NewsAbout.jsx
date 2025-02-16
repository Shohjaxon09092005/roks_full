import React, { useEffect, useReducer, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import { useLanguage } from '../translate/LanguageContext';
import translations from '../translate/NewsAbout';
import '../styles/newsAbout.css';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { fetchTokens } from '../util/authUtil';
import { URL } from '../Admin/Utils/url';
import { refreshToken } from '../Admin/Utils/authRefreshToken';

function NewsAbout() {
  const { id } = useParams();
  const { language } = useLanguage();
  const t = translations[language] || translations['uz'];


  const [feedback, setFeedback] = useState('');
  // Update
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
  }, [update])


  //navigate

  // Shifrlangan ma'lumotni cookie'dan olish
  const encryptedAccessToken = Cookies.get('access_token');
  const encryptedStoredTime = Cookies.get('stored_time');

  // Ma'lumotni dekodlash
  const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);
  //post
  async function handleFeedbackSubmit(e) {
    e.preventDefault();
if (!encryptedAccessToken && !encryptedStoredTime) {
      await fetchTokens()

    } else {
      const current_time = new Date();
      const stored_time = decryptedStoredTime;
      const timeDiff = (current_time - new Date(stored_time)) / 60000;
      let ready = {
        news_id: Number(id),
        feedback: feedback
      }
      if (timeDiff < 9.5) {
        try {
          const responceSerCom = await fetch(`${URL}/news-feedback`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${decryptedAccessToken}`,
            },
            body: JSON.stringify(ready)
          });
          if (responceSerCom.ok) {
            const result = await responceSerCom.json();
            forceUpdate();
            console.log("Disease created successfully:", result);
            setFeedback('');
            alert(`Fikringiz uchun rahmat  `)

          } else if (responceSerCom.status === 401) {
            alert("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...")
            Cookies.remove("role");
          } else {
            alert("Xatolik yuz berdi:",
              `${responceSerCom.statusText} errors, or phone number may be valid.`)
          }


        } catch (error) {
          console.log("Serverga ulanishda xatolik:", error.message);
          alert("Serverga ulanishda xatolik:", error.message)
        }
      } else {
        // Tokenni yangilash
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          handleFeedbackSubmit(e); // Yangi token bilan qayta chaqirish
        } else {
          console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        }
      }


    

  };
  
  };

  //get
  const [newsGet, setNewsGet] = useState([])
  useEffect(() => {
    getNews()
  }, [])
  async function getNews() {
    let fetchGetNews = await fetch(`${URL}/news`);
    let jsonNews = await fetchGetNews.json();
    let sortedNews = jsonNews?.news?.sort((a, b) => b.id - a.id);
    setNewsGet(sortedNews)
  }
  const filterNews = newsGet.find((b) => b.id === Number(id))


  if (!filterNews) {
    return <h2>{t.newsNotFound || 'Yangilik topilmadi'}</h2>;
  }

  return (
    <div className="NewsAbout">
      <div className="news-details">
        <img className="news-image" src={`https://clinic-web-back.onrender.com/${filterNews?.image}`} alt={filterNews?.name_uz} />
        <div className="news-content">
          <h1>{language === "uz" ? filterNews?.name_uz : language === "ru" ? filterNews?.name_ru : filterNews?.name_eng}</h1>
          <p className="news-date">{filterNews?.date}</p>
          <p>{language === "uz" ? filterNews?.description_uz : language === "ru" ? filterNews?.description_ru : filterNews?.description_eng}</p>
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


    </div>
  );
}

export default NewsAbout;
