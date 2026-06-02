import React, { createContext, useContext, useState, useEffect } from "react";
import { currentUser } from '../services/userService';
import { login as apiLogin, logout as apiLogout } from '../services/authService';
import queryClient from '../queryClient';

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
      await apiLogin(data);
      await refreshAuth();
    } catch (err) {
      throw err;
    }
  };

  // Logout function that clears state directly (no extra /Auth/Me round-trip)
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Swallow errors — still clear local state so the UI resets
    } finally {
      // Wipe ALL TanStack Query cache so the next user never sees stale data
      queryClient.clear();
      setUser(null);
      setIsAuthenticated(false);
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
