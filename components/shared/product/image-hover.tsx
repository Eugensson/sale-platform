"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  hoverSrc: string;
  alt: string;
};

export const ImageHover = ({ src, hoverSrc, alt }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => setIsHovered(true), 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setIsHovered(false);
  };

  return (
    <div
      className="relative h-52"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="80vw"
        className={`object-contain transition-opacity duration-500 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={hoverSrc}
        alt={alt}
        fill
        sizes="80vw"
        className={`absolute inset-0 object-contain transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};
