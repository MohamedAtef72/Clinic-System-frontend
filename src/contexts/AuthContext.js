import React, { createContext, useContext, useState, useEffect } from "react";
import { currentUser, login as apiLogin, logout as apiLogout } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to fetch data and refresh auth state
  const refreshAuth = async () => {
    try {
      setLoading(true);
      const res = await currentUser();
      setUser(res.user);
      setIsAuthenticated(res.isAuthenticated);
    } catch (err) {
      console.error("Auth refresh failed:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  // Login function that updates state after successful login
  const login = async (data) => {
    try {
      await apiLogin(data);        // Call backend login
      await refreshAuth();         // Only refresh if login succeeded
    } catch (err) {
      // Don't refresh on error
      throw err;                   // Pass error back to Login.js
    }
  };

  // Logout function that clears state after logout
  const logout = async (data) => {
    try {
      await apiLogout(data);        // Call backend login
      await refreshAuth();         // Only refresh if login succeeded
    } catch (err) {
      // Don't refresh on error
      throw err;                   // Pass error back to Login.js
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
