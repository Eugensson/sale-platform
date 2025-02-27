"use client";

import { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { ProductSlider } from "@/components/shared/product/product-slider";

import { cn } from "@/lib/utils";

import { useBrowsingHistory } from "@/hooks/use-browsing-history";

type Props = {
  title: string;
  type: "history" | "related";
  hideDetails?: boolean;
};

const ProductList = ({
  title,
  type = "history",
  hideDetails = false,
}: Props) => {
  const [data, setData] = useState([]);

  const { products } = useBrowsingHistory();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `/api/products/browsing-history?type=${type}&categories=${products
          .map((product) => product.category)
          .join(",")}&ids=${products.map((product) => product.id).join(",")}`
      );
      const data = await res.json();

      setData(data);
    };

    fetchProducts();
  }, [products, type]);

  return (
    data.length > 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  );
};

export const BrowsingHistoryList = ({ className }: { className?: string }) => {
  const { products } = useBrowsingHistory();

  return (
    products.length !== 0 && (
      <section className="bg-background">
        <Separator className={cn("mb-4", className)} />
        <ProductList
          title={"Related to items that you've viewed"}
          type="related"
        />
        <Separator className="mb-4" />
        <ProductList
          title={"Your browsing history"}
          hideDetails
          type="history"
        />
      </section>
    )
  );
};
