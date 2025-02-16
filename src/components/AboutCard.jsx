import React, { useEffect, useState } from "react";
import "../styles/aboutCard.css";
import { useLanguage } from "../translate/LanguageContext"; // Til kontekstidan foydalanamiz
import translations from "../translate/TranslationAboutCard"; // Tarjimalarni import qilamiz
import { URL } from "../Admin/Utils/url";

function AboutCard() {
  const { language } = useLanguage(); // Faol tilni olish
  const t = translations[language]; // Tarjimani tanlash
  //GET
  const [value, setValue] = useState(null);
  useEffect(() => {
    getValue()
    getAbout()
  }, [])
  async function getValue() {
    let fetchValue = await fetch(`${URL}/values`);
    let json = await fetchValue.json();
    let sortedJsonValue = json?.values.sort((a, b) => a.id - b.id);
    setValue(sortedJsonValue);
  }

  //GET2
  const [about, setAbout] = useState(null)
  async function getAbout() {
    let fetchAbout = await fetch(`${URL}/about`);
    let json = await fetchAbout.json();
    let sortedAbout = json?.about.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    
    setAbout(sortedAbout)

  }

  console.log(about);

  return (
    <div className="home-container">
      {/* Klinika haqida */}
      {about?.slice(0,1).map((item)=>{
        return(
          <section className="about_section">
          <h1 className="section_title">{t.aboutTitle}</h1>
          <p className="about_description">{language==="uz"?item?.description_uz:language==="ru"?item?.description_ru:item?.description_eng}</p>
          <div className="about_stats">
            <div className="stat_item">
              <h3>{item?.experience}+</h3>
              <p>{t.experience}</p>
            </div>
            <div className="stat_item">
              <h3>{item?.customer}+</h3>
              <p>{t.satisfiedClients}</p>
            </div>
            <div className="stat_item">
              <h3>{item?.specialist}+</h3>
              <p>{t.specialists}</p>
            </div>
          </div>
        </section>
        )
      })}
     

      {/* Bizning qadriyatlar */}
      <section className="values_section">
        <h2 className="section_title">{t.valuesTitle}</h2>
        <div className="values_container">
          {value?.map((item) => {
            return (
              <div key={item?.id} className="value_item">
                <h3>{language === "uz" ? item?.name_uz : language === "ru" ? item?.name_ru : item?.name_eng}</h3>
                <p>{language === "uz" ? item?.description_uz : language === "ru" ? item?.description_ru : item?.description_eng}</p>
              </div>
            )
          })}


        </div>
      </section>
    </div>
  );
}

export default AboutCard;
