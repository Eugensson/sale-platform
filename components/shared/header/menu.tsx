import { CartButton } from "@/components/shared/header/cart-button";
import { UserButton } from "@/components/shared/header/user-button";
import { ThemeSwitcher } from "@/components/shared/header/theme-switcher";

export const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  return (
    <div className="flex justify-end">
      <nav className="flex items-center lg:gap-3 w-full">
        <ThemeSwitcher />
        <UserButton />
        {forAdmin ? null : <CartButton />}
      </nav>
    </div>
  );
};
