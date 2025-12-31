import "express-session";
export type UserRole = "admin" | "user" | "guest";

declare module "express-session" {
  interface SessionData {
    userId: string;
    lastName: string;
    userRole: UserRole;
    guestExpires?: Date;
  }
}

export interface SessionInfo {
  userId: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
}
