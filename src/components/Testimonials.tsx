import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS_DATA } from '../types';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<(() => void) | null>(null);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  useEffect(() => {
    autoPlayRef.current = nextTestimonial;
  });

  useEffect(() => {
    const play = () => {
      if (autoPlayRef.current) {
        autoPlayRef.current();
      }
    };

    if (!isPaused) {
      const interval = setInterval(play, 7000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section 
      className="bg-luxury-bg py-20 lg:py-28 border-b border-white/5 overflow-hidden text-white relative" 
      id="testimonials-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Editorial Decorative Background Details */}
      <div className="absolute top-0 right-0 p-8 font-serif text-[120px] text-gold/5 leading-none select-none pointer-events-none">
        ❋
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-14 lg:mb-18 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="text-left">
            <span className="font-sans text-[10.5px] font-bold tracking-[0.45em] text-gold uppercase mb-3 block">
              VOICES OF VELORA
            </span>
            <h2 className="font-serif text-3xl sm:text-4.5xl font-normal text-white uppercase tracking-wide">
              What Our Clients Say
            </h2>
            <div className="h-[2px] w-14 bg-gold mt-5" />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3.5 self-end">
            <button 
              onClick={prevTestimonial}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-transparent text-gold hover:bg-gold hover:text-luxury-bg hover:border-gold transition-all duration-300 cursor-pointer animate-none"
              aria-label="Previous Testimonial"
              id="testimonial-prev-arrow"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-transparent text-gold hover:bg-gold hover:text-luxury-bg hover:border-gold transition-all duration-300 cursor-pointer animate-none"
              aria-label="Next Testimonial"
              id="testimonial-next-arrow"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Editorial Layout with Crossfade Transitions */}
        <div className="relative min-h-[500px] sm:min-h-[440px] lg:min-h-[380px] flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full"
              id={`editorial-testimonial-${current.id}`}
            >
              
              {/* Left Side: Client Image with Frame (Spans 4 columns) */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <div className="relative group/img">
                  <div className="absolute inset-2.5 border border-gold/35 z-10 pointer-events-none transition-all duration-500 group-hover/img:inset-1.5" />
                  <img
                    src={current.image}
                    alt={current.name}
                    className="h-[320px] w-[260px] lg:h-[380px] lg:w-[300px] object-cover border border-gold/15 shadow-2xl brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  {/* Decorative corner highlights */}
                  <div className="absolute top-0 left-0 h-6 w-6 border-t border-l border-gold/40" />
                  <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-gold/40" />
                </div>
              </div>

              {/* Right Side: Editorial Review content (Spans 8 columns) */}
              <div className="lg:col-span-8 text-left flex flex-col justify-center space-y-6 lg:pl-4">
                
                {/* Large Decorative Serif Asterisk */}
                <span className="font-serif text-5xl text-gold/35 leading-none select-none">❋</span>
                
                {/* Review Text */}
                <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl font-light italic leading-relaxed text-white/90 tracking-wide">
                  "{current.review}"
                </blockquote>

                {/* Stars and Reviewer info */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4">
                    <span className="font-serif text-lg sm:text-xl font-normal text-white">
                      {current.name}
                    </span>
                    <span className="hidden sm:inline text-gold/50">|</span>
                    <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-gold uppercase mt-1 sm:mt-0">
                      {current.location}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-muted-text uppercase tracking-widest font-medium">
                    {current.role}
                  </p>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Custom Progress / Dots Indicator */}
        <div className="flex justify-center items-center space-x-3 mt-14">
          {TESTIMONIALS_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`h-2.5 transition-all duration-500 rounded-full cursor-pointer ${
                i === currentIndex ? 'w-10 bg-gold' : 'w-2.5 bg-gold/20 hover:bg-gold/45'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
