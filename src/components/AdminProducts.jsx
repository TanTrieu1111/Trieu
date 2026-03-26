import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories, fetchReviews } from '../services/serviceAPI';
import { formatCurrency } from '../utils/formatters.js';
import { calculateAverageRating } from '../utils/rating.js';
import StarRating from './StarRating';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
    materialDescription: '',
    collection: '',
    price: '',
    stockBySize: { S: 0, M: 0, L: 0, XL: 0 },
    images: '', // Store as comma-separated string in form
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodData, catData, revData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchReviews()
      ]);
      setProducts(prodData);
      setCategories(catData);
      setReviews(revData);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        material: product.material || '',
        materialDescription: product.materialDescription || '',
        collection: product.collection || '',
        price: product.price,
        stockBySize: product.stockBySize || { S: 0, M: 0, L: 0, XL: 0 },
        images: Array.isArray(product.images) ? product.images.join(', ') : (product.image || ''),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        material: '',
        materialDescription: '',
        collection: '',
        price: '',
        stockBySize: { S: 0, M: 0, L: 0, XL: 0 },
        images: 'https://picsum.photos/seed/new/600/800',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInventoryChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      stockBySize: {
        ...prev.stockBySize,
        [size]: Math.max(0, parseInt(value) || 0)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalStock = Object.values(formData.stockBySize).reduce((a, b) => a + b, 0);
      const imageArray = formData.images.split(',').map(img => img.trim()).filter(img => img !== '');
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: totalStock, // Maintain total stock for backward compatibility
        size: Object.keys(formData.stockBySize).filter(s => formData.stockBySize[s] > 0),
        images: imageArray,
        image: imageArray[0] || '' // Maintain single image for backward compatibility
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product added');
      }
      
      handleCloseModal();
      loadData();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const [filterSize, setFilterSize] = useState('All');
  const [rowSizes, setRowSizes] = useState({}); // { productId: selectedSize }

  const handleRowSizeChange = (productId, size) => {
    setRowSizes(prev => ({ ...prev, [productId]: size }));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.collection && p.collection.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || p.collection === filterCategory;
    const matchesSize = filterSize === 'All' || (p.stockBySize && p.stockBySize[filterSize] > 0);
    return matchesSearch && matchesCategory && matchesSize;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-ink/5 py-3 pl-12 pr-4 text-xs outline-none focus:bg-ink/5 transition-colors font-sans"
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto bg-white border border-ink/5 py-3 px-4 text-[10px] uppercase tracking-widest font-bold outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
          <select 
            value={filterSize}
            onChange={(e) => { setFilterSize(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto bg-white border border-ink/5 py-3 px-4 text-[10px] uppercase tracking-widest font-bold outline-none cursor-pointer"
          >
            <option value="All">All Sizes</option>
            {['S', 'M', 'L', 'XL'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-ink text-cream px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent-brown transition-all duration-500 flex items-center gap-3"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-ink/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink/[0.02]">
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Product</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Category</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Rating</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Price</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Size</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Quantity</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="p-12 text-center text-ink/40 italic">Loading...</td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan="7" className="p-12 text-center text-ink/40 italic">No products found.</td></tr>
              ) : (
                currentItems.map((product) => {
                  const selectedSize = rowSizes[product.id] || 'All';
                  let displayQuantity = 0;
                  if (selectedSize === 'All') {
                    displayQuantity = product.stockBySize ? Object.values(product.stockBySize).reduce((a, b) => a + b, 0) : product.stock;
                  } else {
                    displayQuantity = product.stockBySize ? (product.stockBySize[selectedSize] || 0) : 0;
                  }

                  return (
                    <tr key={product.id} className="hover:bg-ink/[0.01] transition-colors">
                      <td className="p-6 border-b border-ink/5">
                        <div className="flex items-center gap-4">
                          <img src={product.images?.[0] || product.image} alt={product.name} className="w-10 h-14 object-cover bg-cream" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-sm font-medium text-ink">{product.name}</p>
                            <p className="text-[10px] text-ink/40 uppercase tracking-widest">{product.material}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 border-b border-ink/5 text-xs text-ink/60">{product.collection}</td>
                      <td className="p-6 border-b border-ink/5">
                        <StarRating rating={calculateAverageRating(reviews, product.id)} size={10} showNumeric={false} />
                      </td>
                      <td className="p-6 border-b border-ink/5 text-sm font-medium">{formatCurrency(product.price)}</td>
                      <td className="p-6 border-b border-ink/5">
                        <select 
                          value={selectedSize}
                          onChange={(e) => handleRowSizeChange(product.id, e.target.value)}
                          className="bg-transparent border-b border-ink/10 py-1 text-[10px] uppercase tracking-widest font-bold outline-none cursor-pointer focus:border-ink transition-colors"
                        >
                          <option value="All">All</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                      </td>
                      <td className="p-6 border-b border-ink/5">
                        <span className={`text-[10px] font-mono font-bold ${displayQuantity > 0 ? 'text-ink' : 'text-red-500'}`}>
                          {displayQuantity} units
                        </span>
                      </td>
                      <td className="p-6 border-b border-ink/5">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleOpenModal(product)} className="p-2 hover:bg-ink/5 rounded-full transition-colors text-ink/40 hover:text-ink"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-full transition-colors text-ink/40 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-8 flex justify-between items-center border-t border-ink/5">
          <p className="text-[10px] uppercase tracking-widest text-ink/40">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 border border-ink/10 text-[10px] uppercase tracking-widest font-bold disabled:opacity-20">Prev</button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 border border-ink/10 text-[10px] uppercase tracking-widest font-bold disabled:opacity-20">Next</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-light">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                  <button onClick={handleCloseModal} className="text-ink/20 hover:text-ink"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Name</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-ink/5 border-b border-ink/10 py-3 px-4 outline-none focus:border-ink font-sans text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Category</label>
                      <select name="collection" value={formData.collection} onChange={handleInputChange} className="w-full bg-ink/5 border-b border-ink/10 py-3 px-4 outline-none focus:border-ink font-sans text-sm">
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Price ($)</label>
                      <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-ink/5 border-b border-ink/10 py-3 px-4 outline-none focus:border-ink font-sans text-sm" />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40 block">Inventory by Size</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['S', 'M', 'L', 'XL'].map(size => (
                          <div key={size} className="flex items-center gap-3">
                            <span className="text-xs font-bold w-6">{size}</span>
                            <input 
                              type="number" 
                              value={formData.stockBySize[size]} 
                              onChange={(e) => handleInventoryChange(size, e.target.value)}
                              className="w-full bg-ink/5 border-b border-ink/10 py-2 px-3 outline-none focus:border-ink font-sans text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Image URLs (comma separated)</label>
                      <textarea required name="images" value={formData.images} onChange={handleInputChange} rows={3} className="w-full bg-ink/5 border-b border-ink/10 py-3 px-4 outline-none focus:border-ink font-sans text-sm resize-none" />
                    </div>
                    <div className="aspect-[3/4] bg-ink/5 border border-ink/10 flex flex-col items-center justify-center overflow-hidden relative group">
                      {formData.images ? (
                        <>
                          <img src={formData.images.split(',')[0].trim()} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {editingProduct && (
                            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-ink/5 flex flex-col items-center gap-2">
                              <p className="text-[8px] uppercase tracking-widest font-bold text-ink/40">Current Rating</p>
                              <StarRating rating={calculateAverageRating(reviews, editingProduct.id)} size={12} />
                            </div>
                          )}
                        </>
                      ) : (
                        <ImageIcon size={32} className="text-ink/10" />
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-ink text-cream py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent-brown transition-all duration-500">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
