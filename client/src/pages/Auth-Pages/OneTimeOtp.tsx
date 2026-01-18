import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useOtp } from "@/hooks/AuthHooks/useOtp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formOtpSchema = z.object({
  otpNum: z
    .string()
    .length(6, { message: "Your one-time password must be 6 digits." })
    .regex(/^\d+$/, { message: "Only numbers are allowed." }),
});

type FormOtp = z.infer<typeof formOtpSchema>;

export const OneTimeOtp = () => {
  const queryClient = useQueryClient();

  // token aus dem query-cache ziehen
  const resetTokenData = queryClient.getQueryData<{ token: number }>([
    "resetToken",
  ]);

  const { mutate } = useOtp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormOtp>({
    resolver: zodResolver(formOtpSchema),
    defaultValues: {
      otpNum: "",
    },
  });

  // if-con um ein nicht number typ zu blocken
  if (!resetTokenData) {
    toast("Something went wrong — no token found.");
    return;
  }
  const onSubmit = (data: FormOtp) => {
    mutate({
      otpNum: data.otpNum,
      token: resetTokenData.token,
    });
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full p-5 space-y-4 max-w-md">
          <h1 className="text-center text-2xl font-semibold">
            OTP-Authentication
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="otpNum"
              control={control}
              render={({ field }) => (
                <>
                  <InputOTP
                    value={field.value}
                    onChange={field.onChange}
                    maxLength={6}
                  >
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSeparator />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} className="rounded-r-md" />
                  </InputOTP>
                  {errors.otpNum && (
                    <p className="text-sm text-red-500">
                      {errors.otpNum.message}
                    </p>
                  )}
                </>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Card>
      </div>
    </>
  );
};
