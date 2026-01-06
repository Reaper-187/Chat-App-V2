import { type User } from "./User";

export interface Message {
  messageId?: string;
  sender: User;
  recipientUserId: User["userId"];
  content: string;
  timestamp: Date;
}
