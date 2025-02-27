import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/app/(auth)/sign-up/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

  const { callbackUrl } = searchParams;

  const session = await auth();
  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <>
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Logo className="text-sky-700 hover:text-orange-700" />
            <h1 className="text-4xl">Sign Up</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="py-0 flex justify-center text-sm">
          Already have an account?
          <Button
            variant="link"
            asChild
            className="px-1 text-sky-700 hover:text-orange-700"
          >
            <Link href={`/sign-in?callbackUrl=${callbackUrl}`}>Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default SignUpPage;
