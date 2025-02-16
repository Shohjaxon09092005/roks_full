import React, { useEffect, useReducer, useState } from 'react';
import '../AdminStyles/loginBox.css';
import logo from "../Images/Roks.png";
import illustration from "../Images/loginImages-removebg-preview.png";
import { URL } from '../Utils/url';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { refreshToken } from '../Utils/authRefreshToken';
import { useNavigate } from 'react-router-dom';
import { fetchTokens } from '../../util/authUtil';
import { compareSync } from "bcrypt-ts";

function LoginBox() {
  const navigate = useNavigate();
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
  const [role, setRole] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const encryptedAccessToken = Cookies.get('access_token');
    const encryptedStoredTime = Cookies.get('stored_time');

    const decryptedAccessToken = encryptedAccessToken
      ? CryptoJS.AES.decrypt(encryptedAccessToken, 'secret-key').toString(CryptoJS.enc.Utf8)
      : null;

    const decryptedStoredTime = encryptedStoredTime
      ? CryptoJS.AES.decrypt(encryptedStoredTime, 'secret-key').toString(CryptoJS.enc.Utf8)
      : null;

    async function getRole() {
      if (!decryptedAccessToken || !decryptedStoredTime) {
        await fetchTokens();
      } else {
        const current_time = new Date();
        const stored_time = new Date(decryptedStoredTime);
        const timeDiff = (current_time - stored_time) / 60000;

        if (timeDiff < 9.5) {
          try {
            const responseRole = await fetch(`${URL}/user`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${decryptedAccessToken}`,
              },
            });

            if (responseRole.ok) {
              let resultRole = await responseRole.json();
              let sortedRole = resultRole?.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              setRole(sortedRole);
              forceUpdate();
            }
          } catch (error) {
            console.error('Error fetching user roles:', error);
          }
        } else {
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            getRole();
          } else {
            console.log("Token yangilanmadi. Login sahifasiga o'ting.");
            navigate('/admin');
          }
        }
      }
    }
    getRole();
  }, [update, navigate]);

  function saveEncryptedCookie(name, value) {
    const encryptedValue = CryptoJS.AES.encrypt(value, 'secret-key').toString();
    Cookies.set(name, encryptedValue, { expires: 140, path: '' });
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin') {
      let readyPost = {
        login: "dev",
        password: "qwerty2404",
      };

      try {
        let fetchData = await fetch(`${URL}/auth/login`, {
          method: "POST",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify(readyPost)
        });

        if (fetchData.ok) {
          let data = await fetchData.json();
          saveEncryptedCookie('access_token', data.tokens.access_token);
          saveEncryptedCookie('stored_time', new Date().toISOString());
          saveEncryptedCookie('refresh_token', data.tokens.refresh_token);
          saveEncryptedCookie('user_id', data.user.id);
          alert('Welcome to Admin Panel');
          window.location.href = '/admin-panel';
        } else {
          toast.error("Логин ёки Парол хато");
        }
      } catch (error) {
        console.error('Xato yuz berdi:', error);
      }
      return;
    }

    const user = role.find(item => item?.login === username);
    if (!user) {
      setError('Логин ёки Парол хато');
      toast.error("Логин ёки Парол хато");
      return;
    }

    const isPasswordValid = compareSync(password, user?.hashed_password);
    if (!isPasswordValid ) {
      setError('Логин ёки Парол хато');
      toast.error("Логин ёки Парол хато");
      return;
    }

    let readyPost = {
      login: "dev",
      password: "qwerty2404",
    };

    try {
      let fetchData = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(readyPost)
      });

      if (fetchData.ok) {
        let data = await fetchData.json();
        saveEncryptedCookie('access_token', data.tokens.access_token);
        saveEncryptedCookie('stored_time', new Date().toISOString());
        saveEncryptedCookie('refresh_token', data.tokens.refresh_token);
        saveEncryptedCookie('user_id', data.user.id);
        saveEncryptedCookie('role', user?.role);
        saveEncryptedCookie('full_name', user?.full_name);
        alert('Welcome to Admin Panel');
        window.location.href = '/admin-panel';
      } else {
        toast.error("Логин ёки Парол хато");
      }
    } catch (error) {
      console.error('Xato yuz berdi:', error);
    }
  };

  return (
    <div className="loginBox-container">
      <div className="login-box">
        <div className="logo">
          <img src={logo} alt="digikala" />
        </div>
        <h2 className="login-title">Admin panelga kirish</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Login</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Kirish</button>
        </form>
      </div>
      <div className="login-illustration">
        <img src={illustration} alt="illustrator key" />
      </div>
    </div>
  );
}

export default LoginBox;
