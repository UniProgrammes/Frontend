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

// Types for programmes and courses
interface Programme {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  degree_type: string;
  credits: string;
  courses: string[];
}

interface ProgrammeResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Programme[];
}

interface Course {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  code: string;
  credits: string;
  educational_level: string;
  description: string;
  main_area: string;
  learning_outcomes: string[];
  prerequisites: string[];
}

export interface StudyPlan {
  id: string,
  name: string,
  status: string,
  created_at: string,
  updated_at: string
}

export interface StudyPlanResponse {
  count: number,
  next: string | null,
  previous: string | null,
  results: []
}

// Create axios instance
export const client = axios.create({
  baseURL: API_URL,
});

// Add auth interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const register = async (data: RegisterData) => {
  const response = await client.post("/v1/users/register/", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await client.post<LoginResponse>("/v1/users/login/", data);
  localStorage.setItem("accessToken", response.data.access);
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
      console.error("Auth initialization failed:", registerError);
    }
  }
};

// API functions
export const getAllProgrammes = async () => {
  const response = await client.get<ProgrammeResponse>("/v1/programmes/");
  return response.data.results;
};

// Update the Course response interface
interface CourseResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Course[];
}

// Update the getAllCourses function
export const getAllCourses = async () => {
  const response = await client.get<CourseResponse>("/v1/courses/");
  return response.data.results; // Return the results array instead of response.data
};

export const getAllStudyPlans = async () => {
  const response = await client.get<StudyPlanResponse>("/v1/users/me/study-plans");
  return response.data.results;
}
