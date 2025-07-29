// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

  );

  const login = (user) => {
  localStorage.setItem("user", JSON.stringify(user));

    setCurrentUser(user);
  };
  const logout = () =>
    {
  localStorage.removeItem("user");
     setCurrentUser(null);
    };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; // <-- default export
