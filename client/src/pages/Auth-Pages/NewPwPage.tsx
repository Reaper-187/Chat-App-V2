import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNewPw } from "@/hooks/AuthHooks/useNewPw";
import { Label } from "@radix-ui/react-label";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

const formSchemaForNewPassword = z.object({
  newUserPw: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

type FormUserPassword = z.infer<typeof formSchemaForNewPassword>;

export const NewPwPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useNewPw();

  const resetPwTokenData = queryClient.getQueryData<{ token: number }>([
    "resetToken",
  ]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormUserPassword>({
    defaultValues: {
      newUserPw: "",
    },
  });

  if (!resetPwTokenData) {
    toast("Something went wrong — no token found.");
    return;
  }

  const onSubmit = (data: FormUserPassword) => {
    mutate({
      newUserPw: data.newUserPw,
      token: resetPwTokenData.token,
    });
  };

  const checkPasswordCriteria = (password: string = "") => {
    return {
      minLength: password.length > 7,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  };

  const criteriaList = [
    "Minumum characters 8",
    "One uppercase charachter",
    "One lowercase charachter",
    "One number",
    "One speacial charachter",
  ];

  const passwordChecks = checkPasswordCriteria(watch("newUserPw"));

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-1/2 lg:w-1/3 md:w-1/2">
          <CardHeader>
            <CardTitle className="flex justify-self-center text-3xl">
              Password-Authentication
            </CardTitle>
            <CardDescription className="text-center">
              Enter the new password
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col space-y-3">
              <Label className="text-md">New Password</Label>
              <div className="relative">
                <Input
                  {...register("newUserPw")}
                  type={showPassword ? "text" : "password"}
                />
                {errors.newUserPw && (
                  <div className="text-red-600">{errors.newUserPw.message}</div>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {criteriaList.map((criterion, index) => {
                const isMet = Object.values(passwordChecks)[index];
                return (
                  <div className={isMet ? "text-green-500" : "text-gray-500"}>
                    <li className="ml-5">{criterion}</li>
                  </div>
                );
              })}

              <Button className="w-full font-semibold" type="submit">
                save new password
              </Button>
            </CardContent>
          </form>
          <CardFooter className="felx justify-center">
            <div>
              back to{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-500 font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
