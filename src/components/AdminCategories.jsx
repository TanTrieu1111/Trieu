import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { fetchCategories, createCategory, deleteCategory } from '../services/serviceAPI';
import { toast } from 'react-toastify';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName });
      toast.success('Category added');
      setNewCategoryName('');
      loadCategories();
    } catch (error) {
      toast.error('Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteCategory(id);
        toast.info('Category deleted');
        loadCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="bg-white p-8 border border-ink/5 shadow-sm">
          <h2 className="text-xl font-light mb-6">Add Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Category Name</label>
              <input 
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Outerwear"
                className="w-full bg-ink/5 border-b border-ink/10 py-3 px-4 outline-none focus:border-ink transition-colors font-sans text-sm"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-ink text-cream py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent-brown transition-all duration-500 flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Add Category
            </button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white border border-ink/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-ink/5">
            <h2 className="text-xl font-light">Existing Categories</h2>
          </div>
          <div className="divide-y divide-ink/5">
            {isLoading ? (
              <div className="p-8 text-center text-ink/40 italic">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-ink/40 italic">No categories found.</div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="p-6 flex justify-between items-center hover:bg-ink/[0.01] transition-colors">
                  <div className="flex items-center gap-4">
                    <Tag size={16} className="text-ink/20" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-ink/40 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
