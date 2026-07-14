import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SIGNATURE_COLLECTIONS, SignatureCollection } from '../types';
import { ArrowRight, Sparkles, Check, Bookmark } from 'lucide-react';

interface SignatureProps {
  openBookingModal: () => void;
}

export default function SignatureCollections({ openBookingModal }: SignatureProps) {
  const [selectedCol, setSelectedCol] = useState<SignatureCollection | null>(null);

  // Map to apply visual overlays mentioned in prompt
  const overlayMap: Record<string, string> = {
    's1': 'bg-gradient-to-t from-red-950/90 via-red-950/40 to-black/30', // Luxe Drapes Burgundy Overlay
    's2': 'bg-gradient-to-t from-emerald-950/95 via-emerald-950/40 to-black/30', // Nature's Canvas Forest Green Overlay
    's3': 'bg-gradient-to-t from-stone-900/90 via-stone-800/40 to-black/30', // Modern Muse Warm Grey Overlay
    's4': 'bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-black/30', // Royal Texture Dark Navy Overlay
    's5': 'bg-gradient-to-t from-amber-950/80 via-amber-900/40 to-black/30', // Minimal Chic Cream/Warm Gold Overlay
  };

  const getOverlayClass = (id: string) => {
    return overlayMap[id] || 'bg-black/60';
  };

  return (
    <section className="bg-luxury-bg py-20 lg:py-28 border-b border-white/5" id="signature-collections-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase mb-2 block">
              HANDPICKED. CURATED. TIMELESS.
            </span>
            <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
              Signature Collections
            </h2>
            <div className="h-0.5 w-16 bg-gold mt-4" />
          </div>
          
          <button 
            onClick={openBookingModal}
            className="text-xs font-bold tracking-[0.2em] text-gold uppercase hover:text-white transition-colors duration-300 flex items-center space-x-2"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 5 Collections Grid/Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {SIGNATURE_COLLECTIONS.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedCol(col)}
              className="group relative cursor-pointer overflow-hidden border border-gold/15 bg-luxury-sec aspect-[3/4] sm:aspect-[2/3] lg:aspect-[9/16] flex flex-col justify-end p-6 transition-all duration-500 hover:border-gold/50"
              id={`signature-card-${col.id}`}
            >
              {/* Image with zoom on hover */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out brightness-75"
                  referrerPolicy="no-referrer"
                />
                
                {/* Specific overlay for color identity specified in the requirements */}
                <div className={`absolute inset-0 transition-opacity duration-500 opacity-90 group-hover:opacity-100 ${getOverlayClass(col.id)}`} />
              </div>

              {/* Decorative Number Tag (01, 02, etc.) */}
              <div className="absolute top-6 left-6 z-10 font-serif text-xs font-semibold tracking-wider text-gold opacity-80 group-hover:text-white group-hover:scale-110 transition-all">
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Category tag */}
              <div className="absolute top-6 right-6 z-10">
                <span className="bg-black/40 backdrop-blur-md border border-gold/15 text-[8px] font-bold tracking-[0.25em] text-cream uppercase px-2 py-1">
                  {col.category}
                </span>
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10">
                <h3 className="font-serif text-xl font-medium text-white group-hover:text-gold transition-colors duration-300">
                  {col.name}
                </h3>
                
                {/* Short teaser */}
                <p className="font-sans text-[11px] font-light text-muted-text mt-2 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {col.description}
                </p>

                {/* Explore button inside card */}
                <div className="mt-4 flex items-center space-x-2 pt-2 border-t border-gold/10 overflow-hidden">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase">EXPLORE NOW</span>
                  <ArrowRight className="h-3 w-3 text-gold transform translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-300" />
                </div>
              </div>

              {/* Inner gold border highlighting glow */}
              <div className="absolute inset-2 border border-gold/0 group-hover:border-gold/25 pointer-events-none transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* QUICK EXPAND OVERLAY MODAL */}
      <AnimatePresence>
        {selectedCol && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedCol(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative w-full max-w-2xl border border-gold/20 bg-luxury-sec p-6 sm:p-10 text-white overflow-hidden shadow-[0_0_50px_rgba(200,165,106,0.2)]"
              onClick={(e) => e.stopPropagation()}
              id="signature-expanded-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCol(null)}
                className="absolute top-6 right-6 font-sans text-xs tracking-widest text-muted-text hover:text-gold uppercase"
              >
                CLOSE ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden border border-gold/15">
                  <img
                    src={selectedCol.image}
                    alt={selectedCol.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 ${getOverlayClass(selectedCol.id)} opacity-60`} />
                </div>

                {/* Right text contents */}
                <div className="flex flex-col space-y-4">
                  <div className="inline-flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-gold uppercase">{selectedCol.category} / EXCLUSIVE</span>
                  </div>
                  
                  <h3 className="font-serif text-3xl font-normal text-white">
                    {selectedCol.name}
                  </h3>
                  
                  <p className="font-sans text-xs font-light leading-relaxed text-muted-text">
                    {selectedCol.description}
                  </p>

                  <div className="space-y-2 py-4 border-t border-b border-gold/10">
                    <span className="font-serif text-xs italic text-gold block">Bespoke Specifications:</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/5 border border-white/10 text-[9px] px-2 py-1 text-cream uppercase tracking-wider">Premium Lining</span>
                      <span className="bg-white/5 border border-white/10 text-[9px] px-2 py-1 text-cream uppercase tracking-wider">Sound Shielding</span>
                      <span className="bg-white/5 border border-white/10 text-[9px] px-2 py-1 text-cream uppercase tracking-wider">Gold Rod Fittings</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCol(null);
                      openBookingModal();
                    }}
                    className="w-full bg-gold hover:bg-gold-soft text-luxury-bg py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                  >
                    BOOK TRIAL & CONSULTATION
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
