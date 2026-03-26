import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
          alt="Editorial fashion" 
          className="w-full h-full object-cover brightness-90"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="font-sans uppercase text-xs tracking-[0.4em] text-white/80 mb-6 block">Autumn / Winter 2024</span>
          <h1 className="text-6xl md:text-8xl text-white leading-[1.1] mb-10 font-light">
            Poetry in <br />
            <span className="italic">Motion</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-8">
            <Link to="/collections" className="bg-accent-brown hover:bg-muted-brown text-cream px-10 py-4 text-sm uppercase tracking-widest transition-all duration-300 rounded-sm">
              Shop Collections
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
