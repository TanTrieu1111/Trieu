/**
 * Base API handler.
 * Using relative path '/api' to ensure compatibility with the server running on port 3000.
 * NOTE: Port 3001 is not externally accessible in this environment.
 */
const BASE_URL = '/api';

/**
 * Generic API request function.
 * @param {string} endpoint - The API endpoint (e.g., '/products').
 * @param {Object} options - Fetch options (method, headers, body, etc.).
 * @returns {Promise<any>} - The parsed JSON response.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // For 204 No Content responses (like DELETE)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Error [${url}]:`, error);
    throw error;
  }
};
