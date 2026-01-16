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
import { useForgotPw } from "@/hooks/AuthHooks/useForgotPw";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import z from "zod";

const forgotPwSchema = z.object({
  email: z.string().email("Invalid email format"),
});

type FormForgotPw = z.infer<typeof forgotPwSchema>;
export const ForgotPw = () => {
  const { mutate } = useForgotPw();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormForgotPw>({
    resolver: zodResolver(forgotPwSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: FormForgotPw) => {
    mutate(data);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-1/2 lg:w-1/3 md:w-1/2">
          <CardHeader>
            <CardTitle className="flex justify-self-center text-4xl">
              Reset-Authentication
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to Reset the password
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col space-y-3">
              <Label className="text-md">Email</Label>
              <Input {...register("email")} />
              {errors.email && (
                <div className="text-red-600">{errors.email.message}</div>
              )}
              <Button className="w-full font-semibold" type="submit">
                Reset password
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
