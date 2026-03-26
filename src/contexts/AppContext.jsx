import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthReady, setIsAuthReady] = useState(true);

  // Cart State
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Auth Actions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Cart Actions
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === product.id && item.size === product.size
      );

      let newCart;
      if (existingItemIndex > -1) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }

      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId, size) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => !(item.id === productId && item.size === size));
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId, size, newQuantityOrDelta, isDelta = false) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.id === productId && (!size || item.size === size)) {
          const updatedQuantity = isDelta 
            ? Math.max(1, item.quantity + newQuantityOrDelta)
            : Math.max(1, newQuantityOrDelta);
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <AppContext.Provider value={{
      user,
      isAuthReady,
      login,
      logout,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAuth must be used within an AppProvider');
  return {
    user: context.user,
    isAuthReady: context.isAuthReady,
    login: context.login,
    logout: context.logout,
    isAdmin: context.user?.role === 'admin'
  };
};

export const useCart = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useCart must be used within an AppProvider');
  return {
    cartItems: context.cart,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    cartCount: context.cartCount,
    cartSubtotal: context.cartTotal
  };
};

export default AppContext;
