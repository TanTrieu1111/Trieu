import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, Heart, ShoppingBag, Check, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProducts, fetchReviews, fetchCategories } from '../services/serviceAPI';
import { formatCurrency } from '../utils/formatters.js';
import { calculateAverageRating } from '../utils/rating.js';
import StarRating from '../components/StarRating';

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, revData, catData] = await Promise.all([
          fetchProducts(),
          fetchReviews(),
          fetchCategories()
        ]);
        setProducts(prodData);
        setReviews(revData);
        setCategories(catData);
        setFilteredProducts(prodData);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search Filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.material.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tag Filter from URL
    const queryParams = new URLSearchParams(location.search);
    const tagParam = queryParams.get('tag');
    if (tagParam) {
      result = result.filter(p => `#${p.collection.replace(/\s+/g, '')}`.toLowerCase() === tagParam.toLowerCase());
    }

    // Material Filter
    if (activeMaterial !== 'All') {
      result = result.filter(p => p.material.includes(activeMaterial) || p.name.toLowerCase().includes(activeMaterial.toLowerCase()));
    }

    // Clothing Type Filter
    if (activeType !== 'All') {
      result = result.filter(p => p.collection === activeType);
    }

    // Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [activeMaterial, activeType, sortBy, products, searchQuery, priceRange, location.search]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const materials = ['All', 'Wool', 'Silk', 'Linen', 'Cotton', 'Leather', 'Denim'];

  return (
    <div className="min-h-screen bg-cream selection:bg-accent-brown selection:text-cream">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header Section */}
        <header className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-ink/5 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-accent-brown" />
                <span className="font-sans text-[10px] uppercase tracking-[0.5em] font-bold text-accent-brown">Ready to Wear</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-light mb-8 tracking-tighter leading-[0.9]">
                The <span className="italic serif">Atelier</span> Shop
              </h1>
              <p className="text-lg text-ink/70 max-w-xl font-light leading-relaxed">
                Khám phá bộ sưu tập các thiết kế tinh tuyển, nơi mỗi sản phẩm là sự kết tinh của chất liệu cao cấp và kỹ nghệ thủ công tinh xảo. Từ những món đồ cơ bản đến những thiết kế biểu tượng.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-full lg:w-80"
            >
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/30 group-focus-within:text-accent-brown transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search the collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-ink/10 py-4 pl-10 pr-4 outline-none focus:border-accent-brown transition-all font-sans text-sm placeholder:text-ink/20"
                />
              </div>
            </motion.div>
          </div>
        </header>

        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Sidebar Filters - Refined */}
          <aside className={`lg:w-72 space-y-16 transition-all duration-700 ${isFilterOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
            <div className="space-y-10">
              <section>
                <h4 className="font-sans uppercase text-[10px] tracking-[0.4em] font-bold mb-8 text-ink/40">Category</h4>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setActiveType('All')}
                    className={`text-sm font-light text-left transition-all duration-300 flex items-center gap-3 group ${activeType === 'All' ? 'text-accent-brown translate-x-2' : 'text-ink/60 hover:text-ink hover:translate-x-1'}`}
                  >
                    <div className={`w-1 h-1 rounded-full bg-accent-brown transition-transform duration-300 ${activeType === 'All' ? 'scale-100' : 'scale-0'}`} />
                    All Essentials
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveType(cat.name)}
                      className={`text-sm font-light text-left transition-all duration-300 flex items-center gap-3 group ${activeType === cat.name ? 'text-accent-brown translate-x-2' : 'text-ink/60 hover:text-ink hover:translate-x-1'}`}
                    >
                      <div className={`w-1 h-1 rounded-full bg-accent-brown transition-transform duration-300 ${activeType === cat.name ? 'scale-100' : 'scale-0'}`} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="font-sans uppercase text-[10px] tracking-[0.4em] font-bold mb-8 text-ink/40">Material</h4>
                <div className="flex flex-wrap gap-2">
                  {materials.map(mat => (
                    <button 
                      key={mat}
                      onClick={() => setActiveMaterial(mat)}
                      className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all duration-300 ${activeMaterial === mat ? 'bg-ink text-cream border-ink' : 'bg-transparent text-ink/60 border-ink/10 hover:border-ink hover:text-ink'}`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-8">
                  <h4 className="font-sans uppercase text-[10px] tracking-[0.4em] font-bold text-ink/40">Price Range</h4>
                  <span className="text-[10px] font-bold text-accent-brown">{formatCurrency(priceRange[1])}</span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full h-[2px] bg-ink/10 appearance-none cursor-pointer accent-accent-brown"
                  />
                </div>
              </section>
            </div>

            <div className="pt-12 border-t border-ink/5">
              <div className="bg-stone-100 p-8 rounded-2xl">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-brown mb-4">Personal Styling</p>
                <p className="text-xs text-ink/60 font-light leading-relaxed mb-6">Need help finding the perfect fit? Our stylists are available for virtual consultations.</p>
                <button className="text-[10px] uppercase tracking-widest font-bold border-b border-ink pb-1 hover:text-accent-brown hover:border-accent-brown transition-all">Book Appointment</button>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-10 h-10 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-500 ${isFilterOpen ? 'bg-ink text-cream' : 'group-hover:bg-ink group-hover:text-cream'}`}>
                    <Filter size={14} />
                  </div>
                  <span className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold">
                    {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                  </span>
                </button>
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-ink/20 hidden sm:block">
                  {filteredProducts.length} Results
                </p>
              </div>

              <div className="relative group/sort">
                <button className="flex items-center gap-3 group">
                  <span className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold text-ink/40 group-hover:text-ink transition-colors">Sort By</span>
                  <span className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold">{sortBy}</span>
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </button>
                <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-ink/5 shadow-2xl opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all duration-500 z-30 py-4">
                  {['Featured', 'Price: Low to High', 'Price: High to Low'].map(option => (
                    <button 
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`w-full text-left px-8 py-4 text-[10px] uppercase tracking-[0.3em] transition-all duration-300 ${sortBy === option ? 'text-accent-brown bg-stone-50 font-bold' : 'text-ink/60 hover:bg-stone-50 hover:text-ink'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {currentItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="w-20 h-20 rounded-full border border-ink/5 flex items-center justify-center mx-auto mb-8 opacity-20">
                  <Search size={32} strokeWidth={1} />
                </div>
                <p className="text-ink/40 font-light italic mb-8">No products found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setActiveMaterial('All');
                    setActiveType('All');
                    setSearchQuery('');
                    setPriceRange([0, 2000]);
                  }}
                  className="bg-ink text-cream px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent-brown transition-all duration-500"
                >
                  Reset All Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
                <AnimatePresence mode="popLayout">
                  {currentItems.map((product, idx) => (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="group"
                    >
                      <Link to={`/product/${product.id}`} className="block">
                        <div className="aspect-[3/4] overflow-hidden bg-ink/5 mb-8 relative">
                          <img 
                            src={product.images?.[0] || 'https://picsum.photos/seed/product/600/800'} 
                            alt={product.name} 
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Hover Action */}
                          <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                            <div className="bg-cream text-ink px-8 py-4 text-[10px] uppercase tracking-[0.4em] font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                              View Details
                            </div>
                          </div>

                          {/* Tag */}
                          <div className="absolute top-6 left-6">
                            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-ink/30 [writing-mode:vertical-rl] rotate-180">
                              {product.collection}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-brown">{product.material}</span>
                                <div className="w-1 h-1 rounded-full bg-ink/10" />
                                <StarRating rating={calculateAverageRating(reviews, product.id)} size={8} />
                              </div>
                              <h3 className="text-xl font-light tracking-tight group-hover:text-accent-brown transition-colors duration-500">{product.name}</h3>
                            </div>
                            <p className="text-lg font-light text-ink/80">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination - Refined */}
            {totalPages > 1 && (
              <div className="mt-32 flex justify-center items-center gap-12 border-t border-ink/5 pt-16">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className={`w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-500 ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-ink hover:text-cream hover:border-ink'}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                
                <div className="flex gap-8">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative py-2 group ${currentPage === i + 1 ? 'text-ink' : 'text-ink/30 hover:text-ink'}`}
                    >
                      <span className="text-xs font-bold tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                      <div className={`absolute bottom-0 left-0 h-[2px] bg-accent-brown transition-all duration-500 ${currentPage === i + 1 ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className={`w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center transition-all duration-500 ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:bg-ink hover:text-cream hover:border-ink'}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
