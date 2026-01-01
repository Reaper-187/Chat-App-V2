import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchLogin } from "@/service/services";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetchLogin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });

      navigate("/tasks");
      toast(`Welcome back ${"🔓"}`);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message || "Login Failed";
      toast(errorMessage + "🔒");
    },
  });
};
