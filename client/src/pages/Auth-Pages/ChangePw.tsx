import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useChangePW } from "@/hooks/AuthHooks/useChangePw";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const newPwSchema = z
  .object({
    currentPw: z.string().min(8, "Password must be at least 8 characters"),
    newPw: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPw: z.string().min(8),
  })
  .refine((data) => data.newPw === data.confirmPw, {
    message: "Passwords don't match",
    path: ["confirmPw"],
  });

type NewPwForm = z.infer<typeof newPwSchema>;

export const ChangePw = () => {
  const { mutate } = useChangePW();
  const { user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NewPwForm>({
    resolver: zodResolver(newPwSchema),
  });

  const handleNewPw = (data: NewPwForm) => {
    mutate(data);
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

  // Diese Funktion prüft das aktuelle Passwort
  const passwordChecks = checkPasswordCriteria(watch("newPw"));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 w-full lg:w-1/2">
          <form className="space-y-3" onSubmit={handleSubmit(handleNewPw)}>
            <p>Old Password</p>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("currentPw")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-red-500">{errors.currentPw?.message}</p>

            <p>New Password</p>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("newPw")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-red-500">{errors.newPw?.message}</p>

            {criteriaList.map((criterion, index) => {
              const isMet = Object.values(passwordChecks)[index];
              return (
                <div className={isMet ? "text-green-500" : "text-gray-500"}>
                  <li className="ml-5">{criterion}</li>
                </div>
              );
            })}

            <p>Confirm New Password</p>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("confirmPw")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-red-500">{errors.confirmPw?.message}</p>
            <Button
              className="w-full bg-indigo-500"
              type="submit"
              disabled={user?.userRole === "guest" ? true : false}
            >
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
