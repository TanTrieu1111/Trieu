import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { fetchBanners, createBanner, deleteBanner } from '../services/serviceAPI';
import { toast } from 'react-toastify';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', image: '', active: true });

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBanners();
      setBanners(data);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBanner(formData);
      toast.success('Banner added');
      setFormData({ title: '', image: '', active: true });
      loadBanners();
    } catch (error) {
      toast.error('Failed to add banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await deleteBanner(id);
        toast.info('Banner deleted');
        loadBanners();
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 border border-ink/5 shadow-sm">
          <h2 className="text-xl font-light mb-6">Add Banner</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Banner Title</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-ink/5 border-b border-ink/10 py-3 px-4 outline-none focus:border-ink transition-colors font-sans text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Image URL</label>
              <input 
                required
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full bg-ink/5 border-b border-ink/10 py-3 px-4 outline-none focus:border-ink transition-colors font-sans text-sm"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-ink text-cream py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent-brown transition-all duration-500"
            >
              Add Banner
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full p-8 text-center text-ink/40 italic">Loading banners...</div>
          ) : banners.length === 0 ? (
            <div className="col-span-full p-8 text-center text-ink/40 italic">No banners found.</div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="bg-white border border-ink/5 shadow-sm overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-medium mb-1">{banner.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-ink/40">Active</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
