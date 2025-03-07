import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect } from "react";

interface User {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  profilePicture: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load stored token and user
    const storedToken = localStorage.getItem("token");
    // const storedUser = localStorage.getItem("user");
    // console.log(storedToken, storedUser);

    if (storedToken) {
        const decodedUser: User = jwtDecode(storedToken);
        setToken(storedToken);
        setUser(decodedUser);
    }
  }, []);

  const login = (user: User, token: string) => {
    console.log(user)
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
