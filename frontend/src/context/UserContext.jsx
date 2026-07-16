import React, { createContext, useContext, useState } from "react";
import { createUser, getUser } from "../services/api";

const UserContext = createContext(null);

function getInitialUser() {
  try {
    const stored = localStorage.getItem("finloan_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("finloan_user");
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  const registerOrLogin = async (name, email) => {
    try {
      const res = await createUser({ name, email });
      setUser(res.data);
      localStorage.setItem("finloan_user", JSON.stringify(res.data));
      localStorage.setItem("finloan_auth", "true");
      return res.data;
    } catch (err) {
      if (err.response?.status === 409) {
        throw new Error("Email already exists. Please use a different email.");
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("finloan_user");
    localStorage.removeItem("finloan_auth");
  };

  return (
    <UserContext.Provider value={{ user, loading, registerOrLogin, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
