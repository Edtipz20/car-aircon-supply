"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StarRatingInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="cursor-pointer"
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              (hovered || value) >= star
                ? "fill-accent text-accent"
                : "fill-none text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
