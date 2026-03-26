import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Calendar
} from 'lucide-react';
import { fetchProducts, fetchOrders, fetchUsers } from '../services/serviceAPI';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatCurrency } from '../utils/formatters';

export default function AdminStats() {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '$0', change: '+0%', isUp: true, icon: TrendingUp },
    { label: 'Total Orders', value: '0', change: '+0%', isUp: true, icon: ShoppingBag },
    { label: 'Sales Count', value: '0', change: '+0%', isUp: true, icon: BarChart3 },
    { label: 'Active Users', value: '0', change: '+0%', isUp: true, icon: Users },
  ]);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('week'); // 'day', 'week', 'month'

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, fetchedOrders, users] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
          fetchUsers()
        ]);

        setOrders(fetchedOrders);
        const totalRevenue = fetchedOrders.reduce((sum, order) => sum + order.total, 0);
        const totalItemsSold = fetchedOrders.reduce((sum, order) => {
          return sum + (order.items ? order.items.reduce((iSum, item) => iSum + item.quantity, 0) : 0);
        }, 0);
        
        setStats([
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), change: '+12.5%', isUp: true, icon: TrendingUp },
          { label: 'Total Orders', value: fetchedOrders.length.toString(), change: '+5.2%', isUp: true, icon: ShoppingBag },
          { label: 'Sales Count', value: totalItemsSold.toString(), change: '+8.4%', isUp: true, icon: BarChart3 },
          { label: 'Active Users', value: users.length.toString(), change: '+10%', isUp: true, icon: Users },
        ]);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    loadStats();
  }, []);

  const chartData = useMemo(() => {
    if (!orders.length) return [];

    const now = new Date();
    let data = [];

    if (filter === 'day') {
      // Last 24 hours
      const hours = Array.from({ length: 24 }, (_, i) => {
        const d = new Date(now);
        d.setHours(now.getHours() - (23 - i), 0, 0, 0);
        return d;
      });

      data = hours.map(hour => {
        const hourOrders = orders.filter(o => {
          const oDate = new Date(o.createdAt);
          return oDate.getHours() === hour.getHours() && oDate.toDateString() === hour.toDateString();
        });
        return {
          name: `${hour.getHours()}:00`,
          revenue: hourOrders.reduce((sum, o) => sum + o.total, 0)
        };
      });
    } else if (filter === 'week') {
      // Last 7 days
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        return d;
      });

      data = days.map(day => {
        const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === day.toDateString());
        return {
          name: day.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
        };
      });
    } else if (filter === 'month') {
      // Last 30 days grouped by week or just last 12 months? Let's do last 12 months
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now);
        d.setMonth(now.getMonth() - (11 - i));
        return d;
      });

      data = months.map(month => {
        const monthOrders = orders.filter(o => {
          const oDate = new Date(o.createdAt);
          return oDate.getMonth() === month.getMonth() && oDate.getFullYear() === month.getFullYear();
        });
        return {
          name: month.toLocaleDateString('en-US', { month: 'short' }),
          revenue: monthOrders.reduce((sum, o) => sum + o.total, 0)
        };
      });
    }

    return data;
  }, [orders, filter]);

  return (
    <div className="space-y-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const colors = [
            { bg: 'bg-blue-50', iconBg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-100' },
            { bg: 'bg-purple-50', iconBg: 'bg-purple-100', icon: 'text-purple-600', border: 'border-purple-100' },
            { bg: 'bg-orange-50', iconBg: 'bg-orange-100', icon: 'text-orange-600', border: 'border-orange-100' },
            { bg: 'bg-teal-50', iconBg: 'bg-teal-100', icon: 'text-teal-600', border: 'border-teal-100' },
          ];
          const color = colors[index % colors.length];

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${color.bg} p-8 border ${color.border} shadow-sm rounded-xl relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <stat.icon size={80} />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 ${color.iconBg} rounded-lg`}>
                  <stat.icon size={20} className={color.icon} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.isUp ? 'text-emerald-600' : 'text-red-600'} bg-white/80 px-2 py-1 rounded-full shadow-sm`}>
                  {stat.change}
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1 relative z-10">{stat.label}</p>
              <h3 className="text-3xl font-light relative z-10">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-8 border border-ink/5 shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-xl font-light mb-1">Revenue Overview</h3>
            <p className="text-[10px] uppercase tracking-widest text-ink/40">Track your earnings over time</p>
          </div>
          
          <div className="flex bg-ink/5 p-1 rounded-lg">
            {['day', 'week', 'month'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all ${
                  filter === f ? 'bg-ink text-cream shadow-md' : 'text-ink/40 hover:text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#14141466' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#14141466' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  fontSize: '12px',
                  padding: '12px'
                }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === chartData.length - 1 ? '#3b82f6' : '#94a3b8'} 
                    className="transition-all duration-500 hover:fill-blue-600"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
