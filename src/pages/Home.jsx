import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Featured from '../components/Featured';
import ProductGrid from '../components/ProductGrid';
import About from '../components/About';
import BentoGrid from '../components/BentoGrid';
import Footer from '../components/Footer';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-accent-brown selection:text-cream">
      <Navbar />
      
      <main>
        <Hero />
        
        <Featured />
        
        <BentoGrid />
        
        <ProductGrid />
        
        <About />
        
        {/* Quote Section */}
        <section className="py-32 bg-ink/5 text-center">
          <div className="px-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <span className="text-6xl text-accent-brown/30 font-serif leading-none">"</span>
              <p className="text-3xl md:text-4xl italic text-muted-brown leading-relaxed font-light">
                Style is a silent language, a conversation between the wearer and the world, spoken through the weight of a drape and the texture of a thread.
              </p>
              <p className="font-sans uppercase text-[10px] tracking-[0.4em] text-accent-brown">Marcello V., Creative Director</p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
