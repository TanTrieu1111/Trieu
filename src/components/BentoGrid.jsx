import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const items = [
  {
    title: "Spring 2026",
    subtitle: "The Awakening",
    image: "https://picsum.photos/seed/spring/1200/1600",
    className: "md:col-span-2 md:row-span-2",
    link: "/collections"
  },
  {
    title: "Summer 2026",
    subtitle: "Golden Hour",
    image: "https://picsum.photos/seed/summer/800/1000",
    className: "md:col-span-1 md:row-span-1",
    link: "/collections"
  },
  {
    title: "Fall 2026",
    subtitle: "Whispering Leaves",
    image: "https://picsum.photos/seed/fall/800/1000",
    className: "md:col-span-1 md:row-span-1",
    link: "/collections"
  },
  {
    title: "Winter 2026",
    subtitle: "Silent Snow",
    image: "https://picsum.photos/seed/winter/1200/800",
    className: "md:col-span-2 md:row-span-1",
    link: "/collections"
  }
];

export default function BentoGrid() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-light mb-4">Curated Collections</h2>
        <p className="text-muted-brown font-light max-w-xl">Explore our seasonal narratives, each a distinct chapter in the Atelier story.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 h-[1200px] md:h-[900px]">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden group ${item.className}`}
          >
            <Link to={item.link} className="block w-full h-full">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/40 transition-colors duration-500" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-cream">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-80">{item.subtitle}</p>
                <h3 className="text-3xl md:text-4xl font-light mb-6">{item.title}</h3>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold group-hover:translate-x-2 transition-transform duration-500">
                  Explore Collections <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
