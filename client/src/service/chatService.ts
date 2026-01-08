import type { Chat } from "@/types/Chat";
import type { Message } from "@/types/Message";
import type { User } from "@/types/User";
import axios from "axios";
const GET_CHAT_API = import.meta.env.VITE_API_GET_CHAT_API;
const MESSAEGS_API = import.meta.env.VITE_API_MESSAEGS_API;
const GET_ALL_USER = import.meta.env.VITE_API_GET_ALL_USER;
const SEND_MESSAGE_API = import.meta.env.VITE_API_SEND_MESSAGE_API;

export const getChat = async (): Promise<{ chats: Chat[] }> => {
  const response = await axios.get<{ chats: Chat[] }>(GET_CHAT_API, {
    withCredentials: true,
  });
  return response.data;
};

export const getMessages = async (
  chatId: string
): Promise<{ messages: Message[] }> => {
  const response = await axios.get<{ messages: Message[] }>(
    `${MESSAEGS_API}/${chatId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getSearchContacts = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(GET_ALL_USER, {
    withCredentials: true,
  });
  return response.data;
};

export const sendMessages = async (
  newMessage: Message
): Promise<{ newMessage: Message }> => {
  const response = await axios.post<{ newMessage: Message }>(
    SEND_MESSAGE_API,
    { newMessage },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
