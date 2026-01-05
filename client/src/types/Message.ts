import { type User } from "./User";

export interface Message {
  messageId?: string;
  sender: User;
  content: string;
  timestamp: Date;
}
