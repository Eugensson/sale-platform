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
      size="icon"
      asChild
      aria-label="Cart"
      title="Cart"
      className="[&_svg]:size-6"
    >
      <Link href="/cart">
        <div className="relative flex items-end text-xs">
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
