import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { guestAccessHook } from "@/hooks/AuthHooks/useGuestAccess";
import { useLogin } from "@/hooks/AuthHooks/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormLogin = z.infer<typeof loginFormSchema>;

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormLogin>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: userLogin, isPending: loginLoad } = useLogin();

  const { mutate: guestLogin, isPending: guestLoginLoad } = guestAccessHook();

  const handleLogin = (data: FormLogin) => {
    userLogin(data);
  };

  const noCheck = loginLoad || guestLoginLoad;

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full md:w-1/2 lg:w-1/3 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex justify-self-center text-2xl md:text-3xl lg:text-4xl">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Hey, Enter your details to get sign in to your account
          </CardDescription>
        </CardHeader>

        <form
          className="px-5 flex flex-col gap-6"
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="space-y-5">
            <Input
              className="text-red-400"
              type="email"
              placeholder="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600">{errors.email.message}</p>
            )}
            <div className="relative">
              <Input
                {...register("password")}
                placeholder="password"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <Link
            hidden={noCheck ? true : false}
            className="text-blue-400 hover:text-blue-500 font-medium"
            to={"/reset-password-authentication"}
          >
            forgot password
          </Link>
          <div className="w-full grid grid-cols-2 gap-4">
            <Button disabled={noCheck ? true : false} className="w-full">
              {loginLoad ? "in Progress..." : "Sign in"}
            </Button>
            <Button disabled={noCheck ? true : false} className="w-full">
              <Link className="w-full" to={"/register"}>
                Switch to Register
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center ">
              <span className="w-full border-t " />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-primary-foreground px-2 text-muted-foreground rounded-md">
                Or continue with
              </span>
            </div>
          </div>
        </form>
        <div className="grid grid-cols-2 gap-4 px-4 ">
          <Button
            disabled={noCheck ? true : false}
            className="w-full col-span-2 font-semibold"
            onClick={() => guestLogin()}
          >
            <User className="mr-2 h-4 w-4" />
            {guestLoginLoad ? "Guest-Access is creating..." : "Guest for Test"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
