import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating component to display a 5-star rating bar and/or numeric rating.
 * @param {number} rating - The numeric rating (0-5).
 * @param {boolean} showNumeric - Whether to show the numeric value.
 * @param {number} size - The size of the stars.
 * @param {string} className - Additional classes for the container.
 */
export default function StarRating({ rating, showNumeric = true, size = 10, className = "" }) {
  const hasRating = rating !== null && rating !== undefined;
  const displayRating = hasRating ? rating : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={size} 
            className={hasRating && i < Math.round(displayRating) ? 'fill-amber-400 text-amber-400' : 'text-ink/10'} 
          />
        ))}
      </div>
      {showNumeric && (
        <span className="text-[10px] font-sans font-bold text-ink/60">
          {hasRating ? Number(rating).toFixed(1) : "No rating"}
        </span>
      )}
    </div>
  );
}
