import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchReviews } from '../services/serviceAPI';
import { formatCurrency } from '../utils/formatters.js';
import { calculateAverageRating } from '../utils/rating.js';
import StarRating from './StarRating';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, revData] = await Promise.all([
          fetchProducts(),
          fetchReviews()
        ]);
        // Just take the first 4 for the home page grid
        setProducts(prodData.slice(0, 4));
        setReviews(revData);
      } catch (error) {
        console.error('Failed to load products for grid:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-ink/5 mb-6" />
              <div className="h-4 bg-ink/5 w-1/2 mb-2" />
              <div className="h-6 bg-ink/5 w-3/4 mb-2" />
              <div className="h-4 bg-ink/5 w-1/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="font-sans uppercase text-[10px] tracking-[0.3em] text-muted-brown mb-3 block">Newest Release</span>
          <h2 className="text-4xl font-light">Latest Curations</h2>
        </div>
        <Link to="/products" className="font-sans uppercase text-[10px] tracking-widest border-b border-ink/20 pb-1 hover:border-ink transition-colors">View All Arrivals</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product) => {
          const avgRating = calculateAverageRating(reviews, product.id);
          return (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-[3/4] overflow-hidden bg-ink/5 mb-6 relative">
                  <img 
                    src={product.images?.[0] || 'https://picsum.photos/seed/product/600/800'} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {product.stock === 0 && (
                    <span className="absolute top-4 right-4 bg-ink text-cream px-3 py-1 text-[10px] uppercase tracking-widest">Sold Out</span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-sans uppercase text-[10px] tracking-widest text-muted-brown">{product.collection}</p>
                    <StarRating rating={avgRating} size={8} />
                  </div>
                  <h3 className="text-lg font-light group-hover:text-muted-brown transition-colors">{product.name}</h3>
                  <p className="font-sans text-sm text-muted-brown">{formatCurrency(product.price)}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
