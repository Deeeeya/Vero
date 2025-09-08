// import createContext, useContext, useState, useEffect, ReactNode from react
// import authService and User interface
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";
import type { User } from "../types/auth";

// Provider component that wraps your app, call it AuthProvider
// Implement useState and useEffect
// Check if user is logged in when app starts
// User has token, assume they're logged in
// Set a placeholder user
// We're done checking
// Actually run that funtion
// [] means "only run this once when component first loads"
// Login function
// Logout function
// Create value object with necessary functions
// return the AuthContext element with value

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
