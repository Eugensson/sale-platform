"use client";

import { ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export const BackToTop = () => {
  return (
    <Button
      variant="custom"
      className="w-full rounded-none"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp className="mr-1 size-4" />
      Back to top
    </Button>
  );
};
