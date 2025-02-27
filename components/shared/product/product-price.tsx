"use client";

import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  price: number;
  isDeal?: boolean;
  listPrice?: number;
  className?: string;
  forListing?: boolean;
  plain?: boolean;
};

export const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
}: Props) => {
  const discountPercent = Math.round(100 - (price / listPrice) * 100);
  const stringValue = price.toString();
  const [intValue, floatValue] = stringValue.includes(".")
    ? stringValue.split(".")
    : [stringValue, ""];

  return plain ? (
    formatCurrency(price)
  ) : listPrice == 0 ? (
    <div className={cn("text-xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">{floatValue}</span>
    </div>
  ) : isDeal ? (
    <div className="space-y-2">
      <div
        className={`flex ${forListing && "justify-center"} items-center gap-2`}
      >
        <div className={cn("text-2xl", className)}>
          <span className="text-xs align-super">$</span>
          {intValue}
          <span className="text-xs align-super">{floatValue}</span>
        </div>
        <p className="text-muted-foreground text-xs py-2 line-through">
          {formatCurrency(listPrice)}
        </p>
        <span className="bg-red-500 rounded-sm p-1 text-gray-50 text-sm font-semibold">
          - {discountPercent}%
        </span>
      </div>
    </div>
  ) : (
    <div>
      <div className="flex justify-center gap-3">
        <div className="text-2xl text-orange-700">-{discountPercent}%</div>
        <div className={cn("text-2xl", className)}>
          <span className="text-xs align-super">$</span>
          {intValue}
          <span className="text-xs align-super">{floatValue}</span>
        </div>
      </div>
      <div className="text-muted-foreground text-xs py-2">
        List price:{" "}
        <span className="line-through">{formatCurrency(listPrice)}</span>
      </div>
    </div>
  );
};
