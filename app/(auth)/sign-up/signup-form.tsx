"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useSearchParams } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { IUserSignUp } from "@/types";
import {
  registerUser,
  signInWithCredentials,
} from "@/lib/actions/user.actions";
import { APP_NAME } from "@/lib/constants";
import { UserSignUpSchema } from "@/lib/validator";
import { cn } from "@/lib/utils";

const signUpDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        name: "john doe",
        email: "john@me.com",
        password: "123456",
        confirmPassword: "123456",
      }
    : { name: "", email: "", password: "", confirmPassword: "" };

export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  });

  const onSubmit = async (data: IUserSignUp) => {
    try {
      const res = await registerUser(data);
      if (!res.success) return toast(res.error);

      await signInWithCredentials({
        email: data.email,
        password: data.password,
      });
      redirect(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) throw error;
      toast("Something went wrong. Please try again.");
    }
  };

  const renderField = (
    name: "name" | "email" | "password" | "confirmPassword",
    label: string,
    type = "text"
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={`Enter ${label.toLowerCase()}`}
              {...field}
              className={cn(fieldState.error && "border-red-500")}
              autoComplete={
                name === "password" || name === "confirmPassword"
                  ? "new-password"
                  : name
              }
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {renderField("name", "Name")}
            {renderField("email", "Email")}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {renderField("password", "Password", "password")}
            {renderField("confirmPassword", "Confirm Password", "password")}
          </div>
          <Button
            type="submit"
            className="w-full flex mx-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating account..."
              : "Create an account"}
          </Button>

          <div className="text-xs text-center">
            By signing in, you agree to {APP_NAME}&apos;s&nbsp;
            <Link
              href="/page/conditions-of-use"
              className="text-sky-700 hover:text-orange-700 hover:underline"
            >
              Conditions of Use
            </Link>
            &nbsp;and&nbsp;
            <Link
              href="/page/privacy-policy"
              className="text-sky-700 hover:text-orange-700 hover:underline"
            >
              Privacy Notice.
            </Link>
          </div>
          <Separator />
        </div>
      </form>
    </Form>
  );
};
