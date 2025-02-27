import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeparatorWithOr } from "@/components/shared/separator-or";
import { GoogleSignInForm } from "@/app/(auth)/sign-in/google-signin-form";
import { CredentialsSignInForm } from "@/app/(auth)/sign-in/credentials-signin-form";

import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignIn = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl = "/" } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl);
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Logo className="text-sky-700 hover:text-orange-700" />
          <h1 className="text-4xl">Sign In</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CredentialsSignInForm />
        <SeparatorWithOr />
        <div className="mt-4">
          <GoogleSignInForm />
        </div>
      </CardContent>
      <CardFooter className="py-0 flex justify-center text-sm">
        Dont&apos;t have an account?
        <Button
          variant="link"
          asChild
          className="px-1 text-sky-700 hover:text-orange-700"
        >
          <Link
            href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Sign Up
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
