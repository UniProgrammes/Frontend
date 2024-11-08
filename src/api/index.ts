import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Types for auth
interface RegisterData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_number: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

// Create axios instance
export const client = axios.create({
  baseURL: API_URL,
});

// Add auth interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const register = async (data: RegisterData) => {
  const response = await client.post('/v1/users/register/', data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await client.post<LoginResponse>('/v1/users/login/', data);
  localStorage.setItem('accessToken', response.data.access);
  return response.data;
};

// Initialize auth on app load
export const initializeAuth = async () => {
  try {
    // You can modify these credentials as needed
    const credentials = {
      username: "perfect",
      password: "Hello1234"
    };

    // Try to login first
    await login(credentials);
  } catch (error) {
    // If login fails, try to register and then login
    try {
      await register({
        ...credentials,
        first_name: "John",
        last_name: "Doe",
        email: "perfection@yopmail.com",
        enrollment_number: "12345678"
      });
      await login(credentials);
    } catch (registerError) {
      console.error('Auth initialization failed:', registerError);
    }
  }
};
