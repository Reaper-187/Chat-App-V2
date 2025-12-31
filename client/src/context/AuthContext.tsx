import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/service/services";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loadingSpinner: string;
}

type LoadingStatus = "loading" | "authenticated" | "unauthenticated";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loadingSpinner, setLoadingSpinner] =
    useState<LoadingStatus>("loading");

  const [user, setUser] = useState<User | null>(null);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: getUserInfo,
  });

  useEffect(() => {
    if (isLoading) {
      setLoadingSpinner("loading");
    } else if (error || !userData?.isAuthenticated) {
      setUser(null);
      setLoadingSpinner("unauthenticated");
    } else if (userData?.isAuthenticated) {
      setUser({
        isAuthenticated: true,
        userId: userData.userId,
        userRole: userData.userRole,
        firstName: userData.firstName,
        lastName: userData.lastName,
        online: userData.online,
      });
      setLoadingSpinner("authenticated");
    }
  }, [userData, isLoading, error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadingSpinner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
