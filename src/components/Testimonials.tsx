import { motion } from 'motion/react';
import { TESTIMONIALS_DATA } from '../types';
import { Star } from 'lucide-react';

export default function Testimonials() {
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
            VOICES OF VELORA
          </span>
          <h2 className="font-serif text-3xl sm:text-4.5xl font-normal text-white uppercase tracking-wide">
            Client Impressions
          </h2>
          <div className="h-[2px] w-14 bg-gold mt-5" />
        </div>

        {/* 3-Column Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
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

      </div>
    </section>
  );
}
