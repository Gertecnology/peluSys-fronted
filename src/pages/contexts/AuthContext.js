import  {createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = "Mwzk0B4C4OK4h9bYuPsmoJHyldt0SmpS";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const encryptedUser = Cookies.get('user');
    if (encryptedUser) {
      const bytes = CryptoJS.AES.decrypt(encryptedUser, ENCRYPTION_KEY);
      return JSON.parse( bytes.toString(CryptoJS.enc.Utf8) )
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      const encryptedToken =  CryptoJS.AES.encrypt(JSON.stringify(user), ENCRYPTION_KEY).toString();
      Cookies.set('user', encryptedToken, { expires: 7 });
    } else {
      Cookies.remove('user');
    }
  }, [user]);


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
