"use client";

import { FcGoogle } from "react-icons/fc";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

import { SignInWithGoogle } from "@/lib/actions/user.actions";

export const GoogleSignInForm = () => {
  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="outline">
        <FcGoogle />
        {pending ? "Redirecting to Google..." : "Sign In with Google"}
      </Button>
    );
  };

  return (
    <form action={SignInWithGoogle}>
      <SignInButton />
    </form>
  );
};
