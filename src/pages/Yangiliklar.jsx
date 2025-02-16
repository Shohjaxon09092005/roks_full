import React, { useEffect, useState } from 'react';
import '../styles/yangiliklar.css';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../translate/LanguageContext';
import translations from '../translate/TranslationNews'; // Tarjima faylini import qilish
import { URL } from '../Admin/Utils/url';

function Yangiliklar() {
  const { language } = useLanguage(); // Faol tilni olish
  const t = translations[language] || translations['uz']; // Agar tilni olishda muammo bo'lsa, uzbekcha tilni default qilib olish

  const [visibleNews, setVisibleNews] = useState(3); // Ko'rinadigan yangiliklar soni

  const handleLoadMore = () => {
    setVisibleNews((prev) => prev + 3); // 3 ta yangilik qo'shib ko'rsatadi
  };

  const handleLoadDel = () => {
    setVisibleNews(3); // Ko'rinadigan yangiliklar sonini 3 ga kamaytirish
  };

  //get 
  const [newsGet, setNewsGet] = useState([])
  useEffect(()=>{
    getNews()
  },[])
  async function getNews(){
    let fetchGetNews=await fetch(`${URL}/news`);
    let jsonNews=await fetchGetNews.json();
    let sortedNews=jsonNews?.news?.sort((a,b)=>b.id-a.id);
    setNewsGet(sortedNews)
  }
  return (
    <div className="yangiliklar">
      <section className="news-section">
        <div className="container">
          <h2 className="section-title">{t.newsTitle}</h2>
          <p className="section-description">{t.newsDescription}</p>
          <div className="news-grid">
            {newsGet.slice(0, visibleNews).map((news) => (
              <NavLink to={`/newsAbout/${news?.id}`} key={news?.id}>
                <div className="news-card">
                  <img src={`https://clinic-web-back.onrender.com/${news?.image}`} alt={news?.name_uz} className="news-image" />
                  <div className="news-content">
                    <h3 className="news-title">{language==="uz"?news?.name_uz:language==="ru"?news?.name_ru:news?.name_eng}</h3>
                    <p className="news-description">{language==="uz"?news?.description_uz.slice(0,40):language==="ru"?news?.description_ru.slice(0,40):news?.description_eng.slice(0,40)}</p>
                    <div className="news-meta">
                      <span className="news-date">{news?.date}</span>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
          {visibleNews < newsGet?.length ? (
            <button className="load-more-btn" onClick={handleLoadMore}>
              {t.showMore}
            </button>
          ) : (
            <button className="load-more-btn load-more-btn2" onClick={handleLoadDel}>
              {t.hide}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Yangiliklar;
