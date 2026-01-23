import { resetUserPw, type RequestResetUserPw } from "@/service/authServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useNewPw = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RequestResetUserPw) => resetUserPw(data),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["resetToken"] });
      navigate("/login");
      toast(res.message);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message;
      toast(errorMessage + "🔒");
    },
  });
};
