/**
 * Calculate the average rating from an array of reviews.
 * @param {Object[]} reviews - Array of review objects.
 * @param {number} productId - The ID of the product.
 * @returns {number|null} - The average rating rounded to 1 decimal place, or null if no reviews.
 */
export const calculateAverageRating = (reviews, productId) => {
  const productReviews = reviews.filter(r => Number(r.productId) === Number(productId));
  if (productReviews.length === 0) return null;
  
  const sum = productReviews.reduce((acc, curr) => acc + curr.rating, 0);
  const average = sum / productReviews.length;
  return Math.round(average * 10) / 10;
};
