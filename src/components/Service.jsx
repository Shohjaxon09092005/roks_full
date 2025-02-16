import React, { useEffect, useState } from "react";
import { FaUserMd } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/service.css";
import { useLanguage } from "../translate/LanguageContext"; // Til konteksti
import translations from "../translate/TranslationService"; // Tarjimalar
import { URL } from "../Admin/Utils/url";

function Service({ limit, showAll }) {
  const { language } = useLanguage();
  const t = translations[language];


  //get
  const [homeSer, setHomeSer] = useState([]);
  useEffect(() => {
    getHomeSer()
  }, [])
  async function getHomeSer() {
    let fetchHomeSer = await fetch(`${URL}/services`);
    let jsonHomeSer = await fetchHomeSer.json();
    let sortedHomeSer = jsonHomeSer?.services.sort((a, b) => b.id - a.id);
    setHomeSer(sortedHomeSer);

  }
  const displayedServices = showAll ? homeSer : homeSer.slice(0, limit);

  return (
    <section className="services">
      <h2 className="services-title">{t.servicesTitle}</h2>
      <div className="services-grid">
        {displayedServices.map((service) => {
          return (
            
              <NavLink key={service?.id} to={`/ServicesAbout/${service?.id}`} >
              <div className="service-card">
                <FaUserMd className="service-icon" />
                <h3>{language === "uz" ? service?.name_uz : language === "ru" ? service?.name_ru : service?.name_eng}</h3>
                
              </div>
            </NavLink>
            
            
          )

        })}
      </div>
      <NavLink to="/Xizmatlar">
        <button className="view-more-btn">{t.viewMore}</button>
      </NavLink>
    </section>
  );
}

export default Service;
