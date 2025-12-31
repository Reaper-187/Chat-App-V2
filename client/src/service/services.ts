import type { User } from "@/types/User";
import axios from "axios";

const USER_INFO_API = import.meta.env.VITE_API_USERINFO;

// const LOGIN_API = import.meta.env.VITE_API_LOGIN;
// const REGISTER_API = import.meta.env.VITE_API_REGISTER;
// const LOGOUT_API = import.meta.env.VITE_API_LOGOUT;
// const AUTHCHECK_API = import.meta.env.VITE_API_USERAUTHCHECK;
// const FORGOTPW_API = import.meta.env.VITE_API_FORGOTPW;
// const VERIFYOTP_API = import.meta.env.VITE_API_VERIFYOTP;
// const RESET_USER_PW_API = import.meta.env.VITE_API_RESETUPW;
// const CHANGE_PW_API = import.meta.env.VITE_API_CHANGEPW;
// const GUEST_ACCESS_API = import.meta.env.VITE_API_GUEST_ACCESS;

export const getUserInfo = async (): Promise<User> => {
  const response = await axios.get<User>(USER_INFO_API, {
    withCredentials: true,
  });
  return response.data;
};
