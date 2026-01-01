import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { guestAccessHook } from "@/hooks/AuthHooks/useGuestAccess";
import { useRegister } from "@/hooks/AuthHooks/useRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";

const registerFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

type FormRegister = z.infer<typeof registerFormSchema>;

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormRegister>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const { mutate } = useRegister();

  const { mutate: guestLogin } = guestAccessHook();

  const handleRegister = (data: FormRegister) => {
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

  const passwordChecks = checkPasswordCriteria(watch("password"));

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[url(/public/r2.jpg)] bg-cover ">
      <Card className="w-full md:w-1/2 lg:w-1/3 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex justify-self-center text-2xl md:text-3xl lg:text-4xl">
            Register
          </CardTitle>
          <CardDescription className="text-center">
            Hey, Enter your details to create a Account
          </CardDescription>
        </CardHeader>

        <form
          className="px-5 flex flex-col gap-6"
          onSubmit={handleSubmit(handleRegister)}
        >
          <div className="space-y-5">
            <div className="flex gap-4">
              <Input
                className="text-red-400"
                type="firstName"
                placeholder="firstname"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-300">{errors.firstName?.message}</p>
              )}
              <Input
                className="text-red-400"
                type="lastName"
                placeholder="lastname"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-300">{errors.lastName?.message}</p>
              )}
            </div>
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
            {criteriaList.map((criterion, index) => {
              const isMet = Object.values(passwordChecks)[index];
              return (
                <div className={isMet ? "text-green-500" : "text-gray-500"}>
                  <li className="ml-5">{criterion}</li>
                </div>
              );
            })}
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </div>
          <Link to={"#"}>forgot password</Link>
          <div className="w-full grid grid-cols-2 gap-4">
            <Button className="w-full">Registration</Button>
            <Button className="w-full">
              <Link className="w-full" to={"/login"}>
                Switch to Login
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
            className="w-full col-span-2 font-semibold"
            onClick={() => guestLogin()}
          >
            <User className="mr-2 h-4 w-4" />
            Guest for Test
          </Button>
        </div>
      </Card>
    </div>
  );
};
