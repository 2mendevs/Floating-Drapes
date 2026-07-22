import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  openBookingModal: () => void;
  brandLogoUrl?: string;
}

export default function Header({ activePage, setActivePage, openBookingModal, brandLogoUrl = '/logo.svg' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scrolling to apply sticky effects if desired, though the background is always solid white as requested
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', id: 'home', targetId: 'home-hero' },
    { label: 'About Us', id: 'about', targetId: 'about-us-section' },
    { label: 'Products', id: 'products', targetId: 'categories-overview-section' },
    { label: 'Transformations', id: 'gallery', targetId: 'before-after-section' },
    { label: 'Services', id: 'services', targetId: 'process-section' },
    { label: 'Testimonials', id: 'testimonials', targetId: 'testimonials-section' },
    { label: 'Contact Us', id: 'contact', targetId: 'cta-banner-section' },
  ];

  const handleNavClick = (id: string, targetId: string) => {
    setIsOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header 
      className="sticky top-0 left-0 w-full z-50 bg-[#FFFFFF] transition-all duration-300"
      style={{ 
        height: '90px',
        boxShadow: '0px 8px 30px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #EAEAEA'
      }}
      id="main-sticky-header"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        
        {/* LOGO LEFT */}
        <div 
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="group flex cursor-pointer items-center"
          id="brand-logo-container"
        >
          <img 
            src={brandLogoUrl} 
            alt="Floating Drapes" 
            className="h-[26px] sm:h-[30px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            id="brand-logo-img"
          />
        </div>

        {/* MENU CENTER */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.targetId)}
              className="relative py-2 text-[14px] font-medium tracking-normal text-[#111111] hover:text-[#029BFA] transition-colors duration-300 font-sans cursor-pointer"
              id={`nav-link-${item.id}`}
            >
              {item.label}
              {activePage === 'home' && (
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#029BFA] transition-all duration-300 hover:w-full" />
              )}
            </button>
          ))}
        </nav>

        {/* PHONE CTA RIGHT */}
        <div className="flex items-center space-x-4">
          <a
            href="tel:+918884009398"
            className="hidden md:flex items-center space-x-3 group"
            id="header-phone-cta"
            title="Call Us Now"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#029BFA] text-white shadow-[0_4px_12px_rgba(2,155,250,0.25)] group-hover:scale-105 transition-transform">
              <Phone className="h-5 w-5 fill-current text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-[14px] font-bold text-[#021E3B] leading-none tracking-normal">
                Call Us Now
              </span>
              <span className="font-sans text-[9px] font-semibold text-[#029BFA] uppercase mt-1 leading-none">
                Direct Support
              </span>
            </div>
          </a>

          {/* Booking Button for easy access */}
          <button
            onClick={openBookingModal}
            className="bg-[#029BFA] hover:bg-[#0082db] text-white text-[12px] font-bold px-4 py-2.5 rounded-full transition-all tracking-wide shadow-[0_4px_12px_rgba(2,155,250,0.2)] hover:shadow-[0_6px_16px_rgba(2,155,250,0.3)] cursor-pointer"
          >
            Estimate
          </button>

          {/* Drawer Trigger on Mobile/Tablet */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-[#EAEAEA] hover:border-[#029BFA] text-[#021E3B] hover:text-[#029BFA] transition-all duration-300 cursor-pointer"
            aria-label="Toggle Menu"
            id="menu-drawer-trigger"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[90px] z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="fixed top-[90px] left-0 right-0 z-50 bg-[#FFFFFF] border-b border-[#EAEAEA] px-6 py-6 shadow-[0_10px_25px_rgba(0,0,0,0.1)] lg:hidden flex flex-col space-y-4"
              id="mobile-nav-panel"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.targetId)}
                  className="w-full text-left py-2 text-[15px] font-medium text-[#111111] hover:text-[#029BFA] transition-colors font-sans border-b border-[#F5F5F5] last:border-0 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 flex items-center justify-between">
                <a
                  href="tel:+918884009398"
                  className="flex items-center space-x-3 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#029BFA] text-white">
                    <Phone className="h-4.5 w-4.5 fill-current" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-serif text-[14px] font-bold text-[#021E3B] leading-none">
                      Call Us Now
                    </span>
                    <span className="font-sans text-[10px] font-semibold text-[#029BFA] uppercase mt-1 leading-none">
                      Direct Support
                    </span>
                  </div>
                </a>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openBookingModal();
                  }}
                  className="bg-[#029BFA] text-white font-sans text-xs font-bold px-4 py-2.5 rounded-full"
                >
                  Free Estimate
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
