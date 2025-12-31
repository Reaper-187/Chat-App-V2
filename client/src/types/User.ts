type UserRole = "admin" | "user" | "guest";
export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userRole: UserRole;
  isAuthenticated: boolean;
  online: boolean;
}
