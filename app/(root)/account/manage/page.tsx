import Link from "next/link";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { auth } from "@/auth";
import { Pencil } from "lucide-react";

const PAGE_TITLE = "Login & Security";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

const ProfilePage = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <section className="max-w-2xl pt-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/account">Your Account</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              <h1>{PAGE_TITLE}</h1>
            </CardTitle>
            <CardDescription className="sr-only">
              Edit profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-4 flex flex-col gap-1">
            <h3>Name</h3>
            <p>{session?.user.name}</p>
            <Button
              size="icon"
              variant="outline"
              asChild
              className="absolute top-4 right-4 [&_svg]:size-5"
              aria-label="Edit name"
              title="Edit name"
            >
              <Link href="/account/manage/name">
                <Pencil />
              </Link>
            </Button>
          </CardContent>
          <Separator />
          <CardContent className="relative p-4 flex flex-col gap-1">
            <h3>Email</h3>
            <p>{session?.user.email}</p>
            <Button
              size="icon"
              variant="outline"
              asChild
              className="absolute top-4 right-4 [&_svg]:size-5"
              aria-label="Edit email"
              title="Edit email"
            >
              <Link href="#">
                <Pencil />
              </Link>
            </Button>
          </CardContent>
          <Separator />
          <CardContent className="relative p-4 flex flex-col gap-1">
            <h3>Password</h3>
            <p>********</p>
            <Button
              size="icon"
              variant="outline"
              asChild
              className="absolute top-4 right-4 [&_svg]:size-5"
              aria-label="Edit password"
              title="Edit password"
            >
              <Link href="#">
                <Pencil />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </SessionProvider>
  );
};

export default ProfilePage;
