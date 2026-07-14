import { motion } from 'motion/react';
import { ArrowRight, Play, Award, Home, Star } from 'lucide-react';
import { useState } from 'react';

interface HeroProps {
  onExplore: () => void;
  openBookingModal: () => void;
}

export default function Hero({ onExplore, openBookingModal }: HeroProps) {
  const [showShowreel, setShowShowreel] = useState(false);

  return (
    <section className="relative overflow-hidden bg-luxury-bg py-12 lg:py-20 border-b border-white/5" id="hero-section">
      {/* Background Soft Grain & Glow Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,165,106,0.05),transparent_45%)] pointer-events-none" />
      <div className="absolute top-1/3 left-10 h-72 w-72 rounded-full bg-gold/3 opacity-10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* LEFT SIDE: DARK LUXURY PANEL (45% column span: 5/12) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 z-10">
            
            {/* Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-3"
            >
              <span className="h-[1px] w-8 bg-gold/50" />
              <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase">
                CRAFTED TO TRANSFORM
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="font-serif text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              BEYOND WALLS.
              <span className="block italic text-gold font-light mt-1">
                BEYOND ORDINARY.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-sans text-sm font-light leading-relaxed text-muted-text max-w-md"
            >
              Luxury curtains and bespoke designer wallpapers curated meticulously to transform your private villas and penthouses into timeless architectural masterpieces.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6"
            >
              {/* Primary button */}
              <button
                onClick={onExplore}
                className="group relative flex items-center space-x-3 overflow-hidden bg-gold px-8 py-4 text-xs font-bold tracking-[0.25em] text-luxury-bg uppercase transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_0_25px_rgba(200,165,106,0.3)]"
                id="hero-explore-btn"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Watch Showreel */}
              <button
                onClick={() => setShowShowreel(true)}
                className="group flex items-center space-x-3 border border-white/10 hover:border-gold px-6 py-4 text-xs font-bold tracking-[0.25em] text-white uppercase transition-all duration-300"
                id="hero-watch-btn"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-gold group-hover:bg-gold group-hover:text-luxury-bg transition-all duration-300">
                  <Play className="h-2.5 w-2.5 fill-current" />
                </span>
                <span>WATCH SHOWREEL</span>
              </button>
            </motion.div>

            {/* Floating stats card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.7 }}
              className="luxury-glass luxury-border-glow p-6 mt-4 grid grid-cols-3 gap-4"
              id="hero-stats-card"
            >
              <div className="text-center border-r border-gold/10">
                <div className="flex justify-center mb-1 text-gold">
                  <Home className="h-4 w-4" />
                </div>
                <div className="font-serif text-xl font-medium text-white">250+</div>
                <div className="font-sans text-[9px] tracking-wider text-muted-text uppercase mt-0.5">Homes</div>
              </div>

              <div className="text-center border-r border-gold/10">
                <div className="flex justify-center mb-1 text-gold">
                  <Award className="h-4 w-4" />
                </div>
                <div className="font-serif text-xl font-medium text-white">10+ Yrs</div>
                <div className="font-sans text-[9px] tracking-wider text-muted-text uppercase mt-0.5">Experience</div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-1 text-gold">
                  <Star className="h-4 w-4 fill-gold/25" />
                </div>
                <div className="font-serif text-xl font-medium text-white">98%</div>
                <div className="font-sans text-[9px] tracking-wider text-muted-text uppercase mt-0.5">Satisfaction</div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT SIDE: LARGE LUXURY ROOM IMAGE (55% column span: 7/12) */}
          <div className="lg:col-span-7 relative flex justify-center items-center h-[500px] lg:h-[650px] w-full select-none" id="hero-right-side">
            
            {/* Custom diagonal layout wrapper */}
            <div className="relative w-full h-full overflow-hidden luxury-border-glow">
              
              {/* Gold Border Guideline for Clip Path */}
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-gold/40 to-transparent p-[1.5px] z-10 pointer-events-none"
                style={{
                  clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)'
                }}
              />

              {/* The Image inside Diagonal Clip Path */}
              <motion.div
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
                style={{
                  clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80"
                  alt="Velora Luxury Curtain and Wallpaper Room Styling"
                  className="w-full h-full object-cover animate-subtle-zoom filter brightness-90 contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />

                {/* Soft overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                
                {/* Subtle Floating Particles Layer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-70">
                  <div className="absolute bottom-10 left-1/4 h-2 w-2 rounded-full bg-gold/40 blur-[1px] animate-pulse" />
                  <div className="absolute top-20 right-1/3 h-1.5 w-1.5 rounded-full bg-cream/30 blur-[1px] animate-bounce" style={{ animationDuration: '4s' }} />
                  <div className="absolute bottom-40 right-1/4 h-1 w-1 rounded-full bg-gold/50 animate-pulse" style={{ animationDuration: '3s' }} />
                </div>
              </motion.div>

              {/* Soft grain texture overlay */}
              <div 
                className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay bg-repeat z-20"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
                }}
              />
            </div>

            {/* Corner Decorative Brass Bracket */}
            <div className="absolute bottom-4 right-12 h-16 w-16 border-b border-r border-gold/40 pointer-events-none z-10" />
            <div className="absolute top-4 left-12 h-16 w-16 border-t border-l border-gold/40 pointer-events-none z-10" />
          </div>

        </div>
      </div>

      {/* SHOWREEL MODAL OVERLAY */}
      {showShowreel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl border border-gold/20 bg-luxury-bg shadow-[0_0_50px_rgba(200,165,106,0.15)]">
            <button
              onClick={() => setShowShowreel(false)}
              className="absolute -top-12 right-0 font-sans text-xs font-bold tracking-[0.2em] text-white hover:text-gold transition-colors"
            >
              CLOSE ✕
            </button>
            <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
                alt="Velora Luxury Collection Showreel Preview"
                className="w-full h-full object-cover brightness-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
                <span className="font-sans text-[10px] tracking-[0.3em] text-gold uppercase mb-2">CINEMATIC PREVIEW</span>
                <h3 className="font-serif text-2xl text-white mb-4 max-w-lg">Handcrafting Architectural Elegance Since 2016</h3>
                <p className="font-sans text-xs text-muted-text max-w-md leading-relaxed mb-6">
                  Our materials are ethically sourced from historic European mills. Hand-sewn, laser-measured, and styled by master design technicians.
                </p>
                <button
                  onClick={openBookingModal}
                  className="bg-gold hover:bg-gold-soft text-luxury-bg px-6 py-3 text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Schedule A Private Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
