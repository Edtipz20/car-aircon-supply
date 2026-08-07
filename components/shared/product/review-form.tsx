"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import StarRatingInput from "./star-rating-input";
import { reviewFormSchema, ReviewFormValues } from "@/lib/validators";
import { createOrUpdateReview } from "@/lib/actions/review.action";
import { toast } from "sonner";

const ReviewForm = ({
  productId,
  productSlug,
  existingReview,
  onSuccess,
}: {
  productId: string;
  productSlug: string;
  existingReview?: {
    rating: number;
    title: string;
    description: string;
  } | null;
  onSuccess?: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: existingReview
      ? { productId, ...existingReview }
      : { productId, rating: 0, title: "", description: "" },
  });

  const onSubmit = (data: ReviewFormValues) => {
    startTransition(async () => {
      const res = await createOrUpdateReview(data, productSlug);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      onSuccess?.();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Your Rating</Label>
        <Controller
          name="rating"
          control={form.control}
          render={({ field }) => (
            <StarRatingInput value={field.value} onChange={field.onChange} />
          )}
        />
        {form.formState.errors.rating && (
          <p className="text-xs text-destructive">
            {form.formState.errors.rating.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-xs text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Review</Label>
        <Textarea id="description" rows={4} {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-xs text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="bg-accent hover:bg-accent-dark text-white"
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : existingReview ? (
          "Update Review"
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
};

export default ReviewForm;
