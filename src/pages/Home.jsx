import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Service from "../components/Service";
import Doctors from "../components/Doctors";
import FeedBack from "../components/FeedBack";
import { NavLink } from "react-router-dom";
import AboutCard from "../components/AboutCard";
import translations from "../translate/Translate"; // Tarjima matnlarini import
import { useLanguage } from "../translate/LanguageContext"; // Tilni olish uchun
import { URL } from "../Admin/Utils/url";

function Home() {
  const { language } = useLanguage(); // Faol tilni olish
  const t = translations[language]; // Faol tilga mos tarjimalar
  //GET 
  const [slider, setSlider] = useState(null);
  useEffect(() => {
    getSlider()
  }, [])
  async function getSlider() {
    let fetchSlider = await fetch(`${URL}/useful-news`);
    let json = await fetchSlider.json();
    const sortedSlider = json?.useful_news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setSlider(sortedSlider);

  }
  const sliceSlider=slider?.slice(0,4);
  
  //Rang o'zgarishi
  const getBackgroundColor = (index) => {
    const colors = ["#ff5733", "#33c1ff", "#75ff33"];
    return colors[index % colors.length];
  };

  return (
    <div className="home">
      <section className="about-section">
        <video autoPlay loop muted className="background-video">
          <source
            src="https://videos.pexels.com/video-files/9574137/9574137-uhd_2732_1440_25fps.mp4"
            type="video/mp4"
          />
          {t.browserNotSupportVideo}
        </video>
        <div className="section_black">
          <h1 className="title">{t.clinicTitle}</h1>
          <p className="description">{t.clinicDescription}</p>
          <NavLink to="/qabul">
            <button className="online-appointment-btn">
              {t.online}
            </button>
          </NavLink>
        </div>
      </section>

      <div className="home-page">
        <section className="slider-section">
          <div className="slider">
            {sliceSlider?.slice(0,3).map((item,index) => {
              return (
                <div key={index} className="slide" style={{ backgroundColor:getBackgroundColor(index) }}>
                  <h2>{language === "uz" ? item.name_uz : language === "ru" ? item.name_ru : item.name_eng}</h2>
                  <p> {language === "uz"
                ? item.description_uz
                : language === "ru"
                ? item.description_ru
                : item.description_eng}</p>
                </div>
              )
            })}


          </div>
        </section>
      </div>

      <div className="container">
        <AboutCard />
        <Service limit={12} showAll={false} />
        <Doctors limit={4} showAll={false} />
        <FeedBack />
      </div>
    </div>
  );
}

export default Home;
