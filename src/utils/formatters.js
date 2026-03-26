/**
 * Format a number as a currency string.
 * @param {number} amount - The amount to format.
 * @param {string} currency - The currency symbol (default: '$').
 * @returns {string} - The formatted currency string.
 */
export const formatCurrency = (amount, currency = '$') => {
  if (amount === undefined || amount === null) return `${currency}0`;
  return `${currency}${amount.toLocaleString()}`;
};

/**
 * Format a date string or object as a human-readable string.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
