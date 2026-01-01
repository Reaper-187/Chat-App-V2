import { type User } from "./User";

export interface Message {
  messageId: string;
  sender: User["userId"];
  content: string;
  imageUrl?: string;
  timestamp: Date;
}
