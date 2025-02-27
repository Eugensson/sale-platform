import Link from "next/link";
import { LiaOpencart } from "react-icons/lia";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn("flex flex-col w-fit text-muted", className)}
      aria-label={APP_NAME}
      title={APP_NAME}
    >
      <div className="flex items-end gap-1">
        <LiaOpencart size={30} aria-hidden="true" />
        <span className="font-secondary font-semibold text-2xl block md:hidden">
          SP
        </span>
        <span className="font-secondary font-semibold text-2xl hidden md:block">
          {APP_NAME}
        </span>
      </div>
      <p className="text-xs text-end hidden md:block tracking-[0.2em]">
        Онлайн-маркетплейс
      </p>
    </Link>
  );
};
