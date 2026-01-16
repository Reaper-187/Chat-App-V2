import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPw, type RequestTokenResponse } from "@/service/authServices";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export const useForgotPw = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPw,
    onSuccess: async (response: RequestTokenResponse) => {
      // token wird aus res gezogen und in resetToken gespeichert (cache)
      await queryClient.setQueryData(["resetToken"], {
        token: response.token,
      });
      navigate("/multifactor-authentication-oneTimer");
      toast("You`ll get an email with a OneTime-Code");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message;
      toast(errorMessage + "🔒");
    },
  });
};
