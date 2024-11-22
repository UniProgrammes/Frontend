import { AxiosError } from "axios";
import { decamelizeKeys } from "humps";

import { client } from "~/api";
import { User } from "~/types/users";

type LoginResponse = {
  access: string;
  refresh: string;
}

export const login = async (data: {
  username: string;
  password: string;
}): Promise<LoginResponse | string> => {
  try {
    const response = await client.post<LoginResponse>("/v1/users/login/", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const data = error.response?.data as { detail?: string };
      return data?.detail || String(error);
    }
    return String(error);
  }
};


type RegisterPayload = {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  enrollmentNumber: string;
  password: string;
  confirmPassword: string;
}

export const register = async (data: RegisterPayload): Promise<User | string> => {
  try {
    const response = await client.post<User>("/v1/users/register/", decamelizeKeys(data));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const data = error.response?.data as { detail?: string };
      return data?.detail || String(error);
    }
    return String(error);
  }
};