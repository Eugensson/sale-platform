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

import { IUserSignIn } from "@/types";

import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { UserSignInSchema } from "@/lib/validator";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { Separator } from "@/components/ui/separator";

const signInDefaultValues =
  process.env.NODE_ENV === "development"
    ? { email: "admin@example.com", password: "123456" }
    : { email: "", password: "" };

export const CredentialsSignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignIn) => {
    try {
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      });
      redirect(callbackUrl);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast("Invalid email or password");
    }
  };

  const renderField = (
    name: "email" | "password",
    label: string,
    type = "text"
  ) => (
    <FormField
      control={control}
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
              autoComplete={name === "password" ? "current-password" : "email"}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-4">
          {renderField("email", "Email")}
          {renderField("password", "Password", "password")}
          <Button
            type="submit"
            className="w-full flex mx-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
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
