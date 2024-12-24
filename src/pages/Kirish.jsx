import React, { useState } from "react";
import { useLanguage } from "../translate/LanguageContext"; // Kontekstni import qilish
import translations from "../translate/Kirish"; // Tarjima faylini import qilish
import "../styles/kirish.css";
import { NavLink, useNavigate } from "react-router-dom";

function Kirish() {
  const { language } = useLanguage(); // Hozirgi tilni olish
  const t = translations[language].login; // Hozirgi tilga mos tarjimalar
  const navigate = useNavigate(); // Foydalanuvchini boshqa sahifaga yo'naltirish uchun

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // LocalStorage'dan foydalanuvchi ma'lumotlarini olish
    const users = JSON.parse(localStorage.getItem("users")) || [];


    // Email va parolni tekshirish
    const userIndex = users.findIndex((user) => user.email === email && user.password === password);
    console.log(userIndex);
    if (userIndex !== -1) {
      users[userIndex].isLoggedIn = true; // Foydalanuvchini tizimga kirgan deb belgilash
      localStorage.setItem("users", JSON.stringify(users));
      alert("tizimga kirdingiz");
      navigate("/user");
    } else {
      setError(t.errorMessage);
      alert("Nimadir xato bo'ldi")

    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2>{t.title}</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">{t.emailLabel}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            required
          />
          <label htmlFor="password">{t.passwordLabel}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.passwordPlaceholder}
            required
          />
          <button type="submit" className="login-btn">
            {t.button}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="signup-prompt">
          {t.signupPrompt}{" "}
          <NavLink to="/ro'yxatdan_o'tish">{t.signupLink}</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Kirish;
