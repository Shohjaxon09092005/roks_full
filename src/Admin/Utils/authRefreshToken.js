// authService.js
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { URL } from "../Utils/url";

export async function refreshToken() {
    const encryptedRefreshToken = Cookies.get('refresh_token');
    const encryptedUserId = Cookies.get('user_id');

    if (!encryptedRefreshToken || !encryptedUserId) {
        console.error('Refresh token yoki user_id topilmadi.');
        return null;
    }

    // Refresh tokenni dekodlash
    const decryptedRefreshToken = CryptoJS.AES.decrypt(encryptedRefreshToken, 'secret-key').toString(CryptoJS.enc.Utf8);
    const decryptedUserId = CryptoJS.AES.decrypt(encryptedUserId, 'secret-key').toString(CryptoJS.enc.Utf8);

    try {
        const response = await fetch(`${URL}/auth/refresh`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                userId: decryptedUserId,
                refreshToken: decryptedRefreshToken,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            // Yangi tokenlarni saqlash
            const current_time = new Date().toISOString();
            saveEncryptedCookie('refresh_token', data?.refresh_token);
            saveEncryptedCookie('access_token', data?.access_token);
            saveEncryptedCookie('stored_time', current_time);

            return data?.access_token; // Yangi access tokenni qaytaradi
        } else {
            console.error('Refresh token yangilanishida xatolik:', response.status);
            Cookies.remove('refresh_token');
            Cookies.remove('access_token');
            Cookies.remove('stored_time');
            return null;
        }
    } catch (error) {
        console.error('Serverga ulanishda xatolik:', error.message);
        return null;
    }
}

function saveEncryptedCookie(name, value) {
    const encryptedValue = CryptoJS.AES.encrypt(value, 'secret-key').toString();
    Cookies.set(name, encryptedValue, { expires: 7, path: '' });
}
