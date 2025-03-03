"use client";

import Image from "next/image";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { cn } from "@/lib/utils";

export const ProductGallery = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section className={cn("flex gap-2", className)}>
      <ul className="flex flex-col gap-4 mt-8">
        {images.map((image, index) => (
          <li key={index}>
            <button
              onClick={() => {
                setSelectedImage(index);
              }}
              onMouseOver={() => {
                setSelectedImage(index);
              }}
              className={cn(
                "p-2 rounded aspect-square overflow-hidden",
                selectedImage === index
                  ? "ring-1 ring-primary"
                  : "ring-1 ring-gray-300"
              )}
            >
              <Image
                src={image}
                alt="Product image"
                width={75}
                height={75}
                className="object-cover object-center aspect-square"
              />
            </button>
          </li>
        ))}
      </ul>
      <div className="w-full">
        <Zoom classDialog="custom-zoom">
          <div className="relative h-[500px]">
            <Image
              src={images[selectedImage]}
              alt={"product image"}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
        </Zoom>
      </div>
    </section>
  );
};
