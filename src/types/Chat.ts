import type { Message } from "./Message";
import { type User } from "./User";

export interface Chat {
  chatId: string | null;
  participants: User[];
  messages: Message[] | [];
}
