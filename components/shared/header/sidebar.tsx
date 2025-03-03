import {
  X,
  ChevronRight,
  UserCircle,
  MenuIcon,
  LogOut,
  LogIn,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { auth } from "@/auth";

import { SignOut } from "@/lib/actions/user.actions";

export const Sidebar = async ({ categories }: { categories: string[] }) => {
  const session = await auth();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className="bg-gray-800 hover:bg-foreground hover:text-muted"
          aria-label="Menu"
          title="Menu"
        >
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[350px] mt-0 top-0 flex flex-col h-full rounded-none">
        <DrawerHeader className="dark bg-gray-800 text-foreground flex items-center justify-between">
          <DrawerTitle className="flex items-center">
            <UserCircle className="mr-2" />
            {session ? (
              <DrawerClose asChild>
                <Link href="/account">Hello, {session.user.name}</Link>
              </DrawerClose>
            ) : (
              <DrawerClose asChild>
                <Link href="/sign-in">Hello, sign in</Link>
              </DrawerClose>
            )}
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close"
              title="Close"
            >
              <X />
            </Button>
          </DrawerClose>
          <DrawerDescription className="sr-only" />
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl p-4 border-b">Shop By Department</h2>
          <nav className="flex flex-col">
            {categories.map((category) => (
              <DrawerClose asChild key={category}>
                <Link
                  href={`/search?category=${category}`}
                  className={`flex items-center justify-between p-3 hover:bg-muted`}
                >
                  {category}
                  <ChevronRight size={16} />
                </Link>
              </DrawerClose>
            ))}
          </nav>
        </div>

        <div className="border-t flex flex-col ">
          <h2 className="p-4 text-xl">Help & Settings</h2>
          <DrawerClose asChild>
            <Link
              href="/account"
              className="flex items-center gap-4 p-3 hover:bg-muted"
            >
              <User size={24} className="text-muted-foreground" />
              Your account
            </Link>
          </DrawerClose>
          <DrawerClose asChild>
            <Link
              href="/page/customer-service"
              className="flex items-center gap-4 p-3 hover:bg-muted"
            >
              <Settings size={24} className="text-muted-foreground" />
              Customer Service
            </Link>
          </DrawerClose>
          {session ? (
            <form action={SignOut} className="w-full">
              <Button
                variant="ghost"
                className="w-full p-3 justify-start gap-4 text-base [&_svg]:size-6"
              >
                <LogOut className="size-4 text-muted-foreground" />
                Sign out
              </Button>
            </form>
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-4 p-3 hover:bg-muted"
            >
              <LogIn size={24} className="text-muted-foreground" />
              Sign in
            </Link>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
