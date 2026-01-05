import type { Chat } from "@/types/Chat";
import type { Message } from "@/types/Message";
import axios from "axios";
const CONTACTLIST_API = import.meta.env.VITE_API_CONTACTLIST;
const MESSAEGS_API = import.meta.env.VITE_API_MESSAEGS_API;

export const getChat = async (): Promise<{ chats: Chat[] }> => {
  const response = await axios.get<{ chats: Chat[] }>(CONTACTLIST_API, {
    withCredentials: true,
  });
  return response.data;
};

export const getMessages = async (
  chatId: string
): Promise<{ messages: Message[] }> => {
  const response = await axios.get<{ messages: Message[] }>(
    `{${MESSAEGS_API}/${chatId}}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
