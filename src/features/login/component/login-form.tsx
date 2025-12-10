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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useLoginMutation } from "../api/mutations/use-login-mutation";
import type { LoginSchemaType } from "../types/schema.type";

const LoginForm = () => {
  const loginForm = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
      acceptPrivacyPolicy: false,
      acceptTermsAndConditions: false,
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
            <FormField
              control={loginForm.control}
              name="acceptPrivacyPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel required className="text-sm font-normal">
                    Accept{" "}
                    <a
                      href="https://privacy.acutusai.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Privacy & Policy
                    </a>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="acceptTermsAndConditions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel required className="text-sm font-normal">
                    Accept{" "}
                    <a
                      href="https://termandcondition.acutusai.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Term & condition
                    </a>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
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
