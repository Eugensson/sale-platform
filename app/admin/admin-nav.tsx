"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV_LINKS } from "@/lib/constants";

import { cn } from "@/lib/utils";

export const AdminNav = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex items-center flex-wrap overflow-hidden gap-2 md:gap-4",
        className
      )}
    >
      {ADMIN_NAV_LINKS.map(({ title, href }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-muted-foreground",
            pathname.includes(href) && "text-gray-50"
          )}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
};
