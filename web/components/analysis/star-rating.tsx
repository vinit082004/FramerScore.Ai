import { Star, StarHalf } from "lucide-react";

export function StarRating({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const threshold = i + 1;
    if (value >= threshold) return "full";
    if (value >= threshold - 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {stars.map((state, i) =>
        state === "full" ? (
          <Star key={i} className="size-4 fill-warning text-warning" />
        ) : state === "half" ? (
          <StarHalf key={i} className="size-4 fill-warning text-warning" />
        ) : (
          <Star key={i} className="size-4 text-border" />
        )
      )}
    </div>
  );
}
