import { Star } from "lucide-react";
import { getProductReviews } from "@/lib/actions/review.action";

const ReviewList = async ({ productId }: { productId: string }) => {
  const reviews = await getProductReviews(productId);

  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No reviews yet. Be the first to review this product.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-accent text-accent"
                      : "fill-none text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            {review.isVerifiedPurchase && (
              <span className="text-xs text-green-700 font-medium">
                Verified Purchase
              </span>
            )}
          </div>
          <p className="font-semibold text-sm">{review.title}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {review.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {review.user.name} ·{" "}
            {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(
              review.createdAt,
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
