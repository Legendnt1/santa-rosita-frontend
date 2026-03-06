import { Icon } from "./Icon";

/**
 * StarRating component to display product ratings with stars and review count.
 * Shows full, half, and empty stars based on the rating value.
 * Also includes a link to the reviews section with the review count. 
 * @param rating - The average rating value (e.g., 4.5)
 * @param reviewCount - The total number of reviews for the product
 * @param reviewsLabel - Localized label for reviews, with a placeholder for count (e.g., "{count} reviews")
 * @returns A JSX element displaying the star rating and review count.
 */
export function StarRating({
  rating,
  reviewCount,
  reviewsLabel,
}: {
  rating: number;
  reviewCount: number;
  reviewsLabel: string;
}) {
  /**
   * Calculates the number of full, half, and empty stars based on the rating.
   */
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const text = reviewsLabel.replace("{count}", String(reviewCount));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-semibold text-sm text-card-foreground">
        {rating.toFixed(1)}
      </span>
      <span
        className="flex items-center"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: fullStars }, (_, i) => (
          <Icon key={`f${i}`} name="star-full" className="h-4 w-4 text-amber-400" />
        ))}
        {hasHalf && (
          <Icon name="star-half" className="h-4 w-4 text-amber-400" />
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Icon key={`e${i}`} name="star-empty" className="h-4 w-4 text-foreground-muted/25" />
        ))}
      </span>
      <a href="#reviews" className="text-sm text-primary hover:underline">
        {text}
      </a>
    </div>
  );
}
