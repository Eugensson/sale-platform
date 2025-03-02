"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export const Pagination = ({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: true });
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        size="icon"
        variant="outline"
        onClick={() => onClick("prev")}
        disabled={Number(page) <= 1}
        aria-label="Previous page"
        title="Previous page"
      >
        <ChevronLeft />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
        aria-label="Next page"
        title="Next page"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
