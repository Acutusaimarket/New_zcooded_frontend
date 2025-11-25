import { useForm } from "react-hook-form";

import FormInput from "@/components/shared/form-input";
import { LoadingSwap } from "@/components/shared/loading-swap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { useLoginMutation } from "../api/mutations/use-login-mutation";
import type { LoginSchemaType } from "../types/schema.type";

const LoginForm = () => {
  const loginForm = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const loginMutation = useLoginMutation();

  const handleSubmit = (data: LoginSchemaType) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <p className="text-muted-foreground">
          Sign in to access your dashboard
        </p>
      </CardHeader>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormInput
              control={loginForm.control}
              name="email"
              label="Email"
              required
              placeholder="Enter your email"
            />
            <FormInput
              control={loginForm.control}
              name="password"
              label="Password"
              required
              placeholder="Enter your password"
              type="password"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <LoadingSwap isLoading={loginMutation.isPending}>
                Login
              </LoadingSwap>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
