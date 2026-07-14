import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS_DATA } from '../types';
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
      const interval = setInterval(play, 6000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
    <section 
      className="bg-[#EAE5D9] py-20 lg:py-28 border-b border-gold/15 overflow-hidden text-zinc-900" 
      id="testimonials-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-14 lg:mb-18 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col">
            <span className="font-sans text-[10px] font-bold tracking-[0.45em] text-gold-soft uppercase mb-3 block">
              WHAT OUR CLIENTS SAY
            </span>
            <h2 className="font-serif text-3xl sm:text-4.5xl font-normal text-zinc-950">
              Loved by Homes, <br />
              <span className="italic text-gold-soft">Trusted by Hearts.</span>
            </h2>
            <div className="h-[2px] w-14 bg-gold-soft mt-6" />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button 
              onClick={prevTestimonial}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gold-soft/30 bg-white/50 text-gold-soft hover:bg-gold hover:text-luxury-bg hover:border-gold transition-all duration-300"
              aria-label="Previous Testimonial"
              id="testimonial-prev-arrow"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-gold-soft/30 bg-white/50 text-gold-soft hover:bg-gold hover:text-luxury-bg hover:border-gold transition-all duration-300"
              aria-label="Next Testimonial"
              id="testimonial-next-arrow"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* 3 cards side by side layout which rotates / highlights on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="testimonials-grid">
          {TESTIMONIALS_DATA.map((item, index) => {
            const isHighlighted = index === currentIndex;
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 bg-[#FAF8F5] border ${
                  isHighlighted 
                    ? 'border-gold-soft shadow-[0_15px_30px_rgba(200,165,106,0.15)] scale-[1.02]' 
                    : 'border-gold-soft/15 hover:border-gold-soft/35'
                }`}
                id={`testimonial-card-${item.id}`}
              >
                {/* Accent glow for active */}
                {isHighlighted && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gold-soft" />
                )}

                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-gold-soft/10">
                  <Quote className="h-10 w-10 transform scale-x-[-1]" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Stars row */}
                    <div className="flex items-center space-x-1.5 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="font-sans text-xs sm:text-sm font-light leading-relaxed text-zinc-700 italic text-left">
                      "{item.review}"
                    </p>
                  </div>

                  {/* Reviewer signature */}
                  <div className="mt-8 flex items-center space-x-4 border-t border-gold-soft/15 pt-6 text-left">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-full object-cover border border-gold-soft/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="font-serif text-sm font-medium text-zinc-950">{item.name}</span>
                      <span className="font-sans text-[10px] tracking-widest text-gold-soft uppercase mt-0.5 font-bold">{item.location}</span>
                      <span className="font-sans text-[9px] text-zinc-500">{item.role}</span>
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
                i === currentIndex ? 'w-8 bg-gold-soft' : 'w-1.5 bg-gold-soft/20 hover:bg-gold-soft/45'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
