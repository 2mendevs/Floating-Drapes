import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface SectionProps {
  onSelectCategory: (category: 'curtains' | 'wallpapers') => void;
}

export default function CurtainsWallpapersSection({ onSelectCategory }: SectionProps) {
  return (
    <section className="bg-[#EAE5D9] py-20 lg:py-28 border-b border-gold/15 text-zinc-900" id="categories-overview-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Dual Layout: Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-16">
          <div className="lg:col-span-6 flex flex-col">
            <span className="font-sans text-[10px] font-bold tracking-[0.45em] text-gold-soft uppercase mb-3 block">
              CURATED TO PERFECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4.5xl font-normal leading-tight text-zinc-950 max-w-md">
              Curtains & Wallpapers That <span className="italic text-gold-soft">Define You.</span>
            </h2>
            <div className="h-[2px] w-14 bg-gold-soft mt-6" />
          </div>
          
          <div className="lg:col-span-6">
            <p className="font-sans text-xs sm:text-[13px] font-light leading-relaxed text-zinc-700 max-w-lg">
              Every room has a unique voice. We provide the vocabulary through heavy drapery, whisper-soft sheers, and hand-gilded fine wallpapers tailored to your architectural style.
            </p>
          </div>
        </div>

        {/* Horizontal Splitted Dual Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* CARD 1: CURTAINS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            onClick={() => onSelectCategory('curtains')}
            className="group cursor-pointer overflow-hidden bg-[#111111] border border-gold/15 min-h-[380px] sm:h-[420px] grid grid-cols-1 sm:grid-cols-12 transition-all duration-500 hover:border-gold/45 hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
            id="curtains-overview-card"
          >
            {/* Left Content Side (7/12 width) */}
            <div className="sm:col-span-7 p-7 sm:p-9 flex flex-col justify-between z-10 text-white">
              <div className="space-y-6">
                {/* Gold Crest + Tag */}
                <div className="flex items-center space-x-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 text-gold bg-black/40">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
                    </svg>
                  </div>
                  <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-gold uppercase">CURTAINS</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-normal tracking-wide text-white group-hover:text-gold transition-colors">
                    Fitted Luxury Drapery
                  </h3>
                  
                  {/* Styled Bullets */}
                  <ul className="space-y-2.5 pt-2">
                    <li className="flex items-center space-x-3 text-xs font-light text-muted-text">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/50 shrink-0" />
                      <span>Soft textures & Belgium Linen.</span>
                    </li>
                    <li className="flex items-center space-x-3 text-xs font-light text-muted-text">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/50 shrink-0" />
                      <span>Elegant drapes & acoustic velvet.</span>
                    </li>
                    <li className="flex items-center space-x-3 text-xs font-light text-muted-text">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/50 shrink-0" />
                      <span>Timeless beauty & whisper sheers.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action link */}
              <div className="pt-6 sm:pt-0">
                <span className="inline-flex items-center space-x-3.5 text-[10px] font-bold tracking-[0.25em] text-gold group-hover:text-white transition-colors">
                  <span>EXPLORE CURTAINS</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 group-hover:bg-white/10 transition-colors">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </span>
              </div>
            </div>

            {/* Right Image Side (5/12 width) */}
            <div className="sm:col-span-5 relative h-[220px] sm:h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80"
                alt="Luxury Curtains Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.8]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-l from-black/80 sm:from-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 text-[9px] font-bold tracking-widest text-gold bg-black/60 px-2 py-1 border border-gold/15 uppercase">
                01 COLLECTION
              </div>
            </div>
          </motion.div>

          {/* CARD 2: WALLPAPERS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            onClick={() => onSelectCategory('wallpapers')}
            className="group cursor-pointer overflow-hidden bg-[#111111] border border-gold/15 min-h-[380px] sm:h-[420px] grid grid-cols-1 sm:grid-cols-12 transition-all duration-500 hover:border-gold/45 hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
            id="wallpapers-overview-card"
          >
            {/* Left Content Side (7/12 width) */}
            <div className="sm:col-span-7 p-7 sm:p-9 flex flex-col justify-between z-10 text-white">
              <div className="space-y-6">
                {/* Gold Crest + Tag */}
                <div className="flex items-center space-x-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 text-gold bg-black/40">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
                    </svg>
                  </div>
                  <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-gold uppercase">WALLPAPERS</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-normal tracking-wide text-white group-hover:text-gold transition-colors">
                    Designer Wallcoverings
                  </h3>
                  
                  {/* Styled Bullets */}
                  <ul className="space-y-2.5 pt-2">
                    <li className="flex items-center space-x-3 text-xs font-light text-muted-text">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/50 shrink-0" />
                      <span>Artful patterns & hand-painted silk.</span>
                    </li>
                    <li className="flex items-center space-x-3 text-xs font-light text-muted-text">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/50 shrink-0" />
                      <span>Premium finishes & gilded foil geometric.</span>
                    </li>
                    <li className="flex items-center space-x-3 text-xs font-light text-muted-text">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/50 shrink-0" />
                      <span>Infinite possibilities & slate textures.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action link */}
              <div className="pt-6 sm:pt-0">
                <span className="inline-flex items-center space-x-3.5 text-[10px] font-bold tracking-[0.25em] text-gold group-hover:text-white transition-colors">
                  <span>EXPLORE WALLPAPERS</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 group-hover:bg-white/10 transition-colors">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </span>
              </div>
            </div>

            {/* Right Image Side (5/12 width) */}
            <div className="sm:col-span-5 relative h-[220px] sm:h-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
                alt="Luxury Designer Wallpapers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.8]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-l from-black/80 sm:from-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 text-[9px] font-bold tracking-widest text-gold bg-black/60 px-2 py-1 border border-gold/15 uppercase">
                02 COLLECTION
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
