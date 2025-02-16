import React, { useEffect, useState } from 'react';
import '../styles/servicesApp.css';
import { NavLink } from 'react-router-dom';
import translations from "../translate/TranslationXizmat"; // Таржима матнларини импорт қилиш
import { useLanguage } from "../translate/LanguageContext"; // Фаол тилни олиш
import Notification from '../components/Notification';
import { URL } from '../Admin/Utils/url';
function Xizmatlar() {
  const { language } = useLanguage(); // Фаол тилни олиш
  const t = translations[language]; // Фаол тилга мос таржималар

  const [visibleCount, setVisibleCount] = useState(8); // Бошланғич кўрсатиш миқдори

  const showMore = () => {
    setVisibleCount(visibleCount + 4); // Ҳар сафар 4 та қўшиб кўрсатиш
  };

  const showLess = () => {
    setVisibleCount(8); // Бошланғич ҳолатга қайтариш
  };
  // GET
  useEffect(() => {
    getSer()
  }, []);
  const [serGet, setSerGet] = useState(null)
  async function getSer() {
    let fetchSer = await fetch(`${URL}/services`);
    let json = await fetchSer.json();
    let sortedSer = json?.services.sort((a, b) => b.id - a.id);
    setSerGet(sortedSer)
  }


  return (
    <div className='serviceApp'>
      <div className="container">
        <div className="services-page">
          <h1 className="page-title">{t.servicesTitle}</h1> {/* Динамик таржима */}
          <p className="page-description">{t.servicesDescription}</p> {/* Динамик таржима */}
          <div className="services-grid">
            {serGet?.slice(0, visibleCount).map((service) => (
              <NavLink to={`/ServicesAbout/${service?.id}`} key={service.id}>
                <div className="service-card">

                  <img src={`https://clinic-web-back.onrender.com/${service?.image}`} alt={service?.name_uz} className="service-image" />
                  <h3 className="service-name">{language === "uz" ? service?.name_uz:language==="ru"?service?.name_ru:service?.name_eng}</h3>
                  <p className="service-description">{language === "uz" ? `${service?.description_uz.slice(0,40)}...`:language==="ru"? `${service?.description_ru.slice(0,40)}...`:`${service?.description_eng.slice(0,40)}...`}</p>
                  <button className="service-btn">{t.moreDetails}</button> {/* Динамик таржима */}
                </div>
              </NavLink>
            ))}
          </div>
          <div className="services-buttons">
            {visibleCount < serGet?.length ? (
              <button className="btn btn-primary" onClick={showMore}>
                {t.showMore} {/* Динамик таржима */}
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={showLess}>
                {t.hide} {/* Динамик таржима */}
              </button>
            )}
          </div>
        </div>
        <div className="online_chat_service">
          <Notification message={t.chat} />
        </div>
      </div>
    </div>
  )
}

export default Xizmatlar;
