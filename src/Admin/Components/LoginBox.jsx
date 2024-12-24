import React, { useState } from 'react';
import '../AdminStyles/loginBox.css';
import logo from "../Images/Roks.png"; // Logotip tasvirining to'g'ri manzilini kiriting
import illustration from "../Images/loginImages-removebg-preview.png"; // Tasvir uchun yo'l

function LoginBox() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); // Formani default yuborilishini oldini olish
    if (username === 'admin' && password === 'admin') {
      // To'g'ri ma'lumotlar kiritilgan bo'lsa
      setError('');
      alert('Welcome to Admin Panel'); // Bu o'rniga Admin Panelga yo'naltirishingiz mumkin
      window.location.href = '/admin-panel'; // Admin panel sahifasiga yo'naltirish
    } else {
      // Noto'g'ri ma'lumotlar kiritilgan bo'lsa
      setError('Incorrect username or password');
    }
  };

  return (
    <div className="loginBox-container">
      <div className="login-box">
        <div className="logo">
          <img src={logo} alt="digikala" />
        </div>
        <h2 className="login-title">Login Into Your Account</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              id="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
      <div className="login-illustration">
        <img src={illustration} alt="illustrator key" />
      </div>
    </div>
  );
}

export default LoginBox;
