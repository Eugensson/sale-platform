"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { auth, signIn, signOut } from "@/auth";

import { formatError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/db/models/user.model";
import { UserSignUpSchema } from "@/lib/validator";

import { IUserName, IUserSignIn, IUserSignUp } from "@/types";

export const signInWithCredentials = async (user: IUserSignIn) => {
  return await signIn("credentials", { ...user, redirect: false });
};

export const SignInWithGoogle = async () => {
  await signIn("google");
};

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });

  redirect(redirectTo.redirect);
};

export const registerUser = async (userSignUp: IUserSignUp) => {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });

    await connectToDatabase();

    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
};

export const updateUserName = async (user: IUserName) => {
  try {
    await connectToDatabase();

    const session = await auth();

    const currentUser = await User.findById(session?.user?.id);

    if (!currentUser) throw new Error("User not found");

    currentUser.name = user.name;

    const updatedUser = await currentUser.save();

    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
