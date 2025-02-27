"use client";

import { Toaster } from "@/components/ui/sonner";
import { CartSidebar } from "@/components/shared/cart-sidebar";

import { useCartSidebar } from "@/hooks/use-cart-sidebar";

export const ClientProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isCartSidebarOpen = useCartSidebar();

  return (
    <>
      {isCartSidebarOpen ? (
        <div className="flex min-h-screen">
          <div className="flex-1 overflow-hidden">{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <>{children}</>
      )}
      <Toaster />
    </>
  );
};
