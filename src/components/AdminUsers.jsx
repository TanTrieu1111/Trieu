import React, { useState, useEffect } from 'react';
import { Search, Lock, Unlock, Shield, User } from 'lucide-react';
import { fetchUsers, updateUser } from '../services/serviceAPI';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleLock = async (user) => {
    try {
      const isLocked = user.status === 'locked';
      await updateUser(user.id, { status: isLocked ? 'active' : 'locked' });
      toast.success(`User ${isLocked ? 'unlocked' : 'locked'} successfully`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser(id, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-ink/5 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-ink/5 flex justify-between items-center">
        <h2 className="text-xl font-light">User Management</h2>
        <div className="relative w-64">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input 
            type="text" 
            placeholder="Search users..."
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
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">User</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Email</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Role</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-ink/40 border-b border-ink/5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" className="p-12 text-center text-ink/40 italic">Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" className="p-12 text-center text-ink/40 italic">No users found.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-ink/[0.01] transition-colors">
                  <td className="p-6 border-b border-ink/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-ink/5 rounded-full flex items-center justify-center">
                        <User size={14} className="text-ink/40" />
                      </div>
                      <span className="text-sm font-medium">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="p-6 border-b border-ink/5 text-xs text-ink/60">{user.email}</td>
                  <td className="p-6 border-b border-ink/5">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-ink/5 border-none py-2 px-3 text-[10px] uppercase tracking-widest font-bold outline-none focus:bg-ink/10 transition-colors cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-6 border-b border-ink/5">
                    <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold rounded-full ${user.status === 'locked' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="p-6 border-b border-ink/5">
                    <button 
                      onClick={() => handleToggleLock(user)}
                      className="p-2 hover:bg-ink/5 rounded-full transition-colors text-ink/40 hover:text-ink"
                      title={user.status === 'locked' ? 'Unlock' : 'Lock'}
                    >
                      {user.status === 'locked' ? <Unlock size={16} /> : <Lock size={16} />}
                    </button>
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
