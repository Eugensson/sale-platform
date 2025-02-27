"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { useCartStore } from "@/hooks/use-cart-store";

export const CartButton = () => {
  const isMounted = useIsMounted();

  const {
    cart: { items },
  } = useCartStore();

  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0);

  return (
    <Button
      variant="ghost"
      type="button"
      className="bg-foreground hover:bg-gray-700 hover:text-muted"
      asChild
      aria-label="Cart"
      title="Cart"
    >
      <Link href="/cart">
        <div className="flex items-end text-xs relative">
          <ShoppingBag />
          {isMounted && cartItemsCount > 0 && (
            <Badge
              variant="secondary"
              className={cn(
                "absolute -top-1.5 -right-2.5 z-10 px-1.5 rounded-full hover:outline-none",
                cartItemsCount >= 10 && "px-1"
              )}
            >
              {cartItemsCount}
            </Badge>
          )}
        </div>
      </Link>
    </Button>
  );
};
