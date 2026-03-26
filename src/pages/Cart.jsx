import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft, 
  Truck, CheckCircle2, Clock, Package, MapPin, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart, useAuth } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatters.js';
import { fetchOrders } from '../services/serviceAPI';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const allOrders = await fetchOrders();
        // Filter orders for the current user
        const userOrders = allOrders.filter(order => order.userId === user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Không thể tải danh sách đơn hàng.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleRemove = (id, size, name) => {
    removeFromCart(id, size);
    toast.info(`${name} đã được xóa khỏi giỏ hàng.`);
  };

  const handleUpdateQuantity = (id, size, delta, name) => {
    updateQuantity(id, size, delta, true);
  };

  const shipping = cartSubtotal > 500 ? 0 : 25;
  const total = cartSubtotal + shipping;

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'cart', label: 'Cart' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'delivered', label: 'Delivered' }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab;
  });

  const showCart = activeTab === 'all' || activeTab === 'cart';
  const showOrders = activeTab === 'all' || activeTab === 'shipping' || activeTab === 'delivered';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent-brown mx-auto mb-4" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink/60">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-accent-brown selection:text-cream">
      <Navbar />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ink/40 mb-12">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <span className="text-ink">Order Management</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-ink/10 pb-8 gap-6">
              <h1 className="text-5xl font-light">Your Orders</h1>
              
              {/* Tab Navigation */}
              <div className="flex gap-8 border-b border-transparent">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-[10px] uppercase tracking-[0.3em] font-bold pb-2 transition-all relative ${
                      activeTab === tab.id ? 'text-ink' : 'text-ink/40 hover:text-ink/60'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-brown"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-16">
              {/* Cart Section */}
              {showCart && (
                <section>
                  {activeTab === 'all' && (
                    <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-ink/40 mb-8">Shopping Bag</h2>
                  )}
                  
                  {cartItems.length > 0 ? (
                    <div className="space-y-10">
                      <AnimatePresence>
                        {cartItems.map((item) => (
                          <motion.div 
                            key={`${item.id}-${item.size}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex gap-6 md:gap-10 group bg-white p-6 border border-ink/5"
                          >
                            <div className="w-24 h-32 md:w-32 md:h-44 bg-ink/5 overflow-hidden flex-shrink-0">
                              <img 
                                src={item.images?.[0] || item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-light mb-1">{item.name}</h3>
                                  <p className="font-sans text-[10px] uppercase tracking-widest text-ink/40 mb-3">{item.material}</p>
                                  <div className="flex items-center gap-4 text-[10px] font-sans uppercase tracking-widest text-ink/60">
                                    <span>Size: {item.size || 'M'}</span>
                                    <div className="w-1 h-1 bg-ink/20 rounded-full" />
                                    <span>Qty: {item.quantity}</span>
                                  </div>
                                </div>
                                <p className="text-base font-light">{formatCurrency(item.price)}</p>
                              </div>

                              <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center border border-ink/10 bg-cream/50">
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.id, item.size, -1, item.name)}
                                    className="p-2 hover:bg-ink/5 transition-colors"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="w-8 text-center font-sans text-xs">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.id, item.size, 1, item.name)}
                                    className="p-2 hover:bg-ink/5 transition-colors"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                <button 
                                  onClick={() => handleRemove(item.id, item.size, item.name)}
                                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink/40 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={12} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : activeTab === 'cart' ? (
                    <div className="py-24 text-center space-y-8 bg-white border border-ink/5">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center text-ink/20">
                          <ShoppingBag size={32} strokeWidth={1} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl font-light">Your bag is empty</h2>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-ink/40">Discover our latest collections</p>
                      </div>
                      <Link 
                        to="/collections" 
                        className="inline-block bg-ink text-cream px-8 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-accent-brown transition-all duration-300"
                      >
                        Explore Collections
                      </Link>
                    </div>
                  ) : null}
                </section>
              )}

              {/* Orders Section */}
              {showOrders && filteredOrders.length > 0 && (
                <section className="space-y-12">
                  {activeTab === 'all' && (
                    <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-ink/40 mb-8 pt-8 border-t border-ink/10">Order History</h2>
                  )}

                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white border border-ink/5 overflow-hidden shadow-sm">
                      {/* Order Header */}
                      <div className="bg-ink/2 px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-ink/5">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Order ID</p>
                            <p className="font-sans text-xs font-bold">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Date Placed</p>
                            <p className="font-sans text-xs">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full ${
                            order.status === 'Shipping' ? 'bg-accent-brown/10 text-accent-brown' : 
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ink/60'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-8">
                        <div className="flex flex-col xl:flex-row gap-12">
                          {/* Order Items */}
                          <div className="flex-1 space-y-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4">
                                <div className="w-16 h-20 bg-ink/5 flex-shrink-0">
                                  <img src={item.images?.[0] || item.image || 'https://picsum.photos/seed/product/400/600'} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                  <h4 className="text-sm font-light">{item.name}</h4>
                                  <p className="text-[10px] text-ink/40 uppercase tracking-widest mt-1">Qty: {item.quantity} • {formatCurrency(item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Status Details */}
                          {order.status === 'Delivered' && (
                            <div className="xl:w-80 flex items-center justify-center bg-green-50/30 border border-green-100 p-8 rounded-sm">
                              <div className="text-center">
                                <CheckCircle2 size={24} className="text-green-600 mx-auto mb-3" />
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-green-700">Delivered Successfully</h4>
                              </div>
                            </div>
                          )}

                          {/* Tracking Details (Only for Shipping) */}
                          {order.status === 'Shipping' && (
                            <div className="xl:w-80 space-y-6 bg-cream/30 p-6 border border-ink/5">
                              <div className="flex items-center gap-3 text-accent-brown">
                                <Truck size={18} />
                                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">Tracking Progress</h4>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="relative h-1 bg-ink/10 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '45%' }}
                                    className="absolute top-0 left-0 h-full bg-accent-brown"
                                  />
                                </div>
                                <p className="text-[10px] font-sans text-ink/60 italic">In Transit - Arrived at local facility</p>
                              </div>

                              <div className="space-y-4 pt-4">
                                <div className="flex gap-4 relative">
                                  <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0 z-10 bg-accent-brown" />
                                  <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-ink">Order Placed</p>
                                    <p className="text-[8px] text-ink/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex gap-4 relative">
                                  <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0 z-10 border-2 border-accent-brown bg-white" />
                                  <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-ink">Processing</p>
                                    <p className="text-[8px] text-ink/40">In Progress</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Empty States for Shipping/Delivered Tabs */}
              {activeTab === 'shipping' && filteredOrders.length === 0 && (
                <div className="py-24 text-center bg-white border border-ink/5">
                  <Truck size={32} className="mx-auto text-ink/20 mb-4" />
                  <p className="text-xs uppercase tracking-widest text-ink/40">No orders currently in transit</p>
                </div>
              )}
              {activeTab === 'delivered' && filteredOrders.length === 0 && (
                <div className="py-24 text-center bg-white border border-ink/5">
                  <Package size={32} className="mx-auto text-ink/20 mb-4" />
                  <p className="text-xs uppercase tracking-widest text-ink/40">No delivered orders found</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary (Only for Cart/All) */}
          {(activeTab === 'all' || activeTab === 'cart') && cartItems.length > 0 && (
            <div className="lg:w-96">
              <div className="bg-white p-10 sticky top-32 border border-ink/5 shadow-sm">
                <h2 className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold mb-10 text-ink/80">Cart Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-ink/60">Subtotal</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-light">
                    <span className="text-ink/60">Shipping</span>
                    <span>{shipping === 0 ? 'Complimentary' : formatCurrency(shipping)}</span>
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-8 mb-10">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans uppercase text-[10px] tracking-[0.2em] font-bold">Total</span>
                    <span className="text-3xl font-light">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-muted-brown text-cream py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent-brown transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  BUY NOW
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
