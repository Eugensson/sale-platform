"use client";

import Link from "next/link";
import Image from "next/image";

import { ProductPrice } from "@/components/shared/product/product-price";

import { getMonthName } from "@/lib/utils";

type TableChartProps = {
  labelType: "month" | "product";
  data: {
    label: string;
    image?: string;
    value: number;
    id?: string;
  }[];
};

interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const boundedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="relative w-full h-2 overflow-hidden">
      <div
        className="bg-primary h-full transition-all duration-300 rounded-lg"
        style={{
          width: `${boundedValue}%`,
          float: "right",
        }}
      />
    </div>
  );
};

export const TableChart = ({
  labelType = "month",
  data = [],
}: TableChartProps) => {
  const max = Math.max(...data.map((item) => item.value));

  const dataWithPercentage = data.map((x) => ({
    ...x,
    label: labelType === "month" ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
  }));

  return (
    <div className="space-y-3">
      {dataWithPercentage.map(({ label, id, value, image, percentage }) => (
        <div
          key={label}
          className="grid grid-cols-[100px_1fr_80px] md:grid-cols-[250px_1fr_80px] items-center gap-4 space-y-4"
        >
          {image ? (
            <Link
              className="flex items-end gap-4"
              href={`/admin/products/${id}`}
            >
              <Image
                className="rounded border aspect-square object-scale-down max-w-full h-auto mx-auto"
                src={image!}
                alt={label}
                width={36}
                height={36}
              />
              <p className="text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {label}
              </p>
            </Link>
          ) : (
            <div className="flex items-end text-sm">{label}</div>
          )}

          <ProgressBar value={percentage} />

          <div className="text-sm text-right flex items-center">
            <ProductPrice price={value} plain />
          </div>
        </div>
      ))}
    </div>
  );
};
