import { type User } from "./User";
import { type Message } from "./Message";

export interface Chat {
  chatId: string;
  participants: [User, User]; // genau 2 User in einem Chat
  lastMessage?: Message;
  unreadCount: number; // counter
}
