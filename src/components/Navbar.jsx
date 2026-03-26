import React, { useState } from 'react';
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../contexts/AppContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-ink/5">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
        {/* Left: Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {user?.role !== 'admin' && (
            <Link to="/" className="text-sm uppercase tracking-widest font-sans font-medium hover:text-muted-brown transition-colors">Home</Link>
          )}
          <Link to="/products" className="text-sm uppercase tracking-widest font-sans font-medium hover:text-muted-brown transition-colors">Products</Link>
          <Link to="/collections" className="text-sm uppercase tracking-widest font-sans font-medium hover:text-muted-brown transition-colors">Collections</Link>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to={user?.role === 'admin' ? "/admin" : "/"} className="text-2xl md:text-3xl tracking-[0.3em] font-light uppercase">Atelier</Link>
        </div>

        {/* Right: User, Cart */}
        <div className="flex items-center gap-6">
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4 md:gap-6">
            {user && user.role === 'admin' && (
              <Link to="/admin" className="hidden lg:block text-[10px] uppercase tracking-widest font-bold text-accent-brown hover:text-ink transition-colors">Admin Panel</Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:block text-[10px] uppercase tracking-widest font-bold text-muted-brown">Hi, {user.fullName.split(' ')[0]}</span>
                <button onClick={handleLogout} className="hover:text-red-600 transition-colors" title="Logout">
                  <LogOut size={20} strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-muted-brown transition-colors">
                <User size={22} strokeWidth={1.5} />
              </Link>
            )}
            {user?.role === 'user' && (
              <Link to="/cart" className="relative hover:text-muted-brown transition-colors">
                <ShoppingBag size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-brown text-[10px] text-cream rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-cream border-b border-ink/10 px-6 py-8 flex flex-col gap-6"
          >
            {user?.role !== 'admin' && (
              <Link to="/" className="text-lg uppercase tracking-widest font-sans font-medium">Home</Link>
            )}
            <Link to="/products" className="text-lg uppercase tracking-widest font-sans font-medium">Products</Link>
            <Link to="/collections" className="text-lg uppercase tracking-widest font-sans font-medium">Collections</Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-lg uppercase tracking-widest font-sans font-medium text-accent-brown">Admin Panel</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
