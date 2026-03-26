import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80 py-20 px-6 md:px-12 border-t border-cream/10">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-6">
          <h2 className="text-2xl tracking-[0.3em] uppercase text-cream">Atelier</h2>
          <p className="text-sm leading-relaxed max-w-xs font-light">
            Redefining contemporary luxury through architectural tailoring and conscious craftsmanship. Crafted with intention in our Parisian studio.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream mb-8 font-sans font-bold">Explore</h4>
          <ul className="space-y-4 text-sm font-light">
            <li><a href="#" className="hover:text-cream transition-colors">Archives</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Stockists</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Materials</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Sustainability</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream mb-8 font-sans font-bold">Support</h4>
          <ul className="space-y-4 text-sm font-light">
            <li><a href="#" className="hover:text-cream transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cream transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream mb-8 font-sans font-bold">Contact</h4>
          <ul className="space-y-4 text-sm font-light">
            <li>
              <a href="mailto:Tantrieu1999@gmail.com" className="hover:text-cream transition-colors block">
                Tantrieu1999@gmail.com
              </a>
            </li>
            <li>
              <p className="text-cream/60">
                123 Atelier St, Paris, France
              </p>
            </li>
            <li>
              <a href="tel:+33123456789" className="hover:text-cream transition-colors block">
                +33 1 23 45 67 89
              </a>
            </li>
            <li className="pt-4 flex gap-6">
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest hover:text-cream transition-colors">
                Zalo
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest hover:text-cream transition-colors">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto mt-20 pt-8 border-t border-cream/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">© 2024 Atelier Studio. All rights reserved.</p>
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-cream/40">
          <a href="#" className="hover:text-cream transition-colors">Privacy</a>
          <a href="#" className="hover:text-cream transition-colors">Terms</a>
          <a href="#" className="hover:text-cream transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
