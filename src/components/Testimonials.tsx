import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS_DATA, Testimonial } from '../types';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<(() => void) | null>(null);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  // Keep ref updated
  useEffect(() => {
    autoPlayRef.current = nextTestimonial;
  });

  // Auto-rotation trigger with pause on hover
  useEffect(() => {
    const play = () => {
      if (autoPlayRef.current) {
        autoPlayRef.current();
      }
    };

    if (!isPaused) {
      const interval = setInterval(play, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
    <section 
      className="bg-luxury-sec py-20 lg:py-28 border-b border-white/5 overflow-hidden" 
      id="testimonials-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-14 lg:mb-18 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col">
            <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase mb-2">
              WHAT OUR CLIENTS SAY
            </span>
            <h2 className="font-serif text-3xl font-light text-white sm:text-4xl max-w-lg">
              Loved by Homes,<br />
              <span className="italic text-gold">Trusted by Hearts.</span>
            </h2>
            <div className="h-0.5 w-16 bg-gold mt-6" />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={prevTestimonial}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-transparent text-gold hover:bg-gold hover:text-luxury-bg hover:border-gold transition-all duration-300"
              aria-label="Previous Testimonial"
              id="testimonial-prev-arrow"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-transparent text-gold hover:bg-gold hover:text-luxury-bg hover:border-gold transition-all duration-300"
              aria-label="Next Testimonial"
              id="testimonial-next-arrow"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 3 cards side by side layout which rotates / highlights on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="testimonials-grid">
          {/* We display a shifted array so that 3 are always visible in an auto-rotating view */}
          {TESTIMONIALS_DATA.map((item, index) => {
            // Determine active highlight based on current index
            const isHighlighted = index === currentIndex;
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`luxury-glass p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 rounded-none ${
                  isHighlighted ? 'border-gold bg-white/[0.04] luxury-border-glow' : 'border-gold/10 hover:border-gold/30'
                }`}
                id={`testimonial-card-${item.id}`}
              >
                {/* Accent glow for active */}
                {isHighlighted && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}

                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-gold/15 group-hover:text-gold/25 transition-colors">
                  <Quote className="h-10 w-10 transform scale-x-[-1]" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Stars row */}
                    <div className="flex items-center space-x-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="font-sans text-xs sm:text-sm font-light leading-relaxed text-muted-text italic">
                      "{item.review}"
                    </p>
                  </div>

                  {/* Reviewer signature */}
                  <div className="mt-8 flex items-center space-x-4 border-t border-gold/10 pt-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-full object-cover border border-gold/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="font-serif text-sm font-medium text-white">{item.name}</span>
                      <span className="font-sans text-[10px] tracking-widest text-gold uppercase mt-0.5">{item.location}</span>
                      <span className="font-sans text-[9px] text-muted-text">{item.role}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic State Carousel Dots */}
        <div className="flex justify-center items-center space-x-2 mt-12">
          {TESTIMONIALS_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                i === currentIndex ? 'w-8 bg-gold' : 'w-1.5 bg-gold/20 hover:bg-gold/45'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
