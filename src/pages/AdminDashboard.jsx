import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  LayoutDashboard,
  Tag,
  Image as  ImageIcon,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminStats from '../components/AdminStats';
import AdminProducts from '../components/AdminProducts';
import AdminOrders from '../components/AdminOrders';
import AdminUsers from '../components/AdminUsers';
import AdminCategories from '../components/AdminCategories';
import AdminBanners from '../components/AdminBanners';
import AdminReviews from '../components/AdminReviews';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminStats />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'categories': return <AdminCategories />;
      case 'banners': return <AdminBanners />;
      case 'reviews': return <AdminReviews />;
      default: return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-cream selection:bg-accent-brown selection:text-cream">
      <Navbar />

      <div className="pt-24 flex min-h-screen">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-ink/5 p-8 sticky top-24 h-[calc(100vh-6rem)]">
          <div className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/40 mb-6">Management</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-ink text-cream' 
                      : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-8 right-8 z-50 bg-ink text-cream p-4 rounded-full shadow-2xl"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar - Mobile Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] lg:hidden"
              />
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-80 bg-white z-[70] p-8 flex flex-col lg:hidden"
              >
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-xl font-light">Atelier Admin</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-ink/40 hover:text-ink">
                    <X size={24} />
                  </button>
                </div>
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-6 py-4 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                        activeTab === item.id 
                          ? 'bg-ink text-cream' 
                          : 'text-ink/60 hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-12 max-w-screen-2xl mx-auto w-full">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-accent-brown font-bold">Atelier Control</span>
              <div className="h-px flex-1 bg-ink/5" />
            </div>
            <h1 className="text-4xl font-light tracking-tight capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </header>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
