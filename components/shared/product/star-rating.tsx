import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StarRating = ({
  rating,
  numReviews,
  size = "h-4 w-4",
}: {
  rating: number;
  numReviews?: number;
  size?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              size,
              star <= Math.round(rating)
                ? "fill-accent text-accent"
                : "fill-none text-muted-foreground",
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {rating.toFixed(1)}
        {typeof numReviews === "number" && (
          <>
            {" "}
            ({numReviews} {numReviews === 1 ? "review" : "reviews"})
          </>
        )}
      </span>
    </div>
  );
};

export default StarRating;
