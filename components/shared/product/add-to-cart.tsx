/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { OrderItem } from "@/types";

import { useCartStore } from "@/hooks/use-cart-store";

type Props = {
  item: OrderItem;
  minimal?: boolean;
};

export const AddToCart = ({ item, minimal = false }: Props) => {
  const router = useRouter();

  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);

  return minimal ? (
    <Button
      variant="default"
      className="rounded-full w-auto"
      onClick={() => {
        try {
          addItem(item, 1);
          toast("Added to Cart", {
            action: {
              label: "Go to Cart",
              onClick: () => router.push("/cart"),
            },
          });
        } catch (error: any) {
          toast(error.message);
        }
      }}
    >
      Add to Cart
    </Button>
  ) : (
    <div className="w-full space-y-2">
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger>
          <SelectValue>Quantity: {quantity}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {Array.from({ length: item.countInStock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className="w-full rounded-md"
        type="button"
        onClick={async () => {
          try {
            const itemId = await addItem(item, quantity);
            router.push(`/cart/${itemId}`);
          } catch (error: any) {
            toast(error.message);
          }
        }}
      >
        Add to Cart
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          try {
            addItem(item, quantity);
            router.push(`/checkout`);
          } catch (error: any) {
            toast(error.message);
          }
        }}
        className="w-full rounded-md"
      >
        Buy Now
      </Button>
    </div>
  );
};
