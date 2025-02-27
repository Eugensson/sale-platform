import { Star } from "lucide-react";

export const Rating = ({
  rating = 0,
  size = 4,
}: {
  rating: number;
  size?: number;
}) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating % 1;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div
      className="flex items-center"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className={`w-${size} h-${size} fill-yellow-500 text-yellow-500`}
        />
      ))}
      {partialStar > 0 && (
        <div className="relative">
          <Star className={`w-${size} h-${size} text-yellow-500`} />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className="size-4 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={`w-${size} h-${size}  text-yellow-500`}
        />
      ))}
    </div>
  );
};
