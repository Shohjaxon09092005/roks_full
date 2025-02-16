import React, { useEffect, useReducer, useState } from "react";
import { useLanguage } from "../translate/LanguageContext"; // Kontekstni import qilish
import translations from "../translate/Online"; // Tarjima faylini import qilish
import "../styles/online.css";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { fetchTokens } from '../util/authUtil';
import { URL } from '../Admin/Utils/url';
import { refreshToken } from '../Admin/Utils/authRefreshToken';
import { useNavigate } from "react-router-dom";

function Online() {
  const { language } = useLanguage(); // Hozirgi tilni olish
  const t = translations[language]; // Hozirgi til tarjimalari
  // Update
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
  useEffect(() => {
  }, [update])


  //navigate
  let navigate = useNavigate()

  // Shifrlangan ma'lumotni cookie'dan olish
  const encryptedAccessToken = Cookies.get('access_token');
  const encryptedStoredTime = Cookies.get('stored_time');

  // Ma'lumotni dekodlash
  const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8);
  const decryptedStoredTime = CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8);

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [desc, setDesc] = useState("")



  //get
  const [serOn, setSerOn] = useState('')
  function onChangeId(e) {
    e.preventDefault()
    setSerOn(e.target.value)
  }

  const [onlineSer, setOnlineSer] = useState([]);
  useEffect(() => {
    getSerOnline()
  }, [])
  async function getSerOnline() {
    let fetchSeronline = await fetch(`${URL}/services`);
    let jsonSerOnline = await fetchSeronline.json();
    setOnlineSer(jsonSerOnline?.services)

  }
  //post
  async function handleSubmit(e) {
    e.preventDefault();
    if (!encryptedAccessToken && !encryptedStoredTime) {
      await fetchTokens()

    } else {
      const current_time = new Date();
      const stored_time = decryptedStoredTime;
      const timeDiff = (current_time - new Date(stored_time)) / 60000;
      let ready = {
        full_name: name,
        email: email,
        phone_number: phone,
        date: date,
        time: time,
        service_id: Number(serOn),
        description: desc
      }
      if (timeDiff < 9.5) {
        try {
          const responceSerCom = await fetch(`${URL}/acceptance`, {
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
            alert("Ma'lumotlar muvaffaqiyatli yuborildi!")
            setName("")
            setEmail("")
            setPhone("")
            setDate("")
            setTime("")
            setSerOn("")
            setDesc("")

          } else if (responceSerCom.status === 401) {
            alert("Token yaroqsiz. Login sahifasiga yo'naltirilmoqda...")
            Cookies.remove("role");
            navigate("/admin");
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
          handleSubmit(e); // Yangi token bilan qayta chaqirish
        } else {
          console.log("Token yangilanmadi. Login sahifasiga o'ting.");
          navigate('/admin');
        }
      }


    }

  };
  return (
    <div className="container">
      <div className="appointment-container">
        <h2>{t.title}</h2>
        <p>{t.description}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.form.fullName}</label>
            <input
              type="text"
              name="fullName"
              value={name}
              onChange={(e) => setName(e.target.value)}

              placeholder={t.form.fullNamePlaceholder}
              required
            />
          </div>
          <div className="form-group">
            <label>{t.form.email}</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.form.emailPlaceholder}
              required
            />
          </div>
          <div className="form-group">
            <label>{t.form.phone}</label>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.form.phonePlaceholder}
              required
            />
          </div>
          <div className="form-group">
            <label>{t.form.date}</label>
            <input
              type="date"
              name="date"
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t.form.time}</label>
            <input
              type="time"
              name="time"
              value={time}
              required
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>{t.form.services}</label>
            <select onChange={(e) => onChangeId(e)} style={{ width: "100%" }} name="services" >
              {onlineSer?.map((item) => {
                return (
                  <option value={item?.id} key={item?.id} >
                    {language === "uz" ? item?.name_uz : language === "ru" ? item?.name_ru : item?.name_eng}
                  </option>
                )

              })}

            </select>

          </div>
          <div className="form-group">
            <label>{t.form.message}</label>
            <textarea
              name="message"
              value={desc}
              placeholder={t.form.messagePlaceholder}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">
            {t.form.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Online;
