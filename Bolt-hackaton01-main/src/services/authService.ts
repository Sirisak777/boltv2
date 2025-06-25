// services/authService.ts
import axios from 'axios';

const API = 'http://localhost:5000';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  shopName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = (data: RegisterData) => axios.post(`${API}/register`, data);
export const login = (data: LoginData) => axios.post(`${API}/login`, data);
