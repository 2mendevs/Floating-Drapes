import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CurtainsWallpapersSection from './components/CurtainsWallpapersSection';
import SignatureCollections from './components/SignatureCollections';
import PortfolioSection from './components/PortfolioSection';
import ProcessSection from './components/ProcessSection';
import PremiumFeaturesStrip from './components/PremiumFeaturesStrip';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ContactForm from './components/ContactForm';
import WhatsAppButton from './components/WhatsAppButton';

import { 
  CURTAINS_DATA, 
  WALLPAPERS_DATA, 
  SIGNATURE_COLLECTIONS, 
  CurtainItem, 
  WallpaperItem 
} from './types';

import { 
  Sparkles, 
  Layers, 
  Clock, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sliders, 
  HelpCircle,
  Gem,
  Wind
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCurtainFilter, setSelectedCurtainFilter] = useState<string>('All');
  const [selectedWallpaperFilter, setSelectedWallpaperFilter] = useState<string>('All');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  const openWhatsAppDirect = () => {
    const encodedText = encodeURIComponent("Hi, I'm interested in your luxury curtain and wallpaper services.");
    window.open(`https://wa.me/919876543210?text=${encodedText}`, '_blank');
  };

  // Curtains Page filtered datasets
  const filteredCurtains = selectedCurtainFilter === 'All'
    ? CURTAINS_DATA
    : CURTAINS_DATA.filter(item => item.priceClass === selectedCurtainFilter);

  // Wallpapers Page filtered datasets
  const filteredWallpapers = selectedWallpaperFilter === 'All'
    ? WALLPAPERS_DATA
    : WALLPAPERS_DATA.filter(item => item.style === selectedWallpaperFilter);

  return (
    <div className="min-h-screen bg-luxury-bg text-white selection:bg-gold/30 flex flex-col justify-between" id="floatingdrapes-main-container">
      
      {/* GLOBAL HEADER */}
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage} 
        openBookingModal={() => setBookingModalOpen(true)} 
      />

      {/* RENDER PAGES BASED ON STATE */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* 1. HOME PAGE */}
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero 
                onExplore={() => setActivePage('signature')} 
                openBookingModal={() => setBookingModalOpen(true)} 
              />
              <CurtainsWallpapersSection 
                onSelectCategory={(cat) => {
                  if (cat === 'curtains') setActivePage('curtains');
                  if (cat === 'wallpapers') setActivePage('wallpapers');
                }} 
              />
              <SignatureCollections openBookingModal={() => setBookingModalOpen(true)} />
              <PortfolioSection />
              <ProcessSection />
              <PremiumFeaturesStrip />
              <Testimonials />
              <CTASection 
                openBookingModal={() => setBookingModalOpen(true)} 
                openWhatsApp={openWhatsAppDirect} 
              />
            </motion.div>
          )}

          {/* 2. CURTAINS COLLECTION PAGE */}
          {activePage === 'curtains' && (
            <motion.div
              key="curtains"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-12 lg:py-20 bg-luxury-bg"
              id="curtains-page"
            >
              <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                
                {/* Intro Heading */}
                <div className="text-center mb-16">
                  <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase mb-2 block">✦ ELITE DRAPERIES ✦</span>
                  <h1 className="font-serif text-4xl sm:text-5xl font-light text-white">
                    The Curtains <span className="italic text-gold">Collection</span>
                  </h1>
                  <p className="font-sans text-xs font-light text-muted-text max-w-xl mx-auto mt-4 leading-relaxed">
                    Sourced from historic silk weavers in northern Italy and heavier velvet mills in Belgium. Laser-fit with sub-millimeter tolerances.
                  </p>
                  <div className="mx-auto h-0.5 w-16 bg-gold mt-6" />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
                  {['All', 'Premium', 'Signature', 'Reserve'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedCurtainFilter(tier)}
                      className={`px-6 py-2.5 text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-none ${
                        selectedCurtainFilter === tier
                          ? 'bg-gold text-luxury-bg shadow-[0_0_15px_rgba(200,165,106,0.2)]'
                          : 'border border-white/10 text-muted-text hover:border-gold/30 hover:text-white'
                      }`}
                    >
                      {tier} {tier !== 'All' ? 'Tier' : ''}
                    </button>
                  ))}
                </div>

                {/* Grid Displays */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" id="curtains-grid">
                  {filteredCurtains.map((item: CurtainItem) => (
                    <div 
                      key={item.id} 
                      className="group border border-gold/15 bg-luxury-sec flex flex-col md:flex-row overflow-hidden transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(200,165,106,0.1)]"
                      id={`curtain-item-${item.id}`}
                    >
                      {/* Product Image */}
                      <div className="md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-gold/20 text-[9px] font-bold tracking-[0.2em] text-gold px-3 py-1 uppercase">
                          {item.priceClass}
                        </span>
                      </div>

                      {/* Details Content */}
                      <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase mb-1 block">✦ BESPOKE WEAVE</span>
                          <h3 className="font-serif text-xl font-normal text-white">{item.name}</h3>
                          <p className="font-sans text-xs font-light text-muted-text mt-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* List of Materials */}
                        <div className="mt-6 pt-4 border-t border-gold/10">
                          <span className="text-[9px] font-bold tracking-widest text-gold uppercase block mb-2">Composed Of:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.materials.map((mat, i) => (
                              <span key={i} className="bg-white/5 border border-white/10 text-[9px] px-2 py-1 text-cream uppercase">
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action request */}
                        <div className="mt-8 pt-4 flex items-center justify-between">
                          <button
                            onClick={() => setBookingModalOpen(true)}
                            className="text-[10px] font-bold tracking-[0.2em] text-gold group-hover:text-white transition-colors uppercase flex items-center space-x-1"
                          >
                            <span>REQUEST TRIAL</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          <span className="text-[9px] text-muted-text italic">Calibrated Installation Incl.</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Styling Strip */}
                <div className="mt-20 border border-gold/20 bg-white/[0.02] p-8 sm:p-12 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-gold/5 blur-3xl pointer-events-none" />
                  <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-gold uppercase block mb-3">CUSTOM MOTORIZATION</span>
                  <h3 className="font-serif text-2xl text-white mb-4">Whisper-Quiet Lutron Automation</h3>
                  <p className="font-sans text-xs text-muted-text max-w-xl mx-auto leading-relaxed mb-6">
                    Our master installers seamlessly integrate hidden motorized rails that interface with Apple HomeKit, Control4, Crestron, and manual brass controls.
                  </p>
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="bg-gold hover:bg-gold-soft text-luxury-bg px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors inline-block"
                  >
                    INQUIRE ABOUT MOTORIZATION
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* 3. WALLPAPERS COLLECTION PAGE */}
          {activePage === 'wallpapers' && (
            <motion.div
              key="wallpapers"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-12 lg:py-20 bg-luxury-bg"
              id="wallpapers-page"
            >
              <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                
                {/* Intro Heading */}
                <div className="text-center mb-16">
                  <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase mb-2 block">✦ GILDED WALLCOVERINGS ✦</span>
                  <h1 className="font-serif text-4xl sm:text-5xl font-light text-white">
                    Designer <span className="italic text-gold">Wallpapers</span>
                  </h1>
                  <p className="font-sans text-xs font-light text-muted-text max-w-xl mx-auto mt-4 leading-relaxed">
                    Intricate hand-painted silk murals, real brass-leaf geometry prints, and heavy flocked textured designs to create breathtaking visual feature walls.
                  </p>
                  <div className="mx-auto h-0.5 w-16 bg-gold mt-6" />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
                  {['All', 'Classic', 'Modern', 'Botanical', 'Textured'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedWallpaperFilter(style)}
                      className={`px-6 py-2.5 text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-none ${
                        selectedWallpaperFilter === style
                          ? 'bg-gold text-luxury-bg shadow-[0_0_15px_rgba(200,165,106,0.2)]'
                          : 'border border-white/10 text-muted-text hover:border-gold/30 hover:text-white'
                      }`}
                    >
                      {style} Style
                    </button>
                  ))}
                </div>

                {/* Grid Displays */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12" id="wallpapers-grid">
                  {filteredWallpapers.map((item: WallpaperItem) => (
                    <div 
                      key={item.id} 
                      className="group border border-gold/15 bg-luxury-sec flex flex-col md:flex-row overflow-hidden transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(200,165,106,0.1)]"
                      id={`wallpaper-item-${item.id}`}
                    >
                      {/* Product Image */}
                      <div className="md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-gold/20 text-[9px] font-bold tracking-[0.2em] text-gold px-3 py-1 uppercase">
                          {item.style}
                        </span>
                      </div>

                      {/* Details Content */}
                      <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase mb-1 block">✦ FINE FINISH</span>
                          <h3 className="font-serif text-xl font-normal text-white">{item.name}</h3>
                          <p className="font-sans text-xs font-light text-muted-text mt-3 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* List of Materials */}
                        <div className="mt-6 pt-4 border-t border-gold/10">
                          <span className="text-[9px] font-bold tracking-widest text-gold uppercase block mb-2">Composed Of:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.materials.map((mat, i) => (
                              <span key={i} className="bg-white/5 border border-white/10 text-[9px] px-2 py-1 text-cream uppercase">
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action request */}
                        <div className="mt-8 pt-4 flex items-center justify-between">
                          <button
                            onClick={() => setBookingModalOpen(true)}
                            className="text-[10px] font-bold tracking-[0.2em] text-gold group-hover:text-white transition-colors uppercase flex items-center space-x-1"
                          >
                            <span>ORDER SWATCH</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                          <span className="text-[9px] text-muted-text italic">Seamless Aligned Fit</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Installation Promise block */}
                <div className="mt-20 bg-luxury-sec border border-gold/15 p-8 sm:p-12 relative">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2">
                      <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-gold uppercase block mb-2">SURGICAL APPLICATION</span>
                      <h3 className="font-serif text-2xl text-white mb-4">Flawless Pattern Alignment</h3>
                      <p className="font-sans text-xs text-muted-text leading-relaxed">
                        Fine wallpaper is an investment. Our in-house artisans prepare wall substrates dynamically, utilize moisture-neutral sizing adhesives, and align geometric patterns down to fractions of a millimeter so that joins are completely invisible.
                      </p>
                    </div>
                    <div className="flex justify-start lg:justify-end">
                      <button
                        onClick={() => setBookingModalOpen(true)}
                        className="bg-gold hover:bg-gold-soft text-luxury-bg px-8 py-4 text-xs font-bold tracking-widest uppercase transition-colors w-full sm:w-auto"
                      >
                        BOOK MASTER FITTER
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 4. SIGNATURE COLLECTIONS VIEW */}
          {activePage === 'signature' && (
            <motion.div
              key="signature"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="pt-8">
                <SignatureCollections openBookingModal={() => setBookingModalOpen(true)} />
                
                {/* Extra premium Lookbook catalog */}
                <div className="bg-luxury-sec py-20 border-b border-white/5">
                  <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-16">
                      <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase block mb-2">LIMITED LAUNCHES</span>
                      <h2 className="font-serif text-3xl font-light">The Master Lookbook</h2>
                      <div className="mx-auto h-[1px] w-12 bg-gold mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Lookbook 1 */}
                      <div className="group border border-white/10 bg-luxury-bg p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="aspect-[4/5] overflow-hidden mb-6">
                            <img 
                              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" 
                              alt="Lookbook" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-sans text-[8px] tracking-[0.25em] text-gold uppercase font-bold">EDITION V / VOL I</span>
                          <h4 className="font-serif text-lg text-cream mt-2 mb-3">Architectural Drapery Geometry</h4>
                          <p className="font-sans text-xs font-light text-muted-text leading-relaxed">
                            A study of harsh sunlight manipulation in modern glass-fronted desert villas.
                          </p>
                        </div>
                        <button onClick={() => setBookingModalOpen(true)} className="mt-6 text-gold text-[10px] font-bold tracking-widest uppercase hover:text-white transition-colors text-left">
                          REQUEST HARDCOPY CATALOGUE ✦
                        </button>
                      </div>

                      {/* Lookbook 2 */}
                      <div className="group border border-white/10 bg-luxury-bg p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="aspect-[4/5] overflow-hidden mb-6">
                            <img 
                              src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80" 
                              alt="Lookbook" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-sans text-[8px] tracking-[0.25em] text-gold uppercase font-bold">EDITION V / VOL II</span>
                          <h4 className="font-serif text-lg text-cream mt-2 mb-3">Biophilic Wallcoverings</h4>
                          <p className="font-sans text-xs font-light text-muted-text leading-relaxed">
                            Integrating organic, non-reflective misty forest textures into private library halls.
                          </p>
                        </div>
                        <button onClick={() => setBookingModalOpen(true)} className="mt-6 text-gold text-[10px] font-bold tracking-widest uppercase hover:text-white transition-colors text-left">
                          REQUEST HARDCOPY CATALOGUE ✦
                        </button>
                      </div>

                      {/* Lookbook 3 */}
                      <div className="group border border-white/10 bg-luxury-bg p-6 relative flex flex-col justify-between">
                        <div>
                          <div className="aspect-[4/5] overflow-hidden mb-6">
                            <img 
                              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                              alt="Lookbook" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-sans text-[8px] tracking-[0.25em] text-gold uppercase font-bold">EDITION V / VOL III</span>
                          <h4 className="font-serif text-lg text-cream mt-2 mb-3">Heavy Acoustic Velvet Damping</h4>
                          <p className="font-sans text-xs font-light text-muted-text leading-relaxed">
                            Calibrating internal acoustics inside private cinemas and grand grand-piano drawing halls.
                          </p>
                        </div>
                        <button onClick={() => setBookingModalOpen(true)} className="mt-6 text-gold text-[10px] font-bold tracking-widest uppercase hover:text-white transition-colors text-left">
                          REQUEST HARDCOPY CATALOGUE ✦
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 5. PORTFOLIO PAGE */}
          {activePage === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="pt-8">
                <PortfolioSection />
                
                {/* Interactive metrics */}
                <div className="bg-luxury-bg py-20 border-b border-white/5">
                  <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-center">
                    <span className="font-sans text-[10px] tracking-[0.3em] text-gold uppercase mb-3 block">AUDITED STANDARDS</span>
                    <h2 className="font-serif text-3xl font-light text-white mb-12">The Metric of Luxury</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="p-8 border border-gold/15 bg-luxury-sec">
                        <span className="block font-serif text-4xl text-gold mb-2">0.5mm</span>
                        <span className="block text-xs font-semibold uppercase tracking-widest text-cream mb-1">Drape Clearance</span>
                        <p className="text-[11px] text-muted-text leading-relaxed font-light">Floor-skimming precision to prevent dust gathering while maintaining aesthetic weight.</p>
                      </div>

                      <div className="p-8 border border-gold/15 bg-luxury-sec">
                        <span className="block font-serif text-4xl text-gold mb-2">100%</span>
                        <span className="block text-xs font-semibold uppercase tracking-widest text-cream mb-1">Substrate Prep</span>
                        <p className="text-[11px] text-muted-text leading-relaxed font-light">Every wall backing is stripped, sand-smoothed, and moisture-sealed before pasting.</p>
                      </div>

                      <div className="p-8 border border-gold/15 bg-luxury-sec">
                        <span className="block font-serif text-4xl text-gold mb-2">26dB</span>
                        <span className="block text-xs font-semibold uppercase tracking-widest text-cream mb-1">Acoustic Shield</span>
                        <p className="text-[11px] text-muted-text leading-relaxed font-light">Our multi-layered Reserve velvet blocks decibels, providing acoustic calm.</p>
                      </div>

                      <div className="p-8 border border-gold/15 bg-luxury-sec">
                        <span className="block font-serif text-4xl text-gold mb-2">10 Yr</span>
                        <span className="block text-xs font-semibold uppercase tracking-widest text-cream mb-1">Color Defense</span>
                        <p className="text-[11px] text-muted-text leading-relaxed font-light">Swatches undergo testing to prevent discoloration under sunlight angles.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 6. ABOUT PAGE */}
          {activePage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="py-12 lg:py-20 bg-luxury-bg"
              id="about-page"
            >
              <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                
                {/* Main Hero Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
                  <div className="lg:col-span-6">
                    <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold uppercase block mb-3">OUR HERITAGE</span>
                    <h1 className="font-serif text-4xl sm:text-5xl font-light text-white leading-tight">
                      The Art Of Dressing <br />
                      <span className="italic text-gold">Architectural Walls</span>
                    </h1>
                    <div className="h-0.5 w-16 bg-gold my-6" />
                    <p className="font-sans text-xs font-light text-muted-text leading-relaxed mb-6">
                      Established in 2016, Floating Drapes was born from a singular architectural vision: to replace generic, off-the-shelf curtain designs with custom-engineered, textile sculptures.
                    </p>
                    <p className="font-sans text-xs font-light text-muted-text leading-relaxed">
                      We believe window drapes and wall structures are not mere decorations. They are acoustic buffers, sunlight controllers, and tactile elements that dictate the emotional temperature of a home. We work with legendary European weavers and precision laser technicians to establish new paradigms of luxury.
                    </p>
                  </div>
                  
                  <div className="lg:col-span-6 aspect-square max-h-[500px] overflow-hidden relative border border-gold/15 luxury-border-glow">
                    <img
                      src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80"
                      alt="Floating Drapes Studio Artisan Workshop"
                      className="w-full h-full object-cover brightness-90 animate-subtle-zoom"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </div>

                {/* Grid stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-b border-gold/15 my-20">
                  <div className="text-center">
                    <span className="font-serif text-4xl text-gold block mb-2">250+</span>
                    <span className="font-sans text-[10px] font-bold tracking-widest text-cream uppercase">Premium Villas Styled</span>
                    <p className="text-[11px] text-muted-text font-light mt-2 max-w-xs mx-auto">From coastal resorts to high-density penthouse suites in Bangalore and Beverly Hills.</p>
                  </div>
                  <div className="text-center border-t md:border-t-0 md:border-l md:border-r border-gold/10 py-6 md:py-0">
                    <span className="font-serif text-4xl text-gold block mb-2">10+ Years</span>
                    <span className="font-sans text-[10px] font-bold tracking-widest text-cream uppercase">Weaving Mastery</span>
                    <p className="text-[11px] text-muted-text font-light mt-2 max-w-xs mx-auto">Our lead tailors spent decades mastering French heavy-pleating and velvet alignment mechanics.</p>
                  </div>
                  <div className="text-center">
                    <span className="font-serif text-4xl text-gold block mb-2">Sub-0.5mm</span>
                    <span className="font-sans text-[10px] font-bold tracking-widest text-cream uppercase">Laser Calibration</span>
                    <p className="text-[11px] text-muted-text font-light mt-2 max-w-xs mx-auto">Every window cavity is mapped digitally in 3D before fabric layouts are finalized.</p>
                  </div>
                </div>



                {/* Frequently Asked Questions FAQ block */}
                <div className="bg-luxury-sec border border-gold/15 p-8 sm:p-12">
                  <div className="text-center mb-10">
                    <span className="font-sans text-[10px] tracking-[0.3em] text-gold uppercase block mb-2">INFORMATION DECK</span>
                    <h3 className="font-serif text-2xl text-white">Client Questions & Protocols</h3>
                    <div className="mx-auto h-[1px] w-12 bg-gold mt-3" />
                  </div>

                  <div className="space-y-4 max-w-3xl mx-auto" id="faq-accordions">
                    {[
                      {
                        q: "What is your consultation protocol?",
                        a: "Our stylist brings full catalog binders and fabric swatches directly to your residence. We scan your window cavities using laser telemetry and sketch draping styles in real-time, free of any charge."
                      },
                      {
                        q: "Do you offer motorized drapery controls?",
                        a: "Yes. Every curtain we tailors is compatible with Lutron, Somfy, and Glydea motors, interfacing seamlessly with smart hubs like Apple HomeKit, Alexa, or Crestron home processors."
                      },
                      {
                        q: "How long does fabrication take?",
                        a: "Custom fabric weaving and laser-measured sewing takes approximately 14 to 21 business days in our flagship studio. Standard installation takes only a single morning depending on room volume."
                      },
                      {
                        q: "Is your wallpaper moisture-sealed?",
                        a: "Yes. Our Classic, Botanical, and Modern paper collections are backed by organic breathable fibers and treated with satin surface sealants to resist humidity discoloration, perfect for living spaces."
                      }
                    ].map((faq, idx) => {
                      const isOpen = activeFaq === idx;
                      return (
                        <div key={idx} className="border-b border-gold/10 pb-4" id={`faq-${idx}`}>
                          <button
                            onClick={() => setActiveFaq(isOpen ? null : idx)}
                            className="w-full flex justify-between items-center py-3 text-left font-serif text-sm font-medium text-cream hover:text-gold transition-colors focus:outline-none"
                          >
                            <span>{faq.q}</span>
                            <span className="text-gold text-lg">{isOpen ? '−' : '+'}</span>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="font-sans text-xs font-light text-muted-text leading-relaxed pt-2 pb-1">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 7. CONTACT PAGE */}
          {activePage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Reuse of contact form component */}
              <ContactForm />

              {/* Dynamic Flagship Studio details & Custom map mock */}
              <div className="bg-luxury-sec py-16 border-t border-b border-gold/15" id="flagship-map-section">
                <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <span className="font-sans text-[10px] tracking-[0.3em] text-gold uppercase block mb-2">FLAGSHIP DESIGN SALON</span>
                      <h3 className="font-serif text-2xl text-white mb-6">Coordinate Your Studio Walk-In</h3>
                      <p className="font-sans text-xs font-light text-muted-text leading-relaxed mb-6">
                        Walk-ins are welcomed, but we recommend securing a reserved time block so that a Senior Textile Consultant can be fully dedicated to your floorplans and structural materials brief.
                      </p>

                      <div className="space-y-4 text-xs font-light text-muted-text">
                        <p><strong>Flagship Hour:</strong> Mon - Sat: 10am - 8pm | Sun: By Private Reserved Request Only</p>
                        <p><strong>Studio Address:</strong> 123 Design Street, Indiranagar, Bangalore, Karnataka 560038, India</p>
                        <p><strong>Valet Parking:</strong> Complimentary secure basement valet provided on-site.</p>
                      </div>

                      <button
                        onClick={() => setBookingModalOpen(true)}
                        className="bg-gold hover:bg-gold-soft text-luxury-bg px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors mt-8"
                      >
                        RESERVE TIME SLOT
                      </button>
                    </div>

                    {/* Styled Map Container */}
                    <div className="relative aspect-video bg-luxury-bg border border-gold/20 overflow-hidden flex flex-col justify-center items-center p-8 text-center select-none luxury-border-glow">
                      {/* Grid overlay to look like drafting blueprint map */}
                      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-repeat" style={{ backgroundImage: "linear-gradient(rgba(200,165,106,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,106,0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      
                      <div className="relative z-10">
                        <span className="text-gold text-2xl">🗺</span>
                        <h4 className="font-serif text-lg text-cream mt-3 mb-2">Bangalore Central Design Core</h4>
                        <p className="font-sans text-[11px] text-muted-text max-w-xs mx-auto leading-normal">
                          Located in the heart of Bangalore's primary architect and villa curation district. Conveniently near metro transit hubs.
                        </p>
                        
                        <div className="mt-4 inline-flex items-center space-x-2 text-[10px] text-gold tracking-widest uppercase font-bold">
                          <span>VIEW INTERACTIVE GPS ROUTING</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* WHATSAPP BUTTON (Floating) */}
      <WhatsAppButton />

      {/* BOOKING CONSULTATION MODAL */}
      <BookingModal 
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)} 
      />

      {/* GLOBAL FOOTER */}
      <Footer 
        setActivePage={setActivePage} 
        openBookingModal={() => setBookingModalOpen(true)} 
      />

    </div>
  );
}
