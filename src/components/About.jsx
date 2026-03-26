import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 relative"
        >
          <div className="aspect-[4/5] overflow-hidden relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=1964&auto=format&fit=crop" 
              alt="Studio workshop" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-80 bg-ink/5 -z-0 hidden lg:block"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 space-y-10"
        >
          <span className="font-sans uppercase text-[10px] tracking-[0.4em] text-muted-brown block">The Atelier Heritage</span>
          <h2 className="text-4xl md:text-6xl leading-tight font-light">
            Precision in every stitch, <br />
            <span className="italic">legacy in every fold.</span>
          </h2>
          <p className="text-lg leading-[1.8] text-muted-brown font-light max-w-xl">
            Founded in 1984, ATELIER began with a single vision: to merge the architectural rigor of sculpture with the fluid movement of textiles. Our garments are crafted by hand in our Parisian studio, where master artisans spend hundreds of hours perfecting the silhouette of a single piece.
          </p>
          <div className="pt-6">
            <a href="#" className="text-sm tracking-widest border-b-2 border-accent-brown pb-2 hover:text-accent-brown transition-all duration-300">Read our philosophy</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
