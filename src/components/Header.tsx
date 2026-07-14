import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  openBookingModal: () => void;
}

export default function Header({ activePage, setActivePage, openBookingModal }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'curtains', label: 'CURTAINS' },
    { id: 'wallpapers', label: 'WALLPAPERS' },
    { id: 'signature', label: 'COLLECTIONS' },
    { id: 'portfolio', label: 'OUR WORK' },
    { id: 'about', label: 'ABOUT US' }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 border-b border-gold/10 bg-black/15 backdrop-blur-[4px] transition-all duration-300">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* LOGO */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="group flex cursor-pointer items-center space-x-3.5"
          id="brand-logo-container"
        >
          {/* Custom Luxury Gold Crest Icon */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-black/40 p-1.5 transition-all duration-500 group-hover:border-gold group-hover:scale-105">
            <svg className="h-full w-full text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
              <path d="M2 12C2 12 7 9 12 9C17 9 22 12 22 12C22 12 17 15 12 15C7 15 2 12 2 12Z" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" className="text-gold" />
            </svg>
            <div className="absolute inset-0.5 rounded-full border border-dashed border-gold/20 group-hover:border-gold/40 transition-colors" />
          </div>
          
          <div className="flex flex-col">
            <span className="font-serif text-xl font-normal tracking-[0.2em] text-white leading-none transition-colors duration-300 group-hover:text-gold">
              VELORA
            </span>
            <span className="font-sans text-[7.5px] font-bold tracking-[0.45em] text-gold uppercase mt-1.5">
              CURTAINS & WALLPAPERS
            </span>
          </div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center space-x-9">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative py-2 text-[10.5px] font-bold tracking-[0.22em] uppercase text-muted-text hover:text-white transition-colors duration-300"
              id={`nav-link-${item.id}`}
            >
              {item.label}
              {activePage === item.id && (
                <motion.div
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 h-[1.5px] w-full bg-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* CTA BUTTONS & HAMBURGER */}
        <div className="flex items-center space-x-4">
          <button
            onClick={openBookingModal}
            className="group relative overflow-hidden rounded-none border border-gold/40 bg-black/20 px-5.5 py-3 text-[10px] font-bold tracking-[0.25em] text-white transition-all duration-300 hover:border-gold hover:bg-gold hover:text-luxury-bg uppercase"
            id="header-cta-booking"
          >
            <span className="relative z-10 flex items-center space-x-2.5">
              <span>BOOK CONSULTATION</span>
              <ArrowRight className="h-3 w-3 text-gold group-hover:text-luxury-bg transition-colors" />
            </span>
          </button>

          {/* Elegant Circular Drawer Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 hover:border-gold bg-black/40 text-white hover:text-gold transition-all duration-300"
            aria-label="Toggle Menu"
            id="menu-drawer-trigger"
          >
            {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* LUXURY SLIDE-IN OVERLAY / MENU DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black backdrop-blur-sm"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-luxury-sec border-l border-gold/15 p-8 sm:p-12 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              id="luxury-nav-drawer"
            >
              <div>
                <div className="flex items-center justify-between pb-8 border-b border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 p-1">
                      <svg className="h-full w-full text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
                      </svg>
                    </div>
                    <span className="font-serif text-lg tracking-widest text-white">VELORA</span>
                  </div>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 hover:border-gold text-muted-text hover:text-white transition-all"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Vertical Navigation items */}
                <div className="flex flex-col space-y-6 mt-12">
                  {/* Home nav element */}
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`text-left font-serif text-2xl tracking-wide ${activePage === 'home' ? 'text-gold font-medium' : 'text-white hover:text-gold'} transition-colors`}
                  >
                    Home Overview
                  </button>
                  {navItems.map((item, idx) => (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`text-left font-serif text-2xl tracking-wide ${
                        activePage === item.id ? 'text-gold font-medium' : 'text-white hover:text-gold'
                      } transition-colors`}
                    >
                      {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Bottom contact info in drawer */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div>
                  <span className="text-[9px] font-bold tracking-widest text-gold uppercase block mb-1">Inquire Directly</span>
                  <a href="tel:+919876543210" className="font-serif text-lg text-white hover:text-gold transition-colors">
                    +91 98765 43210
                  </a>
                </div>
                <div>
                  <span className="text-[9px] font-bold tracking-widest text-gold uppercase block mb-1">Our Studio Address</span>
                  <p className="font-sans text-xs text-muted-text leading-relaxed font-light">
                    123 Design Street, Indiranagar,<br />Bangalore, KA 560038
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openBookingModal();
                  }}
                  className="w-full bg-gold hover:bg-gold-soft text-luxury-bg py-4 text-xs font-bold tracking-[0.25em] uppercase transition-colors"
                >
                  SECURE PRIVATE TRIAL
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
