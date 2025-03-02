"use client";

import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@/components/shared/product/rating";

type RatingSummaryProps = {
  asPopover?: boolean;
  avgRating: number;
  numReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
};

export const RatingSummary = ({
  asPopover,
  avgRating = 0,
  numReviews = 0,
  ratingDistribution = [],
}: RatingSummaryProps) => {
  const RatingDistribution = () => {
    const ratingPercentageDistribution = ratingDistribution.map((x) => ({
      ...x,
      percentage: Math.round((x.count / numReviews) * 100),
    }));

    return (
      <>
        <div className="flex items-center gap-2">
          <Rating rating={avgRating} />
          <p className="text-sm font-medium">
            {avgRating.toFixed(1)} out of 5 ({numReviews} reviews)
          </p>
        </div>

        <div className="space-y-3">
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)
            .map(({ rating, percentage }) => (
              <div
                key={rating}
                className="grid grid-cols-[50px_1fr_30px] gap-2 items-center"
              >
                <p className="text-sm">{rating} star</p>
                <Progress value={percentage} className="h-2" />
                <p className="text-sm text-right">{percentage}%</p>
              </div>
            ))}
        </div>
      </>
    );
  };

  return asPopover ? (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="px-2 [&_svg]:size-6 text-base">
            <span>{avgRating.toFixed(1)}</span>
            <Rating rating={avgRating} />
            <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <div className="flex flex-col gap-2">
            <RatingDistribution />
            <Separator />

            <Link className="highlight-link text-center" href="#reviews">
              See customer reviews
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      <div className=" ">
        <Link href="#reviews" className="highlight-link">
          {numReviews} ratings
        </Link>
      </div>
    </div>
  ) : (
    <RatingDistribution />
  );
};
