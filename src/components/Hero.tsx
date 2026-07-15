import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Gem, Paintbrush, Hammer, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  openBookingModal: () => void;
}

export default function Hero({ onExplore, openBookingModal }: HeroProps) {
  const [showShowreel, setShowShowreel] = useState(false);

  // Bottom features data from the reference mockup
  const features = [
    {
      icon: Gem,
      title: 'PREMIUM QUALITY',
      desc: 'Finest materials for lasting beauty'
    },
    {
      icon: Paintbrush,
      title: 'BESPOKE DESIGNS',
      desc: 'Custom designs tailored to your taste'
    },
    {
      icon: Hammer,
      title: 'EXPERT INSTALLATION',
      desc: 'Professional installation with perfection'
    },
    {
      icon: ShieldCheck,
      title: 'SATISFACTION GUARANTEED',
      desc: 'Your satisfaction is our promise'
    }
  ];

  return (
    <section 
      className="relative min-h-screen w-full bg-luxury-bg text-white overflow-hidden flex flex-col justify-between pt-24 lg:pt-28 pb-10 border-b border-white/5" 
      id="hero-section"
    >
      {/* Background Image of the Luxury Living Room */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80"
          alt="Floating Drapes Luxury Chesterfield Living Room Styling"
          className="w-full h-full object-cover brightness-[0.45] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Soft, professional gradient overlays to replicate the high-end photographic lighting of the mockup */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/70 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-black/50 to-transparent pointer-events-none" />
        
        {/* Ambient warm light glow in the center */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gold/5 blur-[130px] pointer-events-none" />
      </div>

      {/* Spacing filler to push main content down on large screens */}
      <div className="hidden lg:block h-6" />

      {/* Main Center Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center my-auto py-12 lg:py-6">
        
        {/* Top Tagline with Gold Diamonds */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-2 mb-4"
        >
          <span className="font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.4em] text-gold uppercase">
            LUXURY CURTAINS & WALLPAPERS
          </span>
          {/* Ornate Gold Line Ornament */}
          <div className="flex items-center justify-center space-x-2 mt-1">
            <div className="h-[1px] w-8 bg-gold/40" />
            <span className="text-gold text-[8px] tracking-widest">✦ ✦ ✦</span>
            <div className="h-[1px] w-8 bg-gold/40" />
          </div>
        </motion.div>

        {/* Main Header exactly as depicted in the mockup */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="mb-6 max-w-4xl"
        >
          <h1 className="font-serif text-[32px] sm:text-5xl md:text-6xl lg:text-[68px] font-light leading-[1.1] text-white tracking-tight">
            Transform Your Space <br className="hidden sm:block" />
            Into A <span className="text-gold italic font-normal">Timeless Masterpiece</span>
          </h1>
        </motion.div>

        {/* Middle Diamond Ornament separator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center space-x-4 mb-6"
        >
          <div className="h-[1px] w-12 bg-gold/30" />
          <span className="text-gold text-xs">✦</span>
          <div className="h-[1px] w-12 bg-gold/30" />
        </motion.div>

        {/* Subtitle/Description with exact typography pairing */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-sans text-xs sm:text-[14px] md:text-[15px] font-light leading-relaxed text-[#ECE3D5] max-w-2xl mb-9"
        >
          Premium fabrics. Bespoke designs. Perfect elegance.<br />
          Crafted to reflect your style and elevate every corner of your space.
        </motion.p>

        {/* Dual CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Explore Collection (Solid Gold Button with Arrow) */}
          <button
            onClick={onExplore}
            className="group w-full sm:w-auto flex items-center justify-center space-x-2.5 bg-gold hover:bg-gold-soft text-luxury-bg px-8 py-4 text-[10.5px] font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(200,165,106,0.15)] active:scale-98"
            id="hero-explore-btn"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Book A Consultation (Bordered transparent button) */}
          <button
            onClick={openBookingModal}
            className="w-full sm:w-auto flex items-center justify-center border border-gold/40 hover:border-gold bg-black/30 backdrop-blur-sm text-gold hover:text-white px-8 py-4 text-[10.5px] font-bold tracking-[0.25em] uppercase transition-all duration-300 active:scale-98"
            id="hero-book-btn"
          >
            <span>BOOK A CONSULTATION</span>
          </button>
        </motion.div>

      </div>

      {/* Floating Bottom Feature Strip (glassmorphic aesthetic from the mockup, optimized responsive design) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.7 }}
          className="w-full bg-[#111111]/75 backdrop-blur-md border border-gold/15 p-5 sm:p-7 md:p-8 rounded-none"
          id="hero-features-strip"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 lg:divide-x lg:divide-gold/15">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 lg:px-6 ${index > 0 ? 'lg:pl-8' : 'lg:pl-2'}`}
                  id={`hero-feature-item-${index}`}
                >
                  {/* Circular Gold Icon frame exactly like mockup */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold group-hover:bg-gold/10 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  {/* Feature description */}
                  <div className="text-left space-y-1">
                    <h4 className="font-sans text-[11px] font-bold tracking-[0.18em] text-white uppercase">
                      {feat.title}
                    </h4>
                    <p className="font-sans text-[11px] font-light text-muted-text leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
