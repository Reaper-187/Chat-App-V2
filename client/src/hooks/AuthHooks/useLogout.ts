import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchLogout } from "@/service/authServices";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

export const useLogout = () => {
  const queryClient = useQueryClient();
  let navigate = useNavigate();

  return useMutation({
    mutationFn: fetchLogout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/login");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message || "Logout Failed";
      toast(errorMessage + "🔒");
    },
  });
};
