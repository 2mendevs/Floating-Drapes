import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS_DATA } from '../types';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  return (
    <section 
      className="bg-luxury-bg py-20 lg:py-28 border-b border-white/5 overflow-hidden text-white relative" 
      id="testimonials-grid-section"
    >
      {/* Editorial Decorative Background Details */}
      <div className="absolute top-0 right-0 p-8 font-serif text-[120px] text-gold/5 leading-none select-none pointer-events-none">
        ❋
      </div>
      <div className="absolute bottom-0 left-0 p-8 font-serif text-[120px] text-gold/5 leading-none select-none pointer-events-none">
        ❋
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-14 lg:mb-18 pb-6 border-b border-white/5 text-left">
          <span className="font-sans text-[10.5px] font-bold tracking-[0.45em] text-gold uppercase mb-3 block">
            VOICES OF FLOATING DRAPES
          </span>
          <h2 className="font-serif text-3xl sm:text-4.5xl font-normal text-white uppercase tracking-wide">
            Client Impressions
          </h2>
          <div className="h-[2px] w-14 bg-gold mt-5" />
        </div>

        {/* Desktop View: 3-Column Grid (visible on md and up) */}
        <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-10">
          {TESTIMONIALS_DATA.map((item, idx) => {
            // Extract first letter of name
            const initial = item.name.charAt(0);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="group relative p-8 bg-white/[0.02] border border-gold/15 hover:border-gold/30 hover:shadow-[0_15px_30px_rgba(196,147,63,0.06)] transition-all duration-300 rounded-none flex flex-col justify-between text-left"
                id={`testimonial-card-${item.id}`}
              >
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Micro corner details */}
                <div className="absolute top-2 right-2 h-1.5 w-1.5 border-t border-r border-gold/25 group-hover:border-gold transition-colors duration-300" />
                <div className="absolute bottom-2 left-2 h-1.5 w-1.5 border-b border-l border-gold/25 group-hover:border-gold transition-colors duration-300" />

                <div className="space-y-6 relative z-10 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Stars & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center space-x-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                      <span className="font-serif text-3xl text-gold/25 group-hover:text-gold/45 transition-colors duration-300 select-none">❋</span>
                    </div>

                    {/* Review text */}
                    <p className="font-serif text-[15px] sm:text-base font-light italic leading-relaxed text-[#DCD4C9] group-hover:text-white transition-colors duration-300">
                      "{item.review}"
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="pt-6 border-t border-white/5 mt-6">
                    {/* User Profile Block with Letter Initial */}
                    <div className="flex items-center space-x-4">
                      {/* Avatar container */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold font-serif text-lg font-medium tracking-tight select-none group-hover:bg-gold group-hover:text-luxury-bg group-hover:border-gold transition-all duration-300">
                        {initial}
                      </div>
                      {/* Name / Info */}
                      <div>
                        <h4 className="font-serif text-sm font-medium text-white tracking-wide">
                          {item.name}
                        </h4>
                        <p className="font-sans text-[9px] tracking-widest text-gold uppercase mt-0.5">
                          {item.location}
                        </p>
                        <p className="font-sans text-[10px] text-muted-text mt-0.5 font-light">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View: Horizontal Carousel Slider (visible only on mobile) */}
        <div className="md:hidden flex flex-col items-center space-y-6" id="testimonials-mobile-carousel">
          <div className="relative w-full overflow-hidden min-h-[290px] flex items-stretch">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative w-full p-7 bg-white/[0.02] border border-gold/20 flex flex-col justify-between text-left"
                id={`testimonial-card-mobile-${TESTIMONIALS_DATA[activeIndex].id}`}
              >
                {/* Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

                {/* Micro corner details */}
                <div className="absolute top-2 right-2 h-1.5 w-1.5 border-t border-r border-gold/30" />
                <div className="absolute bottom-2 left-2 h-1.5 w-1.5 border-b border-l border-gold/30" />

                <div className="space-y-5 relative z-10 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Stars & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(TESTIMONIALS_DATA[activeIndex].rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                      <span className="font-serif text-2.5xl text-gold/35 select-none">❋</span>
                    </div>

                    {/* Review text */}
                    <p className="font-serif text-[14.5px] font-light italic leading-relaxed text-[#DCD4C9]">
                      "{TESTIMONIALS_DATA[activeIndex].review}"
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="pt-5 border-t border-white/5 mt-4">
                    {/* User Profile Block */}
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold font-serif text-base font-medium select-none">
                        {TESTIMONIALS_DATA[activeIndex].name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-serif text-xs font-medium text-white tracking-wide">
                          {TESTIMONIALS_DATA[activeIndex].name}
                        </h4>
                        <p className="font-sans text-[8px] tracking-widest text-gold uppercase mt-0.5">
                          {TESTIMONIALS_DATA[activeIndex].location}
                        </p>
                        <p className="font-sans text-[9px] text-muted-text mt-0.5 font-light">
                          {TESTIMONIALS_DATA[activeIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Elegant Carousel Controls */}
          <div className="flex items-center justify-between w-full px-2" id="testimonials-mobile-controls">
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="flex items-center justify-center h-10 w-10 border border-gold/20 hover:border-gold bg-black/40 text-gold active:scale-95 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center space-x-2">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 transition-all duration-300 ${
                    idx === activeIndex ? 'w-5 bg-gold' : 'w-1.5 bg-gold/20'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="flex items-center justify-center h-10 w-10 border border-gold/20 hover:border-gold bg-black/40 text-gold active:scale-95 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
