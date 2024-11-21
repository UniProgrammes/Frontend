import { AxiosError } from "axios";
import { camelizeKeys, Decamelized } from "humps";

import { client } from "~/api";
import { User } from "~/types/users";


export const getMe = async (): Promise<User | string> => {
  try {
    const response = await client.get<Decamelized<User>>("/v1/users/me/");
    return camelizeKeys(response.data) as User;
  } catch (error) {
    if (error instanceof AxiosError) {
      const data = error.response?.data as { detail?: string };
      return data?.detail || String(error);
    }
    return String(error);
  }
}