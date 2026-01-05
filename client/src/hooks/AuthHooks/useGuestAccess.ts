import { guestAccess } from "@/service/authServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const guestAccessHook = () => {
  const qeryClient = useQueryClient();
  return useMutation({
    mutationFn: guestAccess,
    onSuccess: async () => {
      await qeryClient.invalidateQueries({ queryKey: ["auth"] });
      toast("Welcome Guest");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message || "Guest-Login Failed";
      toast(errorMessage + "🔒");
    },
  });
};
