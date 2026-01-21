import { userChangePw, type UserChangePwProps } from "@/service/authServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useChangePW = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserChangePwProps) => userChangePw(data),
    onSuccess: async (res) => {
      await queryClient.cancelQueries({ queryKey: ["auth"] });
      toast(res.message + "😊🔒✌️");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const errorMessage = err.response?.data?.message;
      toast(errorMessage + "❌☝️");
    },
  });
};
