import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_DATA, PortfolioItem } from '../types';
import { Sliders, CheckCircle, Sparkles, MoveLeft } from 'lucide-react';

interface BeforeAfterSliderProps {
  item: PortfolioItem;
}

// Single Before-After slider element that supports drag-to-compare with coordinates or simple touch events
function BeforeAfterSlider({ item }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return; // Only move when clicked/dragged
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
      className="relative aspect-video w-full overflow-hidden select-none cursor-ew-resize border border-gold/15 bg-zinc-950"
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
      <div className="absolute right-4 bottom-4 z-10 bg-black/70 backdrop-blur-md px-2 py-1 text-[9px] font-bold tracking-[0.2em] text-gold uppercase border border-gold/20">
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
        <div className="absolute left-4 bottom-4 z-10 bg-black/70 backdrop-blur-md px-2 py-1 text-[9px] font-bold tracking-[0.2em] text-cream uppercase border border-white/10">
          BEFORE
        </div>
      </div>

      {/* DRAGGABLE HANDLE / BAR */}
      <div 
        className="absolute inset-y-0 w-1 bg-gold cursor-ew-resize flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="h-8 w-8 rounded-full bg-gold text-luxury-bg shadow-[0_0_15px_rgba(200,165,106,0.5)] flex items-center justify-center border border-white/20 transform -translate-x-1/2">
          <Sliders className="h-3 w-3 rotate-90" />
        </div>
      </div>

      {/* Subtle Drag Hint Overlay on top center */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 pointer-events-none bg-black/50 backdrop-blur-md text-[8px] font-bold tracking-[0.25em] text-muted-text px-2.5 py-1 uppercase rounded-full">
        ◄ DRAG TO COMPARE ►
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Living Room' | 'Bedroom' | 'Dining Room' | 'Kids Room'>('All');

  const categories: Array<'All' | 'Living Room' | 'Bedroom' | 'Dining Room' | 'Kids Room'> = [
    'All',
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Kids Room'
  ];

  const filteredPortfolio = activeCategory === 'All' 
    ? PORTFOLIO_DATA 
    : PORTFOLIO_DATA.filter(item => item.category === activeCategory);

  return (
    <section className="bg-[#0f0f0f] py-20 lg:py-28 border-b border-white/5" id="portfolio-showcase-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-14 text-center">
          <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase mb-2 block">
            REAL SPACES. REAL TRANSFORMATIONS.
          </span>
          <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
            See The Difference
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-gold mt-4" />
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-none ${
                activeCategory === cat
                  ? 'bg-gold text-luxury-bg shadow-[0_0_15px_rgba(200,165,106,0.2)]'
                  : 'border border-white/10 text-muted-text hover:border-gold/30 hover:text-white'
              }`}
              id={`portfolio-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Interactive Sliders Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2" id="portfolio-sliders-grid">
          <AnimatePresence mode="popLayout">
            {filteredPortfolio.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="group flex flex-col bg-luxury-bg border border-gold/10 overflow-hidden shadow-2xl"
                id={`portfolio-item-${item.id}`}
              >
                {/* Drag Comparison Element */}
                <BeforeAfterSlider item={item} />

                {/* Info and styling description */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center space-x-2 text-gold text-[9px] font-bold tracking-[0.3em] uppercase mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{item.category} Styling</span>
                    </div>
                    <h3 className="font-serif text-xl font-normal text-cream group-hover:text-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs font-light text-muted-text mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gold/10 flex items-center justify-between text-[10px] tracking-widest text-muted-text uppercase">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="h-3.5 w-3.5 text-gold" />
                      <span>Premium Fabrics</span>
                    </span>
                    <span>100% Calibrated Fit</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Portfolio Note */}
        <div className="mt-14 text-center">
          <p className="font-sans text-xs italic text-muted-text">
            All transformations represent real Client homes measured with precision lasers and installed by Floating Drapes specialists.
          </p>
        </div>

      </div>
    </section>
  );
}
