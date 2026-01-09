import { type User } from "./User";

export interface Message {
  messageId?: string;
  sender: User["userId"];
  recipientUserId: User["userId"];
  content: string;
  timeStamp: Date;
}
