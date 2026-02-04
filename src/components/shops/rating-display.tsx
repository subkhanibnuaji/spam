import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number | null;
  reviews: number | null;
}

export function RatingDisplay({ rating, reviews }: RatingDisplayProps) {
  if (rating === null || rating === undefined) {
    return (
      <span className="text-sm text-muted-foreground">No ratings yet</span>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {/* Filled stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`filled-${i}`}
            className="h-4 w-4 fill-amber-400 text-amber-400"
          />
        ))}
        {/* Half star rendered as filled for simplicity */}
        {hasHalfStar && (
          <Star
            key="half"
            className="h-4 w-4 fill-amber-400/50 text-amber-400"
          />
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="h-4 w-4 fill-none text-gray-300"
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">
        {rating.toFixed(1)}
      </span>
      {reviews !== null && reviews !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({reviews.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
}
