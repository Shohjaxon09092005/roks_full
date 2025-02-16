import React, { useEffect, useReducer, useRef, useState } from "react";
import "../styles/contact.css";
import {  FaStar } from "react-icons/fa";
import { useLanguage } from "../translate/LanguageContext"; // Tilni boshqarish uchun
import translations from "../translate/Contact"; // Tarjima fayli
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { fetchTokens } from '../util/authUtil';
import { URL } from '../Admin/Utils/url';
import { refreshToken } from '../Admin/Utils/authRefreshToken';

function Contact() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const { language } = useLanguage(); // Foydalanuvchi tanlagan tilni olish
  const t = translations[language] || translations["uz"]; // Default qilib o‘zbek tilini ishlatish
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
  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHover(value);
  };

  const handleStarLeave = () => {
    setHover(0);
  };
  //get
  const [contact, setContact] = useState([])
  useEffect(() => {
    getContact()
  }, [])
  async function getContact() {
    let fetchCont = await fetch(`${URL}/about`);
    let jsonCont = await fetchCont.json();
    let sortedCont = jsonCont?.about.sort((a, b) => b.id - a.id);
    setContact(sortedCont[0])
  }
  //post form
  const [name, setName] = useState("")
  const [email, setemail] = useState("")
  const [message, setmessage] = useState("")
  async function submitContact(e) {
    e.preventDefault();
    if (!encryptedAccessToken && !encryptedStoredTime) {
      await fetchTokens()

    } else {
      const current_time = new Date();
      const stored_time = decryptedStoredTime;
      const timeDiff = (current_time - new Date(stored_time)) / 60000;
      let ready = {
        name: name,
        email: email,
        message: message
      }
      if (timeDiff < 9.5) {
        try {
          const responceSerCom = await fetch(`${URL}/contacts`, {
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
            alert("Xabaringiz qabul qilindi!")
            setName("")
            setemail("")
            setmessage("")

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
          submitContact(e); // Yangi token bilan qayta chaqirish
        } else {
          console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        }
      }


    }

  }
  // post feedback
  let name_f = useRef()
  let message_f = useRef()

  async function createFeedback(e) {
    e.preventDefault();
    if (!encryptedAccessToken && !encryptedStoredTime) {
      await fetchTokens()

    } else {
      const current_time2 = new Date();
      const stored_time2 = decryptedStoredTime;
      const timeDiff2 = (current_time2 - new Date(stored_time2)) / 60000;
      let ready2 = {
        name: name_f.current.value,
        message: message_f.current.value,
        rating: Number(rating)
      }
      if (timeDiff2 < 9.5) {
        try {
          const responceSerFd = await fetch(`${URL}/feedback`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${decryptedAccessToken}`,
            },
            body: JSON.stringify(ready2)
          });
          if (responceSerFd.ok) {
            const result = await responceSerFd.json();
            forceUpdate();
            console.log("Disease created successfully:", result);
            alert("Xabaringiz qabul qilindi!")
            name_f.current.value=""
            message_f.current.value=""
            setRating(0)

          } else if (responceSerFd.status === 401) {
            alert("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...")
            Cookies.remove("role");
          } else {
            alert("Xatolik yuz berdi:",
              `${responceSerFd.statusText} errors, or phone number may be valid.`)
          }


        } catch (error) {
          console.log("Serverga ulanishda xatolik:", error.message);
          alert("Serverga ulanishda xatolik:", error.message)
        }
      } else {
        // Tokenni yangilash
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          createFeedback(e); // Yangi token bilan qayta chaqirish
        } else {
          console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        }
      }


    }
  }
  //Get social
  const[social,setSocial]=useState([]);
  useEffect(()=>{
    getSocial()
  },[])
  async function getSocial() {
    let fetchSocial=await fetch(`${URL}/social-networks`);
    let jsonSocial=await fetchSocial.json();
    setSocial(jsonSocial?.social_networks)
    
  }
  
  

  return (
    <section className="contact-section">
      <h2 className="section-title">{t.contact.title}</h2>
      <p className="section-description">{t.contact.description}</p>
      <div className="container">
        <div className="contact-container">
          {/* Chap tomon: Form */}
          <div className="contact-form">
            <form onSubmit={(e) => submitContact(e)} >
              <label htmlFor="name">{t.contact.form.name}</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.form.namePlaceholder}
                required
                value={name}
              />
              <label htmlFor="email">{t.contact.form.email}</label>
              <input
                value={email}
                type="email"
                id="email"
                name="email"
                placeholder={t.contact.form.emailPlaceholder}
                required
                onChange={(e) => setemail(e.target.value)}
              />
              <label htmlFor="message">{t.contact.form.message}</label>
              <textarea
                value={message}
                id="message"
                name="message"
                placeholder={t.contact.form.messagePlaceholder}
                rows="5"
                required
                onChange={(e) => setmessage(e.target.value)}
              ></textarea>
              <button type="submit" className="submit-btn">
                {t.contact.form.submit}
              </button>
            </form>
          </div>

          {/* O'ng tomon: Ma'lumot */}
          <div className="contact-info">
            <h3>{t.contact.info.title}</h3>
            <p>
              <i className="fas fa-phone"></i> {contact?.phone_number}
            </p>
            <p>
              <i className="fas fa-envelope"></i> {contact?.email}
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i> {contact?.address}
            </p>
            <h4>{t.contact.info.social}</h4>
            <div className="social-icons">
              {social?.map((item)=>{
                return(
                  <a key={item?.id} href={item?.link}>
                  <i className="fab fa-telegram">
                    <img className="social_icon" src={`https://clinic-web-back.onrender.com/${item?.image}`} alt={item?.name} />
                  </i>
                </a>
                )
              })}
             
             
            </div>

            <div className="map-container">
              <iframe
                title={t.contact.info.mapTitle}
                src={contact?.location}
                width="100%"
                height="400"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Fikrlar va Reyting Qismi */}
        <div className="feedback-section">
          <h3 className="feedback-title">{t.contact.feedback.title}</h3>
          <form onSubmit={(e) => createFeedback(e)} className="feedback-form">
            <label htmlFor="feedback-name">{t.contact.feedback.name}</label>
            <input
              ref={name_f}
              type="text"
              id="feedback-name"
              name="name"
              placeholder={t.contact.feedback.namePlaceholder}
              required
            />
            <label htmlFor="feedback-message">{t.contact.feedback.message}</label>
            <textarea
              ref={message_f}
              id="feedback-message"
              name="message"
              placeholder={t.contact.feedback.messagePlaceholder}
              rows="4"
              required
            ></textarea>

            {/* Reyting (Yulduzchalar) */}
            <div className="star-rating">
              <p>{t.contact.feedback.rating}</p>
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  size={24}
                  className={`star ${value <= (hover || rating) ? "active" : ""}`}
                  onClick={() => handleStarClick(value)}
                  onMouseEnter={() => handleStarHover(value)}
                  onMouseLeave={handleStarLeave}
                />
              ))}
            </div>

            <button type="submit" className="feedback-submit-btn">
              {t.contact.feedback.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
