import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface SectionProps {
  onSelectCategory: (category: 'curtains' | 'wallpapers') => void;
}

export default function CurtainsWallpapersSection({ onSelectCategory }: SectionProps) {
  return (
    <section className="bg-luxury-bg py-20 lg:py-28 border-b border-white/5" id="categories-overview-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-14 lg:mb-18 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col">
            <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase mb-2">
              CURATED TO PERFECTION
            </span>
            <h2 className="font-serif text-3xl font-light leading-tight text-white sm:text-4xl max-w-lg">
              Curtains & <br className="hidden sm:inline" />
              Wallpapers <span className="italic text-gold">That Define You.</span>
            </h2>
            <div className="h-0.5 w-16 bg-gold mt-6" />
          </div>
          
          <p className="font-sans text-xs font-light text-muted-text max-w-md leading-relaxed">
            Every room has a unique voice. We provide the vocabulary through heavy drapery, whisper-soft sheers, and hand-gilded fine wallpapers tailored to your architectural style.
          </p>
        </div>

        {/* The Two Large Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* CARD 1: CURTAINS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{ y: -6 }}
            className="group relative cursor-pointer overflow-hidden border border-gold/15 bg-luxury-sec p-6 sm:p-8 flex flex-col justify-between h-[450px] sm:h-[500px] transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(200,165,106,0.1)]"
            onClick={() => onSelectCategory('curtains')}
            id="curtains-overview-card"
          >
            {/* Background Zoom Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Curtains Collection"
                className="w-full h-full object-cover brightness-[0.35] group-hover:scale-105 group-hover:brightness-[0.45] transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Gold Border Glow Animation Effect */}
            <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-500" />

            {/* Top Label */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 bg-gold rounded-full" />
                <span className="font-sans text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">01 / COLLECTION</span>
              </div>
              <div className="text-white/40 group-hover:text-gold transition-colors">
                <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>

            {/* Bottom Content / Info */}
            <div className="relative z-10">
              <span className="font-serif text-[11px] tracking-[0.35em] text-gold uppercase mb-2 block">
                ✦ FABRICS & DRAPES
              </span>
              <h3 className="font-serif text-2xl font-light text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                CURTAINS
              </h3>
              
              {/* Animated Slide-up Bullet descriptions */}
              <ul className="space-y-2 text-xs text-muted-text font-light mb-6">
                <li className="flex items-center space-x-2">
                  <span className="h-1 w-1 bg-gold/50" />
                  <span>Soft textures.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1 w-1 bg-gold/50" />
                  <span>Elegant drapes.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1 w-1 bg-gold/50" />
                  <span>Timeless beauty.</span>
                </li>
              </ul>

              <span className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.25em] text-gold group-hover:text-white transition-colors">
                <span>EXPLORE CURTAINS</span>
                <span className="w-4 h-[1px] bg-gold group-hover:bg-white transition-colors" />
              </span>
            </div>
          </motion.div>

          {/* CARD 2: WALLPAPERS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{ y: -6 }}
            className="group relative cursor-pointer overflow-hidden border border-gold/15 bg-luxury-sec p-6 sm:p-8 flex flex-col justify-between h-[450px] sm:h-[500px] transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(200,165,106,0.1)]"
            onClick={() => onSelectCategory('wallpapers')}
            id="wallpapers-overview-card"
          >
            {/* Background Zoom Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Designer Wallpapers"
                className="w-full h-full object-cover brightness-[0.35] group-hover:scale-105 group-hover:brightness-[0.45] transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Gold Border Glow Animation Effect */}
            <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-500" />

            {/* Top Label */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 bg-gold rounded-full" />
                <span className="font-sans text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">02 / COLLECTION</span>
              </div>
              <div className="text-white/40 group-hover:text-gold transition-colors">
                <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>

            {/* Bottom Content / Info */}
            <div className="relative z-10">
              <span className="font-serif text-[11px] tracking-[0.35em] text-gold uppercase mb-2 block">
                ✦ WALLCOVERINGS
              </span>
              <h3 className="font-serif text-2xl font-light text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                WALLPAPERS
              </h3>
              
              {/* Animated Slide-up Bullet descriptions */}
              <ul className="space-y-2 text-xs text-muted-text font-light mb-6">
                <li className="flex items-center space-x-2">
                  <span className="h-1 w-1 bg-gold/50" />
                  <span>Artful patterns.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1 w-1 bg-gold/50" />
                  <span>Premium finishes.</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-1 w-1 bg-gold/50" />
                  <span>Infinite possibilities.</span>
                </li>
              </ul>

              <span className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.25em] text-gold group-hover:text-white transition-colors">
                <span>EXPLORE WALLPAPERS</span>
                <span className="w-4 h-[1px] bg-gold group-hover:bg-white transition-colors" />
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
