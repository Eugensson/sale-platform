import { usePathname } from "next/navigation";

import { useCartStore } from "@/hooks/use-cart-store";
import { useDeviceType } from "@/hooks/use-device-type";

const isNotInPaths = (s: string) =>
  !/^\/$|^\/cart$|^\/checkout$|^\/sign-in$|^\/sign-up$|^\/order(\/.*)?$|^\/account(\/.*)?$|^\/admin(\/.*)?$/.test(
    s
  );

export const useCartSidebar = () => {
  const {
    cart: { items },
  } = useCartStore();

  const deviceType = useDeviceType();
  const currentPath = usePathname();

  return (
    items.length > 0 && deviceType === "desktop" && isNotInPaths(currentPath)
  );
};
