import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProducts, fetchReviews } from '../services/serviceAPI';
import { calculateAverageRating } from '../utils/rating.js';
import { formatCurrency } from '../utils/formatters.js';
import StarRating from '../components/StarRating';
import { useCart } from '../contexts/AppContext';

const collections = [
  {
    id: 'winter-2026',
    name: 'Winter 2026',
    title: 'Ethereal Warmth',
    description: 'A collection focused on the luxury of comfort. Heavyweight cashmere, structured wool overcoats, and layered silhouettes designed for the coldest mornings.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
    color: 'bg-stone-200',
    tag: '#Winter2026'
  },
  {
    id: 'fall-2026',
    name: 'Fall 2026',
    title: 'Architectural Lines',
    description: 'Exploring the intersection of geometry and garment. Sharp tailoring meets fluid movement in a palette of deep earth tones and monochrome textures.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
    color: 'bg-zinc-300',
    tag: '#Fall2026'
  },
  {
    id: 'summer-2026',
    name: 'Summer 2026',
    title: 'Solaris',
    description: 'Capturing the essence of light. Breathable Belgian linens and sheer silk organza in silhouettes that move with the summer breeze.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200',
    color: 'bg-orange-50',
    tag: '#Summer2026'
  },
  {
    id: 'spring-2026',
    name: 'Spring 2026',
    title: 'The Awakening',
    description: 'Minimalist foundations for the changing season. Soft raw silks and fine-weave cottons that define effortless elegance.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200',
    color: 'bg-emerald-50',
    tag: '#Spring2026'
  }
];

export default function Collections() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, revData] = await Promise.all([
          fetchProducts(),
          fetchReviews()
        ]);
        setProducts(prodData);
        setReviews(revData);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadData();
  }, []);

  const handleExpand = (collectionId) => {
    if (expandedCollection === collectionId) {
      setExpandedCollection(null);
      setSelectedProduct(null);
    } else {
      setExpandedCollection(collectionId);
      setSelectedProduct(null);
    }
  };

  const handleProductSelect = (product, collectionTag) => {
    if (selectedProduct?.id === product.id) {
      // If already selected, redirect on second click
      navigate(`/products?tag=${encodeURIComponent(collectionTag)}`);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleBuyNow = (collectionTag) => {
    if (selectedProduct) {
      // Add to cart with default size M
      addToCart({ ...selectedProduct, size: 'M' }, 1);
      toast.success(`${selectedProduct.name} added to cart`);
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-accent-brown selection:text-cream">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <header className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-20 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-accent-brown" />
                <span className="font-sans text-[10px] uppercase tracking-[0.5em] font-bold text-accent-brown">Curated Selection</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-tighter leading-[0.9]">
                The <span className="italic serif">Collections</span>
              </h1>
              <p className="text-lg text-ink/70 max-w-xl font-light leading-relaxed">
                Mỗi bộ sưu tập tại Atelier Terre là một chương trong hành trình khám phá sự giao thoa giữa nghệ thuật kiến trúc và thời trang tối giản. Chúng tôi tôn vinh những giá trị vượt thời gian thông qua chất liệu tự nhiên.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="hidden lg:block"
            >
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 [writing-mode:vertical-rl] rotate-180">Established 2026</span>
                <div className="w-[1px] h-24 bg-ink/10" />
              </div>
            </motion.div>
          </div>
        </header>

        {/* Collections List */}
        <div className="space-y-20 md:space-y-28">
          {collections.map((collection, index) => {
            const collectionProducts = products.filter(p => p.collection === collection.name);
            const isExpanded = expandedCollection === collection.id;

            return (
              <section key={collection.id} className="group/section">
                <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
                  <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-stretch`}>
                    
                    {/* Image Column */}
                    <div className="w-full lg:w-[50%] relative">
                      <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="aspect-[4/5] overflow-hidden bg-ink/5 relative"
                      >
                        <img 
                          src={collection.image} 
                          alt={collection.title} 
                          className="w-full h-full object-cover grayscale-[0.2] group-hover/section:grayscale-0 transition-all duration-[1.5s] group-hover/section:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-ink/5 group-hover/section:bg-transparent transition-colors duration-1000" />
                        
                        {/* Floating Label */}
                        <div className={`absolute top-12 ${index % 2 === 0 ? '-left-6' : '-right-6'} hidden xl:block`}>
                          <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-ink/20 [writing-mode:vertical-rl] rotate-180">
                            {collection.tag}
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-[50%] flex flex-col justify-center py-8">
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold text-accent-brown">0{index + 1}</span>
                          <div className="w-8 h-[1px] bg-accent-brown/30" />
                          <span className="text-[10px] font-sans uppercase tracking-[0.4em] font-bold text-accent-brown/60">{collection.name}</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-light mb-6 leading-[1.1] tracking-tight">
                          {collection.title}
                        </h2>
                        
                        <p className="text-base text-ink/60 font-light leading-relaxed mb-8 max-w-md">
                          {collection.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-10">
                          <button 
                            onClick={() => handleExpand(collection.id)}
                            className="group/btn relative inline-flex items-center gap-6"
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink mb-1">
                                {isExpanded ? 'Collapse' : 'Explore'}
                              </span>
                              <div className="w-full h-[1px] bg-ink/10 relative overflow-hidden">
                                <div className={`absolute inset-0 bg-ink transition-transform duration-500 ${isExpanded ? 'translate-x-0' : '-translate-x-full group-hover/btn:translate-x-0'}`} />
                              </div>
                            </div>
                            <div className={`w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-ink text-cream' : 'group-hover/btn:bg-ink group-hover/btn:text-cream group-hover/btn:scale-110'}`}>
                              {isExpanded ? <ChevronUp size={18} /> : <ArrowRight size={18} />}
                            </div>
                          </button>
                          
                          {!isExpanded && (
                            <div className="flex -space-x-3">
                              {collectionProducts.slice(0, 3).map((p, i) => (
                                <div key={p.id} className="w-10 h-10 rounded-full border-2 border-cream overflow-hidden bg-ink/5 shadow-sm">
                                  <img src={p.images?.[0] || p.image} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {collectionProducts.length > 3 && (
                                <div className="w-10 h-10 rounded-full border-2 border-cream bg-stone-100 flex items-center justify-center text-[8px] font-bold text-ink/40">
                                  +{collectionProducts.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Expanded Section - Integrated Design */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden mt-24"
                    >
                      <div className="bg-[#1a1914] text-cream relative py-20 lg:py-24">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden">
                          <div className="absolute -top-24 -left-24 text-[20vw] font-bold leading-none select-none uppercase tracking-tighter">
                            {collection.name}
                          </div>
                        </div>

                        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                            
                            {/* Left: Large Preview (5 cols) */}
                            <div className="lg:col-span-5">
                              <div className="aspect-[4/5] bg-white/[0.02] relative overflow-hidden border border-white/10 shadow-3xl group/preview">
                                {selectedProduct ? (
                                  <motion.img 
                                    key={selectedProduct.id}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    src={selectedProduct.images?.[0] || selectedProduct.image} 
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-white/10 space-y-6">
                                    <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center">
                                      <ShoppingBag size={32} strokeWidth={1} />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Select a masterpiece</p>
                                  </div>
                                )}
                                <div className="absolute inset-0 border-[20px] border-transparent group-hover/preview:border-white/5 transition-all duration-700 pointer-events-none" />
                              </div>
                            </div>

                            {/* Right: Info & Grid (7 cols) */}
                            <div className="lg:col-span-7 flex flex-col justify-between min-h-[50vh]">
                              <div>
                                <div className="flex items-center gap-6 mb-12">
                                  <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/30">Collection Pieces</h3>
                                  <div className="flex-1 h-[1px] bg-white/10" />
                                </div>
                                
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                  {collectionProducts.map(product => (
                                    <button
                                      key={product.id}
                                      onClick={() => handleProductSelect(product, collection.tag)}
                                      className={`aspect-[3/4] relative overflow-hidden group border transition-all duration-500 ${
                                        selectedProduct?.id === product.id 
                                          ? 'border-accent-brown scale-105 z-10 shadow-xl' 
                                          : 'border-white/5 opacity-60 hover:opacity-100 hover:scale-105'
                                      }`}
                                    >
                                      <img 
                                        src={product.images?.[0] || product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className={`absolute inset-0 transition-opacity duration-500 ${selectedProduct?.id === product.id ? 'opacity-0' : 'bg-black/20 group-hover:opacity-0'}`} />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-16 pt-12 border-t border-white/10">
                                <AnimatePresence mode="wait">
                                  {selectedProduct ? (
                                    <motion.div
                                      key={selectedProduct.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -20 }}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end"
                                    >
                                      <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                          <span className="text-[10px] uppercase tracking-widest text-accent-brown font-bold">{selectedProduct.material}</span>
                                          <div className="w-1 h-1 rounded-full bg-white/20" />
                                          <StarRating rating={calculateAverageRating(reviews, selectedProduct.id)} size={10} />
                                        </div>
                                        <h4 className="text-3xl md:text-4xl font-light text-white tracking-tight">{selectedProduct.name}</h4>
                                        <p className="text-sm text-white/40 font-light max-w-xs">{selectedProduct.description?.slice(0, 80)}...</p>
                                      </div>
                                      
                                      <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-baseline mb-2">
                                          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Price</span>
                                          <span className="text-2xl font-light">{formatCurrency(selectedProduct.price)}</span>
                                        </div>
                                        <button 
                                          onClick={() => handleBuyNow(collection.tag)}
                                          className="w-full bg-white text-ink py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-accent-brown hover:text-white transition-all duration-700 flex items-center justify-center gap-4 group/buy"
                                        >
                                          Acquire Piece
                                          <ArrowRight size={16} className="group-hover/buy:translate-x-2 transition-transform" />
                                        </button>
                                      </div>
                                    </motion.div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                      <p className="text-[10px] uppercase tracking-[0.5em] font-bold">Select an item to view details</p>
                                    </div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            );
          })}
        </div>

        {/* Call to Action */}
        <section className="mt-48 px-6 md:px-12 max-w-screen-2xl mx-auto text-center">
          <div className="py-32 border-t border-ink/10">
            <h3 className="text-3xl md:text-5xl font-light mb-12">Ready to find your next staple?</h3>
            <Link 
              to="/products" 
              className="inline-block bg-ink text-cream px-12 py-6 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent-brown transition-all duration-500"
            >
              Shop All Products
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
