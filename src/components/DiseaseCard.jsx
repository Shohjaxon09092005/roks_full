import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../translate/LanguageContext"; // Tanlangan tilni olish
import translations from "../translate/DiseasesPage"; // Tarjima ma'lumotlari
import { URL } from "../Admin/Utils/url";

function DiseaseCard() {
  const { language } = useLanguage(); // Foydalanuvchi tanlagan tilni olish
  const t = translations[language] || translations["uz"]; // Default qilib o‘zbek tilini qo‘llash
  //GET 
  const [dis, setDis] = useState(null);
  useEffect(() => {
    getDiseace()
  }, [])
  async function getDiseace() {
    let fetchDis = await fetch(`${URL}/encyclopedia-diseases`)
    let json = await fetchDis.json();
    let sortedDis = json?.encyclopedia_diseases.sort((a, b) => a.id - b.id);
    setDis(sortedDis);

  }


  return (

    <div className="disease-card">
      {dis?.map((item) => {
        return (
          <div key={item?.id} className="div_map">
            <img src={`https://clinic-web-back.onrender.com/${item?.image}`} alt={item?.name_uz} />
            <h3>{language === "uz" ? item?.name_uz : language === "ru" ? item?.name_ru : item?.name_eng}</h3>
            <p>{language === "uz" ? `${item?.description_uz.slice(0,40)}...` : language === "ru" ?  `${item?.description_ru.slice(0,40)}...`: `${item?.description_eng.slice(0,40)}...`}</p>
            <NavLink to={`/diseases/${item?.id}`}>
              <button>{t.readMore || "Batafsil o'qish"}</button>
            </NavLink>
          </div>
        )
      })}


    </div>
  );
}

export default DiseaseCard;
