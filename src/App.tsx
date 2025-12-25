import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import "./App.css";

export const App = () => {
  return (
    <>
      <AuthProvider>
        <ChatProvider>
          <Outlet />
        </ChatProvider>
      </AuthProvider>
    </>
  );
};
