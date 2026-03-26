import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CreditCard, Truck, ShieldCheck, ArrowRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { useCart, useAuth } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatters.js';
import { createOrder } from '../services/serviceAPI';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Vietnam',
    postalCode: '',
    paymentMethod: 'card'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  const subtotal = cartSubtotal;
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required';
    } else {
      switch (name) {
        case 'phone':
          if (!/^0\d*$/.test(value)) {
            error = 'Phone must start with 0 and contain only digits';
          }
          break;
        case 'firstName':
        case 'lastName':
        case 'city':
          if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
            error = 'This field must contain only letters';
          }
          break;
        case 'address':
          if (!/^[a-zA-Z0-9À-ỹ\s,.\-\/]+$/.test(value)) {
            error = 'Address must contain only letters and numbers';
          }
          break;
        case 'postalCode':
          if (!/^\d+$/.test(value)) {
            error = 'ZIP must contain only digits';
          }
          break;
        default:
          break;
      }
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = 
    formData.phone && !errors.phone &&
    formData.firstName && !errors.firstName &&
    formData.lastName && !errors.lastName &&
    formData.address && !errors.address &&
    formData.city && !errors.city &&
    formData.postalCode && !errors.postalCode;

  const handleOpenConfirmModal = (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fill in all fields correctly.');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user?.id || 'guest',
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.images?.[0] || item.image
        })),
        total: total,
        status: 'Shipping',
        trackingNumber: `AT-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentMethod: formData.paymentMethod,
        shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.postalCode}`,
        createdAt: new Date().toISOString()
      };

      await createOrder(orderData);
      
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      toast.success('Đơn hàng đã được đặt thành công!');
    } catch (error) {
      console.error('Failed to process order:', error);
      setIsProcessing(false);
      toast.error('Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl w-full text-center space-y-12"
          >
            <div className="flex justify-center">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.2 }}
                className="w-32 h-32 bg-accent-brown text-cream rounded-full flex items-center justify-center shadow-2xl shadow-accent-brown/20"
              >
                <CheckCircle2 size={64} strokeWidth={1} />
              </motion.div>
            </div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-6xl font-light tracking-tight text-ink"
              >
                Order Confirmed
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 max-w-lg mx-auto"
              >
                <p className="text-muted-brown font-light leading-relaxed text-lg">
                  Thank you for choosing Atelier Terre. Your order <span className="font-medium text-ink">#AT-92831</span> has been placed successfully and is being prepared with care.
                </p>
                <p className="text-ink/40 text-sm uppercase tracking-widest">
                  A confirmation has been sent to your phone number.
                </p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-12 flex flex-col md:flex-row items-center justify-center gap-6"
            >
              <Link 
                to="/products" 
                className="w-full md:w-auto bg-ink text-cream px-16 py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-accent-brown transition-all duration-700 shadow-xl shadow-ink/10"
              >
                Continue Shopping
              </Link>
              <Link 
                to="/cart"
                className="w-full md:w-auto border border-ink/10 px-16 py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-ink hover:text-cream transition-all duration-700 flex items-center justify-center"
              >
                View Orders
              </Link>
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-accent-brown selection:text-cream">
      <Navbar />

      {/* Professional Loading Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-cream/90 backdrop-blur-md flex flex-col items-center justify-center gap-8"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative w-24 h-24"
            >
              <div className="absolute inset-0 border-4 border-ink/5 rounded-full" />
              <div className="absolute inset-0 border-4 border-accent-brown border-t-transparent rounded-full" />
            </motion.div>
            <div className="text-center space-y-2">
              <p className="font-sans uppercase text-[10px] tracking-[0.4em] font-bold text-ink">Processing Payment</p>
              <p className="text-[10px] text-ink/40 uppercase tracking-widest">Please do not refresh the page</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Checkout Form */}
          <div className="flex-1">
            <Link to="/cart" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-12">
              <ChevronLeft size={14} />
              Back to Bag
            </Link>

            <form onSubmit={handleOpenConfirmModal} className="space-y-16">
              {/* Contact Information */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center text-[10px] font-bold">01</span>
                  <h2 className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold text-ink/80">Contact Information</h2>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, phone: validateField('phone', e.target.value) }))}
                      placeholder="Phone Number"
                      className={`w-full bg-transparent border-b py-4 outline-none transition-colors font-light ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-ink/10 focus:border-ink'}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center text-[10px] font-bold">02</span>
                  <h2 className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold text-ink/80">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col">
                    <input 
                      required
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, firstName: validateField('firstName', e.target.value) }))}
                      placeholder="First Name"
                      className={`bg-transparent border-b py-4 outline-none transition-colors font-light ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-ink/10 focus:border-ink'}`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input 
                      required
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, lastName: validateField('lastName', e.target.value) }))}
                      placeholder="Last Name"
                      className={`bg-transparent border-b py-4 outline-none transition-colors font-light ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-ink/10 focus:border-ink'}`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.lastName}</p>
                    )}
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <input 
                      required
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, address: validateField('address', e.target.value) }))}
                      placeholder="Street Address"
                      className={`bg-transparent border-b py-4 outline-none transition-colors font-light ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-ink/10 focus:border-ink'}`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.address}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input 
                      required
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, city: validateField('city', e.target.value) }))}
                      placeholder="City"
                      className={`bg-transparent border-b py-4 outline-none transition-colors font-light ${errors.city ? 'border-red-500 focus:border-red-500' : 'border-ink/10 focus:border-ink'}`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.city}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input 
                      required
                      type="text" 
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      onBlur={(e) => setErrors(prev => ({ ...prev, postalCode: validateField('postalCode', e.target.value) }))}
                      placeholder="Postal Code"
                      className={`bg-transparent border-b py-4 outline-none transition-colors font-light ${errors.postalCode ? 'border-red-500 focus:border-red-500' : 'border-ink/10 focus:border-ink'}`}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-widest">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center text-[10px] font-bold">03</span>
                  <h2 className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold text-ink/80">Payment Method</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    className={`p-6 border flex flex-col gap-4 transition-all duration-300 text-left ${formData.paymentMethod === 'card' ? 'border-ink bg-white shadow-sm' : 'border-ink/5 hover:border-ink/20'}`}
                  >
                    <CreditCard size={20} strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1">Credit Card</p>
                      <p className="text-[10px] text-ink/40 uppercase tracking-widest">Visa, Mastercard, AMEX</p>
                    </div>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank' }))}
                    className={`p-6 border flex flex-col gap-4 transition-all duration-300 text-left ${formData.paymentMethod === 'bank' ? 'border-ink bg-white shadow-sm' : 'border-ink/5 hover:border-ink/20'}`}
                  >
                    <Truck size={20} strokeWidth={1.5} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1">Bank Transfer</p>
                      <p className="text-[10px] text-ink/40 uppercase tracking-widest">Local bank transfer</p>
                    </div>
                  </button>
                </div>
              </section>

              <button 
                disabled={isProcessing || !isFormValid}
                className="w-full bg-ink text-cream py-6 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-accent-brown transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Purchase
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-8 pt-4 border-t border-ink/5">
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-ink/40">
                  <ShieldCheck size={14} />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-ink/40">
                  <Truck size={14} />
                  Insured Shipping
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-[450px]">
            <div className="bg-white p-10 sticky top-32 border border-ink/5 shadow-sm">
              <h2 className="font-sans uppercase text-[10px] tracking-[0.3em] font-bold mb-10 text-ink/80">Your Order</h2>
              
              <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-28 bg-ink/5 flex-shrink-0 overflow-hidden">
                      <img 
                        src={item.images?.[0] || item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale-[0.2]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-light mb-1">{item.name}</h4>
                        <p className="text-[10px] text-ink/40 uppercase tracking-widest">Qty: {item.quantity} • Size: M</p>
                      </div>
                      <p className="text-sm font-light">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-8 border-t border-ink/5">
                <div className="flex justify-between text-xs font-light">
                  <span className="text-ink/60">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-light">
                  <span className="text-ink/60">Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : formatCurrency(shipping)}</span>
                </div>
              </div>

              <div className="border-t border-ink/10 pt-8">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans uppercase text-[10px] tracking-[0.2em] font-bold">Total</span>
                  <span className="text-3xl font-light">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-12 p-6 bg-cream/50 border border-ink/5 space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-accent-brown">Atelier Terre Concierge</p>
                <p className="text-[10px] text-ink/60 leading-relaxed uppercase tracking-wider">
                  Our team is available to assist with your order. <br />
                  contact@atelierterre.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <Modal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Your Order"
        message={`You are about to place an order for ${formatCurrency(total)}. Would you like to proceed?`}
        type="info"
        confirmText="Place Order"
        onConfirm={processOrder}
      />
    </div>
  );
}
