// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as authService from '../services/authService';
import type { RegisterData, LoginData } from '../services/authService';

interface User {
  id: number;
  email: string;
  name?: string;
  shopName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    shopName: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);   // เพิ่ม

  const isAuthenticated = !!user;                       // เพิ่ม

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password } as LoginData);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    shopName: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
