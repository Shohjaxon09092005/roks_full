import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
export const URL= "https://clinic-web-back.onrender.com/api"       

// Shifrlangan ma'lumotni Cookie'ga yozish funksiyasi
export const saveEncryptedCookie = (name, value, expires = 140) => {
    const encryptedValue = CryptoJS.AES.encrypt(value, 'secret-key').toString(); // "secret-key"ni xavfsiz saqlang
    Cookies.set(name, encryptedValue, { expires, path: '/' });
};

// Cookie'dan shifrlangan ma'lumotni o'qish funksiyasi
export const getDecryptedCookie = (name) => {
    const encryptedValue = Cookies.get(name);
    if (!encryptedValue) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedValue, 'secret-key');
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Token olish funksiyasi
export const fetchTokens = async () => {
    let readyPost = {
        login: "dev",
        password: "qwerty2404",
        
      }
    try {
        const response = await fetch(`${URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(readyPost),
        });

        if (response.ok) {
            const data = await response.json();
            saveEncryptedCookie('access_token', data.tokens.access_token);
            saveEncryptedCookie('refresh_token', data.tokens.refresh_token);
            saveEncryptedCookie('user_id', data.user.id);
            saveEncryptedCookie('stored_time', new Date().toISOString());
            return data; // Tokenlar va foydalanuvchi ma'lumotlarini qaytaradi
        } else {
            console.error('Login muvaffaqqiyatsiz:', response.status);
            throw new Error('Login yoki parol noto‘g‘ri!');
        }
    } catch (error) {
        console.error('Token olishda xatolik:', error);
        throw error;
    }
};