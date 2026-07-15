import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Award, Shield, Heart } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  openBookingModal: () => void;
}

export default function Hero({ onExplore, openBookingModal }: HeroProps) {
  const [showShowreel, setShowShowreel] = useState(false);

  // Stats data
  const stats = [
    {
      id: 'homes',
      value: '250+',
      label: 'Happy Homes',
      icon: Shield,
    },
    {
      id: 'exp',
      value: '10+',
      label: 'Years Experience',
      icon: Award,
    },
    {
      id: 'sat',
      value: '98%',
      label: 'Satisfaction Rate',
      icon: Heart,
    }
  ];

  return (
    <section className="relative min-h-screen lg:h-screen lg:min-h-[820px] bg-luxury-bg text-white overflow-hidden border-b border-white/5" id="hero-section">
      
      {/* Background Soft Glow Elements (Only on desktop to save mobile layout memory and clean performance) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden lg:block">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
      </div>

      {/* ========================================================================= */}
      {/* MOBILE HERO VIEW (lg:hidden) - Redesigned fully to overlay caption on image */}
      {/* ========================================================================= */}
      <div className="lg:hidden relative w-full min-h-[100dvh] flex flex-col justify-between pt-28 pb-12 px-6 sm:px-10 overflow-hidden text-center" id="hero-mobile-layout">
        
        {/* Absolute Background Image under the text overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&w=1200&q=80"
            alt="Floating Drapes Luxury Curtain and Wallpaper Room Styling"
            className="w-full h-full object-cover brightness-[0.55] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Custom vignette gradients for high text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80 pointer-events-none" />
          
          {/* Subtle warm center glow overlay */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-gold/10 blur-[85px] pointer-events-none" />
        </div>

        {/* Top brand accent */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center mt-2"
        >
          <span className="font-sans text-[9px] font-bold tracking-[0.5em] text-gold uppercase bg-black/40 backdrop-blur-md px-4 py-2 border border-gold/15">
            FLOATING DRAPES
          </span>
        </motion.div>

        {/* Main interactive center block with split title caption */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-7 max-w-md mx-auto w-full">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col space-y-2"
          >
            {/* Split Title Caption */}
            <h1 className="font-serif text-[34px] sm:text-[42px] font-light leading-none tracking-tight text-white uppercase">
              BEYOND WALLS.
            </h1>
            <div className="flex items-baseline justify-center gap-2.5">
              <h1 
                className="font-serif text-[34px] sm:text-[42px] font-bold leading-none tracking-wide text-transparent uppercase"
                style={{ WebkitTextStroke: '1px #C8A56A' }}
              >
                BEYOND
              </h1>
              <h1 className="font-serif text-[34px] sm:text-[42px] font-light italic leading-none tracking-tight text-gold uppercase">
                ORDINARY.
              </h1>
            </div>
          </motion.div>

          {/* Ornamental Divider Accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center space-x-3.5"
          >
            <div className="h-[1px] w-10 bg-gold/30" />
            <span className="text-gold text-sm select-none">✦</span>
            <div className="h-[1px] w-10 bg-gold/30" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-sans text-[12.5px] font-light leading-relaxed text-[#E5DCD0]"
          >
            Luxury curtains and designer wallpapers curated to turn your space into a masterpiece.
          </motion.p>

          {/* CTAs Stacked beautifully for mobile interaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="flex flex-col w-full gap-3 pt-2"
          >
            <button
              onClick={onExplore}
              className="group flex items-center justify-center space-x-3 bg-gold text-luxury-bg py-4 px-6 text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 hover:bg-gold-soft active:scale-98 shadow-[0_4px_20px_rgba(200,165,106,0.2)]"
              id="hero-mobile-explore-btn"
            >
              <span>EXPLORE COLLECTIONS</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setShowShowreel(true)}
              className="group flex items-center justify-center space-x-3 border border-white/20 bg-black/45 backdrop-blur-md text-white py-4 px-6 text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 hover:border-gold active:scale-98"
              id="hero-mobile-watch-btn"
            >
              <span>WATCH SHOWREEL</span>
              <Play className="h-2.5 w-2.5 fill-current text-gold" />
            </button>
          </motion.div>

        </div>

        {/* Refined Luxury Stats Bar Overlay at the Bottom of Mobile Screen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="relative z-10 w-full max-w-md mx-auto mt-6 bg-black/55 backdrop-blur-md border border-gold/15 p-4"
          id="hero-mobile-stats-row"
        >
          <div className="grid grid-cols-3 gap-3 divide-x divide-gold/20">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center">
                <span className="font-serif text-base sm:text-lg font-normal text-gold leading-none">
                  {stat.value}
                </span>
                <span className="font-sans text-[7.5px] tracking-widest text-[#E5DCD0] uppercase mt-1.5 font-bold">
                  {stat.label.split(' ')[0]} {stat.label.split(' ')[1] ? stat.label.split(' ')[1] : ''}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Luxury Gold Corner Ornaments */}
        <div className="absolute bottom-3 right-3 h-8 w-8 border-b border-r border-gold/30 pointer-events-none" />
        <div className="absolute top-3 left-3 h-8 w-8 border-t border-l border-gold/30 pointer-events-none" />
        
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP HERO VIEW (hidden lg:flex) - Preserved original highly curated split layout */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex h-full w-full flex-row items-stretch pt-24" id="hero-desktop-layout">
        
        {/* LEFT CONTENT CONTAINER (60% Width on large screens) */}
        <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center z-10 relative bg-[#0A0A0A] pl-16 pr-12">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-12 xl:gap-14 items-stretch justify-center w-full">
            
            {/* COLUMN 1: VERTICAL STATS SIDEBAR (Far-left on md+) */}
            <div className="w-full md:w-[220px] shrink-0 flex flex-col justify-center space-y-4 md:space-y-5 border-r border-gold/10 md:pr-6 lg:pr-8">
              {stats.map((stat, idx) => {
                const IconComp = stat.icon;
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.15, ease: 'easeOut' }}
                    className="flex items-center space-x-4 p-4 bg-[#111111]/80 border border-gold/15 hover:border-gold/35 transition-all duration-300 backdrop-blur-md"
                    id={`hero-stat-card-${stat.id}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold">
                      <IconComp className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-normal leading-none text-white">{stat.value}</h3>
                      <p className="font-sans text-[9px] tracking-widest text-gold uppercase mt-1 font-bold">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Overlapping Client Avatars Row */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="flex items-center space-x-3.5 p-4 bg-[#111111]/80 border border-gold/15 backdrop-blur-md"
                id="hero-avatars-card"
              >
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-luxury-bg object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                    alt="Client avatar"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-luxury-bg object-cover"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
                    alt="Client avatar"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-luxury-bg object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Client avatar"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-luxury-bg">
                    +
                  </div>
                  <span className="font-sans text-[8.5px] font-bold tracking-[0.15em] text-gold uppercase">
                    VILLA OWNERS
                  </span>
                </div>
              </motion.div>
            </div>

            {/* COLUMN 2: CENTER HEADING & TEXT */}
            <div className="flex-grow flex flex-col justify-center space-y-7 text-left max-w-xl">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center space-x-3.5"
              >
                <span className="h-[1px] w-7 bg-gold" />
                <span className="font-sans text-[10px] font-bold tracking-[0.45em] text-gold uppercase">
                  CRAFTED TO TRANSFORM
                </span>
              </motion.div>

              {/* Split Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15 }}
                className="flex flex-col space-y-1"
              >
                <h1 className="font-serif text-[42px] sm:text-[50px] lg:text-[58px] xl:text-[64px] font-light leading-[1.05] tracking-tight text-white uppercase">
                  BEYOND WALLS.
                </h1>
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <h1 
                    className="font-serif text-[42px] sm:text-[50px] lg:text-[58px] xl:text-[64px] font-bold leading-[1.05] tracking-wide text-transparent uppercase"
                    style={{ WebkitTextStroke: '1.5px #C8A56A' }}
                  >
                    BEYOND
                  </h1>
                  <h1 className="font-serif text-[42px] sm:text-[50px] lg:text-[58px] xl:text-[64px] font-light italic leading-[1.05] tracking-tight text-gold uppercase">
                    ORDINARY.
                  </h1>
                </div>
              </motion.div>

              {/* Fine Gold Ornament Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="flex items-center space-x-4 w-full origin-left"
              >
                <div className="h-[1px] w-12 bg-gold/45" />
                <div className="text-gold flex items-center justify-center">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2C12 2 9 7 9 12C9 17 12 22 12 22C12 22 15 17 15 12C15 7 12 2 12 2Z" />
                  </svg>
                </div>
                <div className="h-[1px] w-24 bg-gold/45" />
              </motion.div>

              {/* Descriptive Content */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="font-sans text-xs sm:text-[13.5px] font-light leading-relaxed text-muted-text max-w-md"
              >
                Luxury curtains and designer wallpapers curated to turn your space into a masterpiece.
              </motion.p>

              {/* CTA action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.55 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <button
                  onClick={onExplore}
                  className="group relative flex items-center space-x-3.5 bg-gold px-7 py-4 text-[10px] font-bold tracking-[0.25em] text-luxury-bg uppercase transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_0_30px_rgba(200,165,106,0.35)]"
                  id="hero-explore-btn"
                >
                  <span>EXPLORE COLLECTIONS</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>

                <button
                  onClick={() => setShowShowreel(true)}
                  className="group flex items-center space-x-3.5 border border-white/10 hover:border-gold px-6.5 py-4 text-[10px] font-bold tracking-[0.25em] text-white uppercase transition-all duration-300"
                  id="hero-watch-btn"
                >
                  <span>WATCH SHOWREEL</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-gold group-hover:bg-gold group-hover:text-luxury-bg transition-all duration-300">
                    <Play className="h-2.5 w-2.5 fill-current" />
                  </div>
                </button>
              </motion.div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE VIEWPORT IMAGE (40% Width on large screens, touches screen edge) */}
        <div className="w-full lg:w-[42%] xl:w-[40%] relative lg:h-full overflow-hidden" id="hero-right-side">
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            <img
              src="https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&w=1200&q=80"
              alt="Floating Drapes Luxury Curtain and Wallpaper Room Styling"
              className="w-full h-full object-cover animate-subtle-zoom brightness-[0.85] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />

            {/* Gold Guideline Overlay Lines */}
            <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-gold/15 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-4 w-[1px] bg-gold/15 pointer-events-none" />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
            
            {/* Bottom tag block inside the image */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end">
              <div className="flex flex-col text-left">
                <span className="font-serif text-sm text-white">The Indiranagar Villa</span>
                <span className="font-sans text-[8px] tracking-widest text-gold uppercase mt-1">Calibrated Drapery Fit</span>
              </div>
              <div className="h-8 w-8 flex items-center justify-center rounded-full border border-gold/30 bg-black/40 text-gold backdrop-blur-md text-[10px]">
                ✦
              </div>
            </div>
          </motion.div>

          {/* Corner Ornamental Accents */}
          <div className="absolute bottom-2 right-2 h-14 w-14 border-b border-r border-gold/40 pointer-events-none" />
          <div className="absolute top-2 left-2 h-14 w-14 border-t border-l border-gold/40 pointer-events-none" />
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
                alt="Floating Drapes Luxury Collection Showreel Preview"
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
                  onClick={() => {
                    setShowShowreel(false);
                    openBookingModal();
                  }}
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
