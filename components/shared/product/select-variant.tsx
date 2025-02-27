import Link from "next/link";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { IProduct } from "@/lib/db/models/product.model";

export const SelectVariant = ({
  product,
  size,
  color,
}: {
  product: IProduct;
  color: string;
  size: string;
}) => {
  const selectedColor = color ?? product.colors[0];
  const selectedSize = size ?? product.sizes[0];

  return (
    <>
      {product.colors.length > 0 && (
        <div className="space-x-2 space-y-2">
          <p>Color:</p>
          {product.colors.map((x: string) => (
            <Button
              asChild
              variant="outline"
              className={cn(
                "border-2",
                selectedColor === x && "border-blue-600"
              )}
              key={x}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: x,
                  size: selectedSize,
                })}`}
                key={x}
              >
                <div
                  style={{ backgroundColor: x }}
                  className="h-4 w-4 rounded-full border border-muted-foreground"
                ></div>
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
      {product.sizes.length > 0 && (
        <div className="mt-2 space-x-2 space-y-2">
          <p>Size:</p>
          {product.sizes.map((x: string) => (
            <Button
              asChild
              variant="outline"
              className={cn(
                "border-2",
                selectedSize === x && "border-blue-600"
              )}
              key={x}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size: x,
                })}`}
              >
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  );
};
