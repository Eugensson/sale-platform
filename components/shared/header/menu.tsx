import { CartButton } from "@/components/shared/header/cart-button";
import { UserButton } from "@/components/shared/header/user-button";

export const Menu = () => {
  return (
    <div className="flex justify-end">
      <nav className="flex items-center w-full">
        <UserButton />
        <CartButton />
      </nav>
    </div>
  );
};
