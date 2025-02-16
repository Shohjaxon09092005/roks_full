import React, { useEffect, useState } from "react";
import { FaUserMd } from "react-icons/fa"; // Icon uchun
import { NavLink } from "react-router-dom";
import { useLanguage } from "../translate/LanguageContext"; // Til konteksti
import translations from "../translate/TranslationDoctors"; // Tarjimalar
import "../styles/doctors.css";

import { URL } from "../Admin/Utils/url";

function Doctors({ limit, showAll }) {
  const { language } = useLanguage();
  const t = translations[language];

 
  //get
  const [homeDoc, setHomeDoc] = useState([])
  useEffect(() => {
    getHomeDoc()
  }, [])
  async function getHomeDoc() {
    let fetchHomeDoc = await fetch(`${URL}/doctors`);
    let jsonHomeDoc = await fetchHomeDoc.json();
    let sortedHomeDoc = jsonHomeDoc?.doctors.sort((a, b) => b.id - a.id);
    setHomeDoc(sortedHomeDoc)
  }
  const displayedDoctors = showAll ? homeDoc : homeDoc.slice(0, limit);

  return (
    <section className="doctors-team">
      <h2 className="section-title">{t.sectionTitle}</h2>
      <p className="section-description">{t.sectionDescription}</p>
      <div className="doctors-grid">
        {displayedDoctors.map((doctor) => (
          <NavLink to={`/DoctorsAbout/${doctor?.id}`} key={doctor?.id}>
            <div className="doctor-card">
              <img
                src={`https://clinic-web-back.onrender.com/${doctor?.image}`}
                alt={doctor?.full_name}
                className="doctor-image"
              />
              <h3 className="doctor-name">{doctor?.full_name}</h3>
              <p className="doctor-position">{language==="uz"?doctor?.specialist_uz:language==="ru"?doctor?.specialist_ru:doctor?.specialist_eng}</p>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="team-button">
        <NavLink to="/doctors" className="btn btn-primary">
          {t.viewAllDoctors} <FaUserMd />
        </NavLink>
      </div>
    </section>
  );
}

export default Doctors;
