import { Instagram, Facebook, Youtube, ArrowUp, Send, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

interface FooterProps {
  setActivePage: (page: string) => void;
  openBookingModal: () => void;
}

export default function Footer({ setActivePage, openBookingModal }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  const handlePageClick = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-luxury-bg border-t border-luxury-border text-white pt-20 pb-8" id="floatingdrapes-luxury-footer">
      
      {/* Texture noise background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay bg-repeat"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Top Newsletter & Logo Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-gold/10">
          
          {/* Logo brand info */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-black/40 p-1.5 mb-2">
              <svg className="h-full w-full text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
                <path d="M2 12C2 12 7 9 12 9C17 9 22 12 22 12C22 12 17 15 12 15C7 15 2 12 2 12Z" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" className="text-gold" />
              </svg>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-serif text-2xl font-normal tracking-[0.2em] text-white">FLOATING DRAPES</span>
            </div>
            <span className="font-sans text-[7.5px] font-bold tracking-[0.45em] text-gold uppercase block">
              CURTAINS & WALLPAPERS
            </span>
            <p className="font-sans text-xs font-light text-muted-text max-w-sm leading-relaxed pt-2">
              We create luxury curtains and designer wallpapers that reflect your personality and elevate your private villas, penthouses, and hospitality spaces.
            </p>
          </div>

          {/* Newsletter registration */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="font-sans text-[9px] font-bold tracking-[0.25em] text-gold uppercase mb-2">FLOATING DRAPES CLUB</span>
            <h4 className="font-serif text-lg font-normal mb-4">Subscribe for private collection previews & bespoke lookbooks.</h4>
            
            {subscribed ? (
              <div className="flex items-center space-x-2 text-gold font-sans text-xs">
                <CheckCircle className="h-4 w-4" />
                <span>You are subscribed to private lookbook publications.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md w-full border-b border-gold/40 focus-within:border-gold transition-colors py-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-transparent text-xs w-full text-white placeholder-white/30 focus:outline-none"
                />
                <button type="submit" className="text-gold hover:text-white transition-colors" aria-label="Subscribe">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* 4 Columns Navigation Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          
          {/* Column 1: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h5 className="font-serif text-xs font-semibold text-gold tracking-widest uppercase">QUICK LINKS</h5>
            <ul className="space-y-2.5 font-sans text-xs text-muted-text font-light">
              <li><button onClick={() => handlePageClick('home')} className="hover:text-gold transition-colors">Home</button></li>
              <li><button onClick={() => handlePageClick('curtains')} className="hover:text-gold transition-colors">Curtains</button></li>
              <li><button onClick={() => handlePageClick('wallpapers')} className="hover:text-gold transition-colors">Wallpapers</button></li>
              <li><button onClick={() => handlePageClick('signature')} className="hover:text-gold transition-colors">Collections</button></li>
              <li><button onClick={() => handlePageClick('portfolio')} className="hover:text-gold transition-colors">Our Work</button></li>
              <li><button onClick={() => handlePageClick('about')} className="hover:text-gold transition-colors">About Us</button></li>
              <li><button onClick={() => handlePageClick('contact')} className="hover:text-gold transition-colors">Contact Us</button></li>
            </ul>
          </div>

          {/* Column 2: Collections */}
          <div className="flex flex-col space-y-4">
            <h5 className="font-serif text-xs font-semibold text-gold tracking-widest uppercase">COLLECTIONS</h5>
            <ul className="space-y-2.5 font-sans text-xs text-muted-text font-light">
              <li><button onClick={() => handlePageClick('signature')} className="hover:text-gold transition-colors">Luxe Drapes</button></li>
              <li><button onClick={() => handlePageClick('signature')} className="hover:text-gold transition-colors">Nature's Canvas</button></li>
              <li><button onClick={() => handlePageClick('signature')} className="hover:text-gold transition-colors">Modern Muse</button></li>
              <li><button onClick={() => handlePageClick('signature')} className="hover:text-gold transition-colors">Royal Texture</button></li>
              <li><button onClick={() => handlePageClick('signature')} className="hover:text-gold transition-colors">Minimal Chic</button></li>
              <li><button onClick={openBookingModal} className="hover:text-gold transition-colors italic">View All Collections ✦</button></li>
            </ul>
          </div>

          {/* Column 3: Help & Warranty */}
          <div className="flex flex-col space-y-4">
            <h5 className="font-serif text-xs font-semibold text-gold tracking-widest uppercase">HELP</h5>
            <ul className="space-y-2.5 font-sans text-xs text-muted-text font-light">
              <li><span className="cursor-pointer hover:text-gold transition-colors">FAQ's</span></li>
              <li><span className="cursor-pointer hover:text-gold transition-colors">Care Guide</span></li>
              <li><span className="cursor-pointer hover:text-gold transition-colors">Installation</span></li>
              <li><span className="cursor-pointer hover:text-gold transition-colors">Warranty</span></li>
              <li><span className="cursor-pointer hover:text-gold transition-colors">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-gold transition-colors">Terms & Conditions</span></li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col space-y-4">
            <h5 className="font-serif text-xs font-semibold text-gold tracking-widest uppercase">CONTACT US</h5>
            <ul className="space-y-3 font-sans text-xs text-muted-text font-light">
              <li className="flex flex-col">
                <span className="text-[10px] text-gold uppercase tracking-wider">Phone</span>
                <a href="tel:+919876543210" className="text-white hover:text-gold transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] text-gold uppercase tracking-wider">Email</span>
                <a href="mailto:hello@floatingdrapes.design" className="text-white hover:text-gold transition-colors">hello@floatingdrapes.design</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] text-gold uppercase tracking-wider">Flagship Address</span>
                <span className="text-white">123, Design Street, Bangalore, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Social Icons, Copyright and Scroll to Top */}
        <div className="pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Social Icons row */}
          <div className="flex items-center space-x-5 text-muted-text">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" title="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" title="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" title="YouTube">
              <Youtube className="h-4 w-4" />
            </a>
            <span className="text-[9px] text-gold/40 tracking-widest uppercase">/ FLOATING DRAPES</span>
          </div>

          {/* Copyright description */}
          <span className="font-sans text-[10px] text-muted-text">
            © 2026 Floating Drapes Curtains & Wallpapers. All Rights Reserved. Crafted with pristine editorial aesthetics.
          </span>

          {/* Back to top widget */}
          <button
            onClick={scrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-gold hover:bg-gold hover:text-luxury-bg hover:border-gold transition-all duration-300"
            title="Scroll to Top"
            id="footer-back-to-top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>

        </div>

      </div>
    </footer>
  );
}
