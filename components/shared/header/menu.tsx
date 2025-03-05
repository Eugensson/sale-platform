import { CartButton } from "@/components/shared/header/cart-button";
import { UserButton } from "@/components/shared/header/user-button";
import { ThemeSwitcher } from "@/components/shared/header/theme-switcher";

import { cn } from "@/lib/utils";

interface MenuProps {
  forAdmin?: boolean;
  className?: string;
}

export const Menu = ({ forAdmin = false, className }: MenuProps) => {
  return (
    <div className={cn("flex justify-end", className)}>
      <nav className="flex items-center lg:gap-3 w-full">
        <ThemeSwitcher />
        <UserButton />
        {forAdmin ? null : <CartButton />}
      </nav>
    </div>
  );
};
