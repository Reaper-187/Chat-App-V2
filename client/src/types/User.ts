type UserRole = "admin" | "user" | "guest";
export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userRole: UserRole;
  isAuthenticated: boolean;
}

export interface UserInfoResponse {
  userInfo: {
    userId: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatarUrl?: string;
    userRole: UserRole;
    isAuthenticated: boolean;
  };
}
