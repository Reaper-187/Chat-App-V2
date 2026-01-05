import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./index.css";
// import { ChatScreen } from "./components/ChatScreen/ChatScreen.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "sonner";
import { ChatProvider } from "./context/ChatContext.tsx";
import { ChatMain } from "./pages/ChatDashboard/ChatMain.tsx";
import { Login } from "./pages/Auth-Pages/Login.tsx";
import { Register } from "./pages/Auth-Pages/Register.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PublicRoute } from "./hooks/ProtectedRoutes/PublicRoute.tsx";
import { ProtectedRoute } from "./hooks/ProtectedRoutes/ProtectedRoute.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
const queryClient = new QueryClient();

// {
//   path: "/reset-password-authentication",
//   element: (
//     <>
//       <PublicRoute>
//         <ForgotPw />
//       </PublicRoute>
//     </>
//   ),
// },
// {
//   path: "/multifactor-authentication-oneTimer",
//   element: (
//     <PublicRoute>
//       <OneTimeOtp />
//     </PublicRoute>
//   ),
// },
// {
//   path: "/new-password-authentication",
//   element: (
//     <PublicRoute>
//       <NewPwPage />
//     </PublicRoute>
//   ),
// },
// {
//   path: "/verifyUser",
//   element: (
//     <VerificationRoute>
//       <Verification />
//     </VerificationRoute>
//   ),
// },
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <PublicRoute>
          <Register />
        </PublicRoute>
      </>
    ),
  },

  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      {
        path: "chat",
        element: <ChatMain />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            <RouterProvider router={router} />
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
