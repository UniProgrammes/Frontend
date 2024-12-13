import { AxiosError } from "axios";
import { client } from "~/api";

type HelpMessagePayload = {
  question_text: string;
  user_email: string;
};

export const sendHelpMessage = async (data: HelpMessagePayload): Promise<string | undefined> => {
  try {
    const response = await client.post<string>("/questions/", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const data = error.response?.data as { detail?: string };
      return data?.detail || String(error);
    }
    return String(error);
  }
};