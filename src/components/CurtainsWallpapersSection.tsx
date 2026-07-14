import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface SectionProps {
  onSelectCategory: (category: 'curtains' | 'wallpapers') => void;
}

export default function CurtainsWallpapersSection({ onSelectCategory }: SectionProps) {
  return (
    <section className="bg-[#EAE5D9] py-20 lg:py-28 border-b border-gold/15 text-zinc-900" id="categories-overview-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT SIDE COLUMN: Title and Description (Spans 4 columns on desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full py-2">
            <div>
              <span className="font-sans text-[10px] font-bold tracking-[0.45em] text-gold-soft uppercase mb-3 block">
                CURATED TO PERFECTION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.1] text-zinc-950">
                Curtains &<br />
                Wallpapers<br />
                That <span className="italic text-gold-soft">Define You.</span>
              </h2>
              
              {/* Gold line with a dot */}
              <div className="flex items-center space-x-2 mt-6 mb-8">
                <div className="h-[2px] w-14 bg-gold-soft" />
                <div className="h-1.5 w-1.5 rounded-full bg-gold-soft" />
              </div>
            </div>
            
            <p className="font-sans text-xs sm:text-[13px] font-light leading-relaxed text-zinc-700 max-w-sm">
              Every room has a unique voice. We provide the vocabulary through heavy drapery, whisper-soft sheers, and hand-gilded fine wallpapers tailored to your architectural style.
            </p>
          </div>

          {/* RIGHT SIDE COLUMN: Dual side-by-side cards (Spans 8 columns on desktop) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            
            {/* CARD 1: CURTAINS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8 }}
              onClick={() => onSelectCategory('curtains')}
              className="group cursor-pointer overflow-hidden bg-[#111111] border border-gold/15 flex flex-col justify-between min-h-[460px] transition-all duration-500 hover:border-gold hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
              id="curtains-overview-card"
            >
              {/* Image Side (Top half of vertical card) */}
              <div className="relative h-[220px] w-full overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
                  alt="Luxury Curtains Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.8]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 text-[9px] font-bold tracking-widest text-gold bg-black/60 px-2 py-1 border border-gold/15 uppercase">
                  01 COLLECTION
                </div>
              </div>

              {/* Content Side (Bottom half of vertical card) */}
              <div className="p-7 sm:p-8 flex flex-col justify-between flex-grow text-white">
                <div className="space-y-4">
                  {/* Gold Crest + Tag */}
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-gold/40 text-gold bg-black/40">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
                      </svg>
                    </div>
                    <span className="font-sans text-[8.5px] font-bold tracking-[0.3em] text-gold uppercase">CURTAINS</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-normal tracking-wide text-white group-hover:text-gold transition-colors">
                      Fitted Luxury Drapery
                    </h3>
                    
                    {/* Styled Bullets */}
                    <ul className="space-y-1.5 pt-1 text-left">
                      <li className="flex items-center space-x-2.5 text-xs font-light text-muted-text">
                        <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" />
                        <span>Soft textures & Belgium Linen</span>
                      </li>
                      <li className="flex items-center space-x-2.5 text-xs font-light text-muted-text">
                        <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" />
                        <span>Elegant drapes & acoustic velvet</span>
                      </li>
                      <li className="flex items-center space-x-2.5 text-xs font-light text-muted-text">
                        <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" />
                        <span>Timeless beauty & whisper sheers</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action link */}
                <div className="pt-5 border-t border-white/5 mt-4 text-left">
                  <span className="inline-flex items-center space-x-2.5 text-[9.5px] font-bold tracking-[0.25em] text-gold group-hover:text-white transition-colors">
                    <span>EXPLORE CURTAINS</span>
                    <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold/10 group-hover:bg-white/10 transition-colors">
                      <ArrowRight className="h-2.5 w-2.5" />
                    </div>
                  </span>
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
              className="group cursor-pointer overflow-hidden bg-[#111111] border border-gold/15 flex flex-col justify-between min-h-[460px] transition-all duration-500 hover:border-gold hover:shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
              id="wallpapers-overview-card"
            >
              {/* Image Side (Top half of vertical card) */}
              <div className="relative h-[220px] w-full overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80"
                  alt="Luxury Designer Wallpapers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.8]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 text-[9px] font-bold tracking-widest text-gold bg-black/60 px-2 py-1 border border-gold/15 uppercase">
                  02 COLLECTION
                </div>
              </div>

              {/* Content Side (Bottom half of vertical card) */}
              <div className="p-7 sm:p-8 flex flex-col justify-between flex-grow text-white">
                <div className="space-y-4">
                  {/* Gold Crest + Tag */}
                  <div className="flex items-center space-x-2.5">
                    <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-gold/40 text-gold bg-black/40">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
                      </svg>
                    </div>
                    <span className="font-sans text-[8.5px] font-bold tracking-[0.3em] text-gold uppercase">WALLPAPERS</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-normal tracking-wide text-white group-hover:text-gold transition-colors">
                      Designer Wallcoverings
                    </h3>
                    
                    {/* Styled Bullets */}
                    <ul className="space-y-1.5 pt-1 text-left">
                      <li className="flex items-center space-x-2.5 text-xs font-light text-muted-text">
                        <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" />
                        <span>Artful patterns & hand-painted silk</span>
                      </li>
                      <li className="flex items-center space-x-2.5 text-xs font-light text-muted-text">
                        <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" />
                        <span>Premium finishes & gilded foil prints</span>
                      </li>
                      <li className="flex items-center space-x-2.5 text-xs font-light text-muted-text">
                        <span className="h-1 w-1 rounded-full bg-gold/60 shrink-0" />
                        <span>Infinite possibilities & slate textures</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action link */}
                <div className="pt-5 border-t border-white/5 mt-4 text-left">
                  <span className="inline-flex items-center space-x-2.5 text-[9.5px] font-bold tracking-[0.25em] text-gold group-hover:text-white transition-colors">
                    <span>EXPLORE WALLPAPERS</span>
                    <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold/10 group-hover:bg-white/10 transition-colors">
                      <ArrowRight className="h-2.5 w-2.5" />
                    </div>
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
