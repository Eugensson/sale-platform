"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInView } from "react-intersection-observer";
import { SubmitHandler, useForm } from "react-hook-form";
import { Calendar, Check, StarIcon, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@/components/shared/product/rating";
import { RatingSummary } from "@/components/shared/product/rating-summary";

import { IReviewDetails } from "@/types";

import {
  createUpdateReview,
  getReviewByProductId,
  getReviews,
} from "@/lib/actions/review.actions";
import { ReviewInputSchema } from "@/lib/validator";
import { IProduct } from "@/lib/db/models/product.model";

const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};

export const ReviewList = ({
  userId,
  product,
}: {
  userId: string | undefined;
  product: IProduct;
}) => {
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const [reviews, setReviews] = useState<IReviewDetails[]>([]);

  const reload = async () => {
    try {
      const res = await getReviews({ productId: product._id, page: 1 });

      setReviews([...res.data]);

      setTotalPages(res.totalPages);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast("Error in fetching reviews");
    }
  };

  const loadMoreReviews = async () => {
    if (totalPages !== 0 && page > totalPages) return;

    setLoadingReviews(true);

    const res = await getReviews({ productId: product._id, page });

    setLoadingReviews(false);

    setReviews([...reviews, ...res.data]);

    setTotalPages(res.totalPages);

    setPage(page + 1);
  };

  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true);

      const res = await getReviews({ productId: product._id, page: 1 });

      setReviews([...res.data]);

      setTotalPages(res.totalPages);

      setLoadingReviews(false);
    };

    if (inView) {
      loadReviews();
    }
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  type CustomerReview = z.infer<typeof ReviewInputSchema>;

  const form = useForm<CustomerReview>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewFormDefaultValues,
  });

  const [open, setOpen] = useState(false);

  const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
    const res = await createUpdateReview({
      data: { ...values, product: product._id },
      path: `/product/${product.slug}`,
    });

    if (!res.success) return toast(res.message);

    setOpen(false);

    reload();

    toast(res.message);
  };

  const handleOpenForm = async () => {
    form.setValue("product", product._id);

    form.setValue("user", userId!);

    form.setValue("isVerifiedPurchase", true);

    const review = await getReviewByProductId({ productId: product._id });

    if (review) {
      form.setValue("title", review.title);
      form.setValue("comment", review.comment);
      form.setValue("rating", review.rating);
    }

    setOpen(true);
  };

  return (
    <section className="space-y-4">
      <h2 id="reviews">Customer Reviews</h2>

      {reviews.length === 0 && <p>No reviews yet</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          {reviews.length !== 0 && (
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={product.ratingDistribution}
            />
          )}
          <Separator className="my-3" />
          <div className="space-y-4">
            <h3 className="font-medium">Review this product</h3>
            <p className="text-sm">Share your thoughts with other customers</p>
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  onClick={handleOpenForm}
                  variant="outline"
                  className="rounded-md"
                >
                  Write review
                </Button>
                <DialogContent className="sm:max-w-lg">
                  <Form {...form}>
                    <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>Write a customer review</DialogTitle>
                        <DialogDescription>
                          Share your thoughts with other customers
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-5  ">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter comment"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 5 }).map(
                                      (_, index) => (
                                        <SelectItem
                                          key={index}
                                          value={(index + 1).toString()}
                                        >
                                          <div className="flex items-center gap-1">
                                            {index + 1}{" "}
                                            <StarIcon className="h-4 w-4" />
                                          </div>
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? "Submitting..."
                            : "Submit"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div>
                Please&nbsp;
                <Link
                  href={`/sign-in?callbackUrl=/product/${product.slug}`}
                  className="hover:underline"
                >
                  sign in
                </Link>
                &nbsp;to write a review
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col gap-3">
          {reviews.map((review: IReviewDetails) => (
            <Card key={review._id}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{review.title}</CardTitle>
                  <div className="italic text-sm flex items-center gap-1">
                    <Check size={16} />
                    Verified Purchase
                  </div>
                </div>
                <CardDescription>{review.comment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <Rating rating={review.rating} />
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {review.user ? review.user.name : "Deleted User"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {review.createdAt.toString().substring(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref}>
            {page <= totalPages && (
              <Button variant="link" onClick={loadMoreReviews}>
                See more reviews
              </Button>
            )}
            {page < totalPages && loadingReviews && "Loading"}
          </div>
        </div>
      </div>
    </section>
  );
};
