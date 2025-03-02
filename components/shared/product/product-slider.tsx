"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/shared/product/product-card";

import { IProduct } from "@/lib/db/models/product.model";

export const ProductSlider = ({
  title,
  products,
  hideDetails = false,
}: {
  title?: string;
  products: IProduct[];
  hideDetails?: boolean;
}) => {
  return (
    <section className="w-full bg-background">
      <h2 className="mb-4 text-2xl">{title}</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className={
                hideDetails
                  ? "md:basis-1/4 lg:basis-1/6"
                  : "md:basis-1/3 lg:basis-1/5"
              }
            >
              <ProductCard
                hideDetails={hideDetails}
                hideAddToCart
                hideBorder
                product={product}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </section>
  );
};
