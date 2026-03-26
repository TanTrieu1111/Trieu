import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Check, ChevronRight, Minus, Plus, Share2, Ruler } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth, useCart } from '../contexts/AppContext';
import { fetchProductById, fetchProducts, fetchReviews } from '../services/serviceAPI';
import { formatCurrency } from '../utils/formatters.js';
import { calculateAverageRating } from '../utils/rating.js';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart: addToCartContext } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [foundProduct, allProducts, allReviews] = await Promise.all([
          fetchProductById(id),
          fetchProducts(),
          fetchReviews()
        ]);
        
        setProduct(foundProduct);
        setReviews(allReviews);
        setActiveImageIndex(0); // Reset image index on product change
        
        if (foundProduct && foundProduct.size && foundProduct.size.length > 0) {
          setSelectedSize(foundProduct.size[0]);
        }
        
        // Mock related products
        if (foundProduct) {
          const related = allProducts
            .filter(p => p.id !== foundProduct.id && p.collection === foundProduct.collection)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Failed to load product detail:', error);
        toast.error('Không thể tải thông tin sản phẩm.');
      }
    };

    loadData();
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = (silent = false) => {
    if (!product || !selectedSize) {
      if (!silent) toast.warn('Vui lòng chọn kích thước.');
      return;
    }
    
    const stock = product.stockBySize ? (product.stockBySize[selectedSize] || 0) : 0;
    if (stock <= 0) {
      if (!silent) toast.error('Sản phẩm này đã hết hàng cho kích thước đã chọn.');
      return;
    }
    
    addToCartContext({ ...product, size: selectedSize }, quantity);
    
    if (!silent) {
      toast.success(`${product.name} đã được thêm vào giỏ hàng!`, {
        icon: <ShoppingBag className="text-emerald-500" size={18} />
      });
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };

  const buyItNow = () => {
    handleAddToCart(true);
    navigate('/checkout');
  };

  if (!product) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-ink/10 border-t-accent-brown rounded-full animate-spin"></div>
    </div>
  );

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://picsum.photos/seed/product/600/800'];

  return (
    <div className="min-h-screen bg-cream selection:bg-accent-brown selection:text-cream">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Breadcrumbs - Refined */}
        <nav className="px-6 md:px-12 max-w-screen-2xl mx-auto flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-ink/30 mb-16">
          <Link to="/" className="hover:text-accent-brown transition-colors">Home</Link>
          <div className="w-1 h-1 rounded-full bg-ink/10" />
          <Link to="/products" className="hover:text-accent-brown transition-colors">Atelier</Link>
          <div className="w-1 h-1 rounded-full bg-ink/10" />
          <span className="text-ink font-bold">{product.name}</span>
        </nav>

        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 xl:gap-24">
          {/* Product Images - Immersive */}
          <div className="lg:w-[55%] space-y-8">
            <div className="aspect-[4/5] bg-white relative overflow-hidden group/main shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  src={productImages[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale-[0.1] group-hover/main:grayscale-0 transition-all duration-[2s]"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              
              {/* Floating Collection Tag */}
              <div className="absolute top-10 left-10 z-10">
                <div className="bg-ink text-cream px-6 py-3 text-[10px] uppercase tracking-[0.5em] font-bold shadow-xl">
                  {product.collection}
                </div>
              </div>
            </div>
            
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-6">
                {productImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[3/4] bg-white overflow-hidden transition-all duration-700 relative group ${
                      activeImageIndex === idx ? 'ring-1 ring-accent-brown ring-offset-4 ring-offset-cream' : 'opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} detail ${idx + 1}`} 
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Refined & Sticky */}
          <div className="lg:w-[45%]">
            <div className="lg:sticky lg:top-40 space-y-10">
              <header className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-brown">{product.material}</span>
                    <div className="w-1 h-1 rounded-full bg-ink/10" />
                    <div className="flex items-center gap-2">
                      <StarRating 
                        rating={calculateAverageRating(reviews, product.id)} 
                        size={10} 
                      />
                      <span className="text-[9px] text-ink/30 font-bold tracking-widest">({reviews.filter(r => Number(r.productId) === Number(product.id)).length})</span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-light leading-[1.1] tracking-tight text-ink">
                    {product.name}
                  </h1>
                </div>
                <p className="text-2xl font-light text-ink/90">{formatCurrency(product.price)}</p>
              </header>

              <div className="space-y-12">
                {/* Size Selection - Boutique Style */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <label className="font-sans uppercase text-[10px] tracking-[0.4em] font-bold text-ink/40">Select Size</label>
                    <button className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-bold text-accent-brown hover:text-ink transition-colors group">
                      <Ruler size={12} className="group-hover:rotate-12 transition-transform" />
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {['S', 'M', 'L', 'XL'].map(size => {
                      const stock = product.stockBySize ? (product.stockBySize[size] || 0) : 0;
                      const isOutOfStock = stock === 0;
                      
                      return (
                        <button 
                          key={size}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(size)}
                          className={`py-5 text-[10px] font-bold tracking-[0.2em] transition-all duration-500 border relative overflow-hidden group ${
                            selectedSize === size 
                              ? 'bg-ink text-cream border-ink shadow-lg' 
                              : isOutOfStock 
                                ? 'border-ink/5 text-ink/10 cursor-not-allowed bg-ink/5' 
                                : 'border-ink/10 hover:border-ink hover:bg-ink hover:text-cream'
                          }`}
                        >
                          <span className="relative z-10">{size}</span>
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                              <div className="w-full h-[1px] bg-ink rotate-45" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      <label className="font-sans uppercase text-[10px] tracking-[0.4em] font-bold text-ink/40">Quantity</label>
                      <div className="flex items-center border border-ink/10 bg-white h-16">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="flex-1 h-full flex items-center justify-center hover:bg-ink/5 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-12 text-center font-sans text-xs font-bold">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="flex-1 h-full flex items-center justify-center hover:bg-ink/5 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <button className="w-16 h-16 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-cream transition-all duration-500 mt-8 group">
                      <Heart size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {user?.role === 'user' ? (
                      <>
                        <button 
                          onClick={() => handleAddToCart()}
                          className="w-full bg-ink text-cream py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-accent-brown transition-all duration-700 flex items-center justify-center gap-4 group shadow-xl"
                        >
                          {addedToCart ? (
                            <>
                              <Check size={16} />
                              Added to Bag
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={16} className="group-hover:-translate-y-1 transition-transform" />
                              Add to Bag
                            </>
                          )}
                        </button>
                        <button 
                          onClick={buyItNow}
                          className="w-full border border-ink py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-ink hover:text-cream transition-all duration-700"
                        >
                          Express Checkout
                        </button>
                      </>
                    ) : user?.role === 'admin' ? (
                      <div className="p-8 border border-dashed border-ink/20 text-center rounded-xl bg-stone-50">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-bold">Administrative Preview Mode</p>
                      </div>
                    ) : (
                      <Link 
                        to="/login"
                        className="w-full bg-ink text-cream py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-accent-brown transition-all duration-700 flex items-center justify-center gap-4 shadow-xl"
                      >
                        Sign in to Purchase
                      </Link>
                    )}
                  </div>
                </div>

                {/* Information Tabs - Refined */}
                <div className="pt-12 border-t border-ink/5">
                  <div className="flex gap-8 border-b border-ink/5 mb-10 overflow-x-auto no-scrollbar">
                    {['description', 'details', 'care', 'shipping'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-5 text-[9px] uppercase tracking-[0.3em] font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-ink' : 'text-ink/20 hover:text-ink/50'}`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div layoutId="activeTabDetail" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-brown" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="min-h-[160px]">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-sm font-light leading-relaxed text-ink/60"
                      >
                        {activeTab === 'description' && (
                          <div className="space-y-4">
                            <p>{product.description}</p>
                            <p className="italic text-xs border-l-2 border-accent-brown pl-4 py-2 bg-stone-50">
                              "A testament to minimalist luxury, the {product.name} represents the pinnacle of our {product.collection} collection."
                            </p>
                          </div>
                        )}
                        {activeTab === 'details' && (
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest font-bold text-ink mb-3">Composition</p>
                              <p className="text-xs">100% Premium {product.material}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-widest font-bold text-ink mb-3">Origin</p>
                              <p className="text-xs">Handcrafted in Italy</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[9px] uppercase tracking-widest font-bold text-ink mb-3">Fit</p>
                              <p className="text-xs">Tailored silhouette, true to size. Model is 188cm wearing size M.</p>
                            </div>
                          </div>
                        )}
                        {activeTab === 'care' && (
                          <div className="space-y-4">
                            <p className="text-xs">To preserve the integrity of the {product.material} fibers:</p>
                            <ul className="grid grid-cols-1 gap-3">
                              {['Professional dry clean only', 'Store in a cool, dry place', 'Avoid direct sunlight', 'Use a padded hanger'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
                                  <div className="w-1 h-1 rounded-full bg-accent-brown" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {activeTab === 'shipping' && (
                          <div className="space-y-4">
                            <p className="text-xs">Complimentary express shipping on all orders over $500.</p>
                            <div className="bg-stone-50 p-4 rounded-lg space-y-2">
                              <div className="flex justify-between text-[9px] uppercase tracking-widest">
                                <span>Standard</span>
                                <span>3-5 Business Days</span>
                              </div>
                              <div className="flex justify-between text-[9px] uppercase tracking-widest">
                                <span>Express</span>
                                <span>1-2 Business Days</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-ink/5">
                  <button className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] font-bold text-ink/30 hover:text-ink transition-all group">
                    <Share2 size={14} className="group-hover:scale-110 transition-transform" />
                    Share Piece
                  </button>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-stone-100" />
                    <div className="w-8 h-8 rounded-full bg-stone-200" />
                    <div className="w-8 h-8 rounded-full bg-stone-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products - Refined Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-64 px-6 md:px-12 max-w-screen-2xl mx-auto">
            <div className="flex justify-between items-end mb-16 border-b border-ink/5 pb-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-accent-brown">Complete the Look</span>
                <h2 className="text-4xl font-light tracking-tight">You may also like</h2>
              </div>
              <Link to="/products" className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-accent-brown transition-colors">
                Explore All <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                >
                  <Link to={`/product/${item.id}`} className="group block">
                    <div className="aspect-[3/4] bg-white overflow-hidden mb-6 relative shadow-lg">
                      <img 
                        src={item.images?.[0] || 'https://picsum.photos/seed/product/600/800'} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[1s] group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] uppercase tracking-widest text-accent-brown font-bold">{item.material}</span>
                            <div className="w-1 h-1 rounded-full bg-ink/10" />
                            <StarRating rating={calculateAverageRating(reviews, item.id)} size={8} />
                          </div>
                          <h4 className="text-lg font-light tracking-tight group-hover:text-accent-brown transition-colors duration-500">{item.name}</h4>
                        </div>
                        <p className="text-sm font-light text-ink/60">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
