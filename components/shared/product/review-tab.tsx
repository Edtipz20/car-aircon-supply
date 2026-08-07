import { auth } from "@/auth";
import {
  canUserReviewProduct,
  getUserReviewForProduct,
} from "@/lib/actions/review.action";
import ReviewList from "./review-list";
import ReviewFormWrapper from "./review-form-wrapper";

const ReviewsTab = async ({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) => {
  const session = await auth();
  const eligible = session?.user?.id
    ? await canUserReviewProduct(productId)
    : false;
  const existingReview = session?.user?.id
    ? await getUserReviewForProduct(productId)
    : null;

  return (
    <div className="space-y-8">
      {eligible ? (
        <div className="border border-border rounded-lg p-5">
          <h3 className="font-bold mb-4">
            {existingReview ? "Edit Your Review" : "Write a Review"}
          </h3>
          <ReviewFormWrapper
            productId={productId}
            productSlug={productSlug}
            existingReview={existingReview}
          />
        </div>
      ) : session?.user?.id ? (
        <p className="text-sm text-muted-foreground border border-border rounded-lg p-4">
          Only customers who&apos;ve purchased this product can leave a review.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground border border-border rounded-lg p-4">
          Please sign in to leave a review.
        </p>
      )}

      <ReviewList productId={productId} />
    </div>
  );
};

export default ReviewsTab;
