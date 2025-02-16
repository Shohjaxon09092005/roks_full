import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import "../styles/doctorsApp.css";
import { NavLink } from "react-router-dom";
import translations from "../translate/TranslationDoctorsPage";
import { useLanguage } from "../translate/LanguageContext";
import { URL } from "../Admin/Utils/url";

function DoctorsPage() {
  const { language } = useLanguage(); // Faol tilni olish
  const t = translations[language]; // Tilga mos tarjimalarni yuklash

  const [doc, setDoc] = useState(4);

  function showMore() {
    setDoc(doc + 4);
  }
  function showLess() {
    setDoc(4);
  }
  //GET
  const [getDoc, setGetDoc] = useState([]);
  useEffect(() => {
    getDocData()
  }, [])
  async function getDocData() {
    let fetchDoc = await fetch(`${URL}/doctors`);
    let jsonDoc = await fetchDoc.json();
    let sortedDoc = jsonDoc?.doctors?.sort((a, b) => b.id - a.id);
    setGetDoc(sortedDoc);

  }


  return (
    <section className="new-doctors-page">
      <h2 className="section-title">{t.pageTitle}</h2>
      <p className="section-description">{t.pageDescription}</p>
      <div className="new-doctors-grid">
        {getDoc?.slice(0, doc).map((doctor) => (
          <NavLink to={`/DoctorsAbout/${doctor?.id}`} key={doctor?.id}>
            <div className="doctor-card">
              <img
                src={`https://clinic-web-back.onrender.com/${doctor?.image}`}
                alt={doctor?.full_name}
                className="doctor-image"
              />
              <div className="doctor-info">
                <h3 className="doctor-name">{doctor?.full_name}</h3>
                <p className="doctor-position">{language==="uz"?doctor?.specialist_uz:language==="ru"?doctor?.specialist_ru:doctor?.specialist_eng}</p>
                <p className="doctor-bio">{language==="uz"?doctor?.description_uz:language==="ru"?doctor?.description_ru:doctor?.description_eng}</p>
                <div className="doctor-rating">
                  {Array.from(
                    { length: Math.floor(3.2) },
                    (_, i) => (
                      <FaStar key={i} className="star-icon" />
                    )
                  )}
                  {3.2 % 1 !== 0 && <FaStar className="half-star-icon" />}
                  <span className="rating-number">
                    {3.2.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="doctors-buttons">
        {getDoc?.length > doc? (
          <button className="btn btn-primary" onClick={showMore}>
            {t.showMore}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={showLess}>
            {t.showLess}
          </button>
        )}
      </div>
    </section>
  );
}

export default DoctorsPage;
