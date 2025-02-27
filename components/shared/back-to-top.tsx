"use client";

import { ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export const BackToTop = () => {
  return (
    <Button
      variant="ghost"
      className="bg-gray-800 hover:bg-gray-700 hover:text-muted w-full rounded-none transition-colors"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp className="mr-1 size-4" />
      Back to top
    </Button>
  );
};
