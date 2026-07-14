import { useState } from 'react';
import { Menu, X, Phone, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  openBookingModal: () => void;
}

export default function Header({ activePage, setActivePage, openBookingModal }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'curtains', label: 'Curtains' },
    { id: 'wallpapers', label: 'Wallpapers' },
    { id: 'signature', label: 'Signature Collections' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(200,165,106,0.15)] bg-luxury-bg/90 backdrop-blur-xl transition-all duration-300">
      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent w-full" />
      
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* LOGO */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="group flex cursor-pointer flex-col items-start"
          id="brand-logo-container"
        >
          <div className="flex items-baseline space-x-1">
            <span className="font-serif text-2xl font-semibold tracking-widest text-white group-hover:text-gold transition-colors duration-300">
              VELORA
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </div>
          <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-gold uppercase opacity-90">
            FLOATING DRAPES
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative py-2 text-xs font-medium tracking-[0.18em] uppercase text-muted-text hover:text-white transition-colors duration-300"
              id={`nav-link-${item.id}`}
            >
              {item.label}
              {activePage === item.id && (
                <motion.div
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 h-[1px] w-full bg-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* CTA BUTTONS */}
        <div className="hidden lg:flex items-center space-x-6">
          <a 
            href="tel:+18005558900" 
            className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-muted-text hover:text-gold transition-colors duration-300"
            id="header-phone-link"
          >
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span>INQUIRE</span>
          </a>
          
          <button
            onClick={openBookingModal}
            className="group relative overflow-hidden rounded-none border border-gold/30 bg-transparent px-6 py-3 text-xs font-semibold tracking-[0.2em] text-white transition-all duration-300 hover:border-gold"
            id="header-cta-booking"
          >
            {/* Hover Background slide */}
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-gold/10 to-gold/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            
            <span className="relative z-10 flex items-center space-x-2">
              <span>BOOK CONSULTATION</span>
              <ArrowRight className="h-3 w-3 text-gold group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* MOBILE TRIGGER */}
        <div className="flex lg:hidden items-center space-x-4">
          <button
            onClick={openBookingModal}
            className="rounded-full bg-gold/10 p-2 text-gold border border-gold/20"
            title="Book Consultation"
            id="mobile-quick-book"
          >
            <Calendar className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:text-gold transition-colors"
            aria-label="Toggle Menu"
            id="mobile-menu-trigger"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-b border-gold/10 bg-luxury-sec lg:hidden"
            id="mobile-nav-drawer"
          >
            <div className="flex flex-col space-y-4 px-6 py-8">
              {navItems.map((item, idx) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-xs font-semibold tracking-[0.2em] uppercase py-2 border-b border-white/5 ${
                    activePage === item.id ? 'text-gold pl-2 border-l border-gold' : 'text-muted-text'
                  } transition-all duration-300`}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openBookingModal();
                  }}
                  className="w-full text-center bg-gold py-4 text-xs font-bold tracking-[0.25em] text-luxury-bg uppercase hover:bg-gold-soft transition-colors"
                >
                  BOOK FREE CONSULTATION
                </button>
                <a
                  href="tel:+18005558900"
                  className="w-full text-center border border-white/15 py-4 text-xs font-bold tracking-[0.25em] text-white uppercase hover:border-gold transition-colors"
                >
                  CALL DIRECT: 1-800-VELORA
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
