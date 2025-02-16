import React, { useEffect, useState } from "react";
import "../styles/feedBack.css";
import { FaStar } from "react-icons/fa"; // Reyting yulduzlari uchun
import Slider from "react-slick"; // Slayder kutubxonasi
import { useLanguage } from "../translate/LanguageContext"; // Til konteksti
import translations from "../translate/TranslationFeedBack"; // Tarjimalar
import { URL } from "../Admin/Utils/url";

function FeedBack() {
  const { language } = useLanguage();
  const t = translations[language];


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  //get
  const[feed,setFeed]=useState([]);
  useEffect(()=>{
    fetFeed()
  },[])
  async function fetFeed() {
    let fetchFeed=await fetch(`${URL}/feedback`);
    let jsonFeed=await fetchFeed.json();
    let sortFeed=jsonFeed?.feedback.sort((a,b)=>b.id-a.id);
    setFeed(sortFeed)
  }

  return (
    <section className="feedback-section">
      <h2 className="section-title">{t.feedbackTitle}</h2>
      <Slider {...settings}>
        {feed?.map((feedback) => (
          <div className="feedback-card" key={feedback.id}>
            <div className="feedback-content">
              <h3 className="customer-name">{feedback?.name}</h3>
              <p className="customer-comment">"{feedback?.message}"</p>
              <div className="customer-rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < feedback?.rating ? "#ffc107" : "#e4e5e9"}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default FeedBack;
