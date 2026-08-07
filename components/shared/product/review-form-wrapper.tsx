"use client";

import { useRouter } from "next/navigation";
import ReviewForm from "./review-form";

const ReviewFormWrapper = ({
  productId,
  productSlug,
  existingReview,
}: {
  productId: string;
  productSlug: string;
  existingReview?: {
    rating: number;
    title: string;
    description: string;
  } | null;
}) => {
  const router = useRouter();

  return (
    <ReviewForm
      productId={productId}
      productSlug={productSlug}
      existingReview={existingReview}
      onSuccess={() => router.refresh()}
    />
  );
};

export default ReviewFormWrapper;
