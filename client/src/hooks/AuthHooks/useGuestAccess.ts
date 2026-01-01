import { guestAccess } from "@/service/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const guestAccessHook = () => {
  const qeryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: guestAccess,
    onSuccess: async () => {
      await qeryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/tasks");
      toast("Welcome Guest");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message || "Guest-Login Failed";
      toast(errorMessage + "🔒");
    },
  });
};
