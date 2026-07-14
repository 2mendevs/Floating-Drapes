import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_DATA, PortfolioItem } from '../types';
import { Sliders, Sparkles, ArrowRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  item: PortfolioItem;
}

// Custom interactive drag-to-compare slider component
function BeforeAfterSlider({ item }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      handleMove(e.touches[0].clientX, rect);
    }
  };

  return (
    <div 
      className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden select-none cursor-ew-resize border border-gold/15 bg-zinc-950"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* AFTER IMAGE (Background - showing full width) */}
      <img
        src={item.afterImage}
        alt={`${item.title} - After`}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        referrerPolicy="no-referrer"
      />
      <div className="absolute right-4.5 bottom-4.5 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[8.5px] font-bold tracking-[0.25em] text-gold uppercase border border-gold/20">
        AFTER
      </div>

      {/* BEFORE IMAGE (Foreground - clipped horizontally based on position) */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={item.beforeImage}
          alt={`${item.title} - Before`}
          className="absolute inset-y-0 left-0 h-full w-full object-cover max-w-none"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute left-4.5 bottom-4.5 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 text-[8.5px] font-bold tracking-[0.25em] text-cream uppercase border border-white/10">
          BEFORE
        </div>
      </div>

      {/* SLIDER HANDLE */}
      <div 
        className="absolute inset-y-0 w-[2px] bg-gold cursor-ew-resize flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="h-9 w-9 rounded-full bg-gold text-luxury-bg shadow-[0_0_20px_rgba(196,147,63,0.75)] flex items-center justify-center border border-white/20 transform -translate-x-1/2 select-none">
          <span className="font-sans text-[9px] font-bold tracking-tighter">◀  ▶</span>
        </div>
      </div>

      {/* Prompt Overlay */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none bg-black/55 backdrop-blur-md text-[7.5px] font-bold tracking-[0.3em] text-muted-text px-3 py-1 uppercase rounded-full border border-white/5">
        ◄ SLIDE TO COMPARE ►
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Living Room' | 'Bedroom' | 'Penthouse'>('All');

  const categories: Array<'All' | 'Living Room' | 'Bedroom' | 'Penthouse'> = [
    'All',
    'Living Room',
    'Bedroom',
    'Penthouse'
  ];

  const filteredPortfolio = activeCategory === 'All' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(item => item.category === activeCategory);

  return (
    <section className="bg-luxury-bg py-20 lg:py-28 border-b border-luxury-border text-[#F5F0E8]" id="portfolio-showcase-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block with Flex layout */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 pb-8 border-b border-luxury-border">
          <div className="text-left">
            <span className="font-sans text-[10px] font-bold tracking-[0.45em] text-gold uppercase mb-3 block">
              THE VELORA DIFFERENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4.5xl font-normal text-white">
              Before & After Showcase
            </h2>
            <div className="h-[2px] w-14 bg-gold mt-5" />
          </div>

          {/* Categories Tab Pill Controls on the Right */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-[9.5px] font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-none border ${
                  activeCategory === cat
                    ? 'bg-gold border-gold text-luxury-bg shadow-[0_0_15px_rgba(200,165,106,0.2)]'
                    : 'border-white/10 text-muted-text hover:border-gold/30 hover:text-white'
                }`}
                id={`portfolio-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Slider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10" id="portfolio-sliders-grid">
          <AnimatePresence mode="popLayout">
            {filteredPortfolio.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6 }}
                className="group flex flex-col bg-luxury-sec border border-gold/15 overflow-hidden shadow-2xl"
                id={`portfolio-item-${item.id}`}
              >
                {/* Before-After Slider Container */}
                <BeforeAfterSlider item={item} />

                {/* Info Text below Slider */}
                <div className="p-6.5 flex flex-col justify-between flex-grow text-left">
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2 text-gold text-[8.5px] font-bold tracking-[0.3em] uppercase">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{item.category} Styling</span>
                    </div>
                    <h3 className="font-serif text-xl font-normal text-white group-hover:text-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[12px] font-light leading-relaxed text-muted-text">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Small specs footer */}
                  <div className="mt-5 pt-4.5 border-t border-gold/10 flex items-center justify-between text-[8.5px] tracking-widest text-gold uppercase font-bold">
                    <span>PREMIUM FABRICS</span>
                    <span>100% CALIBRATED FIT</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Explore More CTA Button at Bottom */}
        <div className="mt-16 flex flex-col items-center justify-center space-y-6">
          <button
            onClick={() => {
              const contactElement = document.getElementById('contact-form-section');
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative flex items-center space-x-3.5 bg-transparent border border-gold/45 px-7.5 py-4 text-[10.5px] font-bold tracking-[0.25em] text-white uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-luxury-bg"
            id="portfolio-explore-more-btn"
          >
            <span>EXPLORE MORE PROJECTS</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 group-hover:bg-luxury-bg/10 text-gold group-hover:text-luxury-bg transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
          
          <p className="font-sans text-[11px] italic text-muted-text">
            All transformations represent real Client homes measured with precision lasers and installed by master technicians.
          </p>
        </div>

      </div>
    </section>
  );
}
