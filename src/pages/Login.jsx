import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Chrome as Google, Apple } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AppContext';

import { loginUser } from '../services/serviceAPI';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = 'Vui lòng nhập email hoặc tên đăng nhập.';
    } else if (email.includes('@') && !emailRegex.test(email)) {
      errors.email = 'Định dạng email không hợp lệ.';
    }

    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Vui lòng kiểm tra lại thông tin đăng nhập.');
    }
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      
      toast.success('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
      // Use context login
      login(user);
      
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Tài khoản hoặc mật khẩu không chính xác.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Simple Header for Login Page */}
      <header className="p-8 md:p-12 flex justify-between items-center">
        <Link to="/" className="text-2xl tracking-[0.3em] uppercase font-light">Atelier Terre</Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-10 md:p-16 shadow-sm border border-ink/5"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light mb-4">Welcome Back</h1>
            <p className="font-sans uppercase text-[10px] tracking-[0.2em] text-muted-brown">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="font-sans uppercase text-[10px] tracking-widest font-bold text-ink/80">Email or Username</label>
              <div className={`relative flex items-center bg-ink/5 border-b transition-colors ${fieldErrors.email ? 'border-red-500' : 'border-ink/10 focus-within:border-ink'}`}>
                <Mail size={16} className={`absolute left-4 ${fieldErrors.email ? 'text-red-400' : 'text-ink/40'}`} />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="Email or Username"
                  className="w-full bg-transparent py-4 pl-12 pr-4 outline-none text-sm font-sans"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[10px] text-red-500 font-sans tracking-wider uppercase mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-sans uppercase text-[10px] tracking-widest font-bold text-ink/80">Password</label>
                <button type="button" className="font-sans uppercase text-[9px] tracking-widest text-ink/40 hover:text-ink">Forgot?</button>
              </div>
              <div className={`relative flex items-center bg-ink/5 border-b transition-colors ${fieldErrors.password ? 'border-red-500' : 'border-ink/10 focus-within:border-ink'}`}>
                <Lock size={16} className={`absolute left-4 ${fieldErrors.password ? 'text-red-400' : 'text-ink/40'}`} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-4 pl-12 pr-12 outline-none text-sm font-sans"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-ink/40 hover:text-ink"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-red-500 font-sans tracking-wider uppercase mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="remember" className="w-4 h-4 border-ink/20 rounded-sm accent-accent-brown" />
              <label htmlFor="remember" className="font-sans text-[11px] text-ink/60">Remember me for 30 days</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-muted-brown hover:bg-accent-brown text-cream py-5 text-sm uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-12 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-ink/40">
                <span className="bg-white px-4">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 border border-ink/10 py-4 hover:bg-ink/5 transition-colors">
                <Google size={16} />
                <span className="font-sans uppercase text-[10px] tracking-widest font-bold">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 border border-ink/10 py-4 hover:bg-ink/5 transition-colors">
                <Apple size={16} />
                <span className="font-sans uppercase text-[10px] tracking-widest font-bold">Apple</span>
              </button>
            </div>

            <p className="font-sans text-xs text-ink/60">
              Don't have an account? <Link to="#" className="text-ink font-bold hover:underline underline-offset-4">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-ink/5">
        <p className="text-[10px] uppercase tracking-widest text-ink/40">© 2024 Atelier Terre. Conscious Craftsmanship.</p>
        <div className="flex gap-8 text-[10px] uppercase tracking-widest text-ink/40">
          <Link to="#" className="hover:text-ink">Privacy Policy</Link>
          <Link to="#" className="hover:text-ink">Terms of Service</Link>
          <Link to="#" className="hover:text-ink">Shipping & Returns</Link>
        </div>
      </footer>
    </div>
  );
}
