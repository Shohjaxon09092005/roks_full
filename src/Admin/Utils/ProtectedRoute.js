import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const ProtectedRoute = ({ element }) => {
    const encryptedStoredRole = Cookies.get('role');
    const decryptedStoredRole = CryptoJS.AES.decrypt(encryptedStoredRole, 'secret-key').toString(CryptoJS.enc.Utf8);
    return decryptedStoredRole === "super_admin"? element : <Navigate to="/home_admin" />;
};

export default ProtectedRoute;
