import axios from "axios";

import useMainStore from "~/stores/mainStore";
import { User } from "~/types/users";

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
  created_at: string,
  updated_at: string,
  name: string,
  status: string,
  user: number,
  courses: string[]
}

export interface StudyPlanGetResponse {
  count: number,
  next: string | null,
  previous: string | null,
  results: StudyPlan[];
}

interface CourseListPost {
    id: string;
    semester: number;
}

// Create axios instance
export const client = axios.create({
  baseURL: API_URL,
});

// Add auth interceptor
client.interceptors.request.use((config) => {
  const token = useMainStore.getState().accessToken;
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
  const response = await client.post<LoginResponse>("/v1/users/login/", data);
  localStorage.setItem("accessToken", response.data.access);
  return response.data;
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
  const response = await client.get<StudyPlanGetResponse>("/v1/study-plans");
  return response.data.results;
};

export const saveStudyPlan = async (studyPlan: {name: string}) => {
  const response = await client.post<StudyPlan>("/v1/study-plans/", studyPlan);
  console.log(response.data);
  return response.data;
};

export const addCoursesToStudyPlan = async (studyPlan: StudyPlan, courses: {courses: CourseListPost[]}) => {
  const response = await client.post(`/v1/study-plans/${studyPlan.id}/courses/`, courses);
  return response.data;
}
