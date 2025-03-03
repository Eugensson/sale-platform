"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getFilterUrl } from "@/lib/utils";

interface Params {
  q?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page?: string;
}

interface ProductSortSelectorProps {
  sortOrders: { value: string; name: string }[];
  sort: string;
  params: Params;
}

export const ProductSortSelector = ({
  sortOrders,
  sort,
  params,
}: ProductSortSelectorProps) => {
  const router = useRouter();

  return (
    <Select
      onValueChange={(v) => {
        router.push(getFilterUrl({ params, sort: v }));
      }}
      value={sort}
    >
      <SelectTrigger className="w-full md:w-48 h-12">
        <SelectValue>
          Sort By: {sortOrders.find((s) => s.value === sort)!.name}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {sortOrders.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
