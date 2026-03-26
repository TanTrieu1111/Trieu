import { apiRequest } from './api';

/**
 * Fetch all products from the database.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of products.
 */
export const fetchProducts = () => apiRequest('/products');

/**
 * Fetch a single product by ID.
 * @param {number} id - The ID of the product to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the product object.
 */
export const fetchProductById = (id) => apiRequest(`/products/${id}`);

/**
 * Fetch all users from the database.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of users.
 */
export const fetchUsers = () => apiRequest('/users');

/**
 * Create a new product.
 * @param {Object} productData - The product data to create.
 * @returns {Promise<Object>} - The created product.
 */
export const createProduct = (productData) => apiRequest('/products', {
  method: 'POST',
  body: JSON.stringify(productData),
});

/**
 * Update an existing product.
 * @param {number} id - The ID of the product to update.
 * @param {Object} productData - The product data to update.
 * @returns {Promise<Object>} - The updated product.
 */
export const updateProduct = (id, productData) => apiRequest(`/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(productData),
});

/**
 * Delete a product.
 * @param {number} id - The ID of the product to delete.
 */
export const deleteProduct = (id) => apiRequest(`/products/${id}`, {
  method: 'DELETE',
});

/**
 * Update a user.
 * @param {number} id - The ID of the user to update.
 * @param {Object} userData - The user data to update.
 */
export const updateUser = (id, userData) => apiRequest(`/users/${id}`, {
  method: 'PUT',
  body: JSON.stringify(userData),
});

/**
 * Fetch all orders.
 */
export const fetchOrders = () => apiRequest('/orders');

/**
 * Update an order.
 */
export const updateOrder = (id, orderData) => apiRequest(`/orders/${id}`, {
  method: 'PUT',
  body: JSON.stringify(orderData),
});

/**
 * Create a new order.
 * @param {Object} orderData - The order data to create.
 * @returns {Promise<Object>} - The created order.
 */
export const createOrder = (orderData) => apiRequest('/orders', {
  method: 'POST',
  body: JSON.stringify(orderData),
});

/**
 * Fetch all categories.
 */
export const fetchCategories = () => apiRequest('/categories');

/**
 * Create a category.
 */
export const createCategory = (categoryData) => apiRequest('/categories', {
  method: 'POST',
  body: JSON.stringify(categoryData),
});

/**
 * Delete a category.
 */
export const deleteCategory = (id) => apiRequest(`/categories/${id}`, {
  method: 'DELETE',
});

/**
 * Fetch all banners.
 */
export const fetchBanners = () => apiRequest('/banners');

/**
 * Create a banner.
 */
export const createBanner = (bannerData) => apiRequest('/banners', {
  method: 'POST',
  body: JSON.stringify(bannerData),
});

/**
 * Delete a banner.
 */
export const deleteBanner = (id) => apiRequest(`/banners/${id}`, {
  method: 'DELETE',
});

/**
 * Fetch all reviews.
 */
export const fetchReviews = () => apiRequest('/reviews');

/**
 * Delete a review.
 */
export const deleteReview = (id) => apiRequest(`/reviews/${id}`, {
  method: 'DELETE',
});

/**
 * Login a user.
 * @param {string} email - The email or username.
 * @param {string} password - The password.
 * @returns {Promise<Object>} - The logged-in user.
 */
export const loginUser = (email, password) => apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
