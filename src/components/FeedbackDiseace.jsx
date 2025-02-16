import React, { useEffect, useReducer, useState } from "react";
import "../styles/diseaceFeedback.css";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { fetchTokens } from '../util/authUtil';
import { URL } from '../Admin/Utils/url';
import { refreshToken } from '../Admin/Utils/authRefreshToken';
import { useParams } from "react-router-dom";
function FeedbackDiseace({ title, placeholder, btn_submit, success, success_desc }) {
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams();
  //post
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


  async function handleSubmit(e) {
    e.preventDefault();
    if (!encryptedAccessToken && !encryptedStoredTime) {
      await fetchTokens()

    } else {
      const current_time = new Date();
      const stored_time = decryptedStoredTime;
      const timeDiff = (current_time - new Date(stored_time)) / 60000;
      let ready = {
        ed_id: Number(id),
        feedback: comment
      }
      if (timeDiff < 9.5) {
        try {
          const responceSerCom = await fetch(`${URL}/ed-feedback`, {
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
            submitComment();

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
          handleSubmit(e); // Yangi token bilan qayta chaqirish
        } else {
          console.log("Token yangilanmadi. Login sahifasiga o'ting.");
        }
      }


    }

  };

  const submitComment = () => {
    setSubmitted(true); // Formani yuborilgan holatga o‘tkazish

    // Jo‘natilgandan keyin 3 soniyada formani qayta ochish
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
    }, 3000);
  };



  return (
    <div className="disease-feedback">
      {!submitted ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <h3 className="comment-title">{title}</h3>
          <textarea
            className="comment-textarea"
            placeholder={placeholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button type="submit" className="comment-button">{btn_submit}</button>
        </form>
      ) : (
        <div className="comment-success">
          <h3 className="success-title">{success}</h3>
          <p>{success_desc}</p>
        </div>
      )}


    </div>
  );
}

export default FeedbackDiseace;
