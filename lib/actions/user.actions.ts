"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth, signIn, signOut } from "@/auth";

import { formatError } from "@/lib/utils";
import { connectToDatabase } from "@/lib/db";
import { IUser, User } from "@/lib/db/models/user.model";
import { getSetting } from "@/lib/actions/setting.actions";
import { UserSignUpSchema, UserUpdateSchema } from "@/lib/validator";

import { IUserName, IUserSignIn, IUserSignUp } from "@/types";

export const getAllUsers = async ({
  limit,
  page,
}: {
  limit?: number;
  page: number;
}) => {
  const {
    common: { pageSize },
  } = await getSetting();

  limit = limit || pageSize;

  await connectToDatabase();

  const skipAmount = (Number(page) - 1) * limit;

  const users = await User.find()
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(limit);

  const usersCount = await User.countDocuments();

  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  };
};

export const getUserById = async (userId: string) => {
  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  return JSON.parse(JSON.stringify(user)) as IUser;
};

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

export const updateUser = async (user: z.infer<typeof UserUpdateSchema>) => {
  try {
    await connectToDatabase();

    const dbUser = await User.findById(user._id);

    if (!dbUser) throw new Error("User not found");

    dbUser.name = user.name;

    dbUser.email = user.email;

    dbUser.role = user.role;

    const updatedUser = await dbUser.save();

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connectToDatabase();

    const res = await User.findByIdAndDelete(id);

    if (!res) throw new Error("Use not found");

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
