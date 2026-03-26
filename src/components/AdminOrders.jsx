import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Eye, CheckCircle, Truck, XCircle, Clock } from 'lucide-react';
import { fetchOrders, updateOrder } from '../services/serviceAPI';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrder(id, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchQuery) || 
    o.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={14} className="text-amber-500" />;
      case 'Shipping': return <Truck size={14} className="text-blue-500" />;
      case 'Delivered': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'Cancelled': return <XCircle size={14} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white border border-ink/5 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-ink/5 flex justify-between items-center">
        <h2 className="text-xl font-light">Order Management</h2>
        <div className="relative w-64">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink/5 border-none py-3 pl-12 pr-4 text-xs outline-none focus:bg-ink/10 transition-colors font-sans"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink/[0.02]">
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Order ID</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Date</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Total</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="p-12 text-center text-ink/40 italic">Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="5" className="p-12 text-center text-ink/40 italic">No orders found.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-ink/[0.01] transition-colors">
                  <td className="p-6 border-b border-ink/5 text-sm font-medium">#{order.id}</td>
                  <td className="p-6 border-b border-ink/5 text-xs text-ink/60">{formatDate(order.createdAt)}</td>
                  <td className="p-6 border-b border-ink/5 text-sm font-medium">{formatCurrency(order.total)}</td>
                  <td className="p-6 border-b border-ink/5">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-[10px] uppercase tracking-widest font-bold">{order.status}</span>
                    </div>
                  </td>
                  <td className="p-6 border-b border-ink/5">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-ink/5 border-none py-2 px-3 text-[10px] uppercase tracking-widest font-bold outline-none focus:bg-ink/10 transition-colors cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
