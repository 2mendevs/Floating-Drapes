import { motion } from 'motion/react';
import { CalendarCheck, MessageSquareMore, Sparkles } from 'lucide-react';

interface CTAProps {
  openBookingModal: () => void;
  openWhatsApp: () => void;
}

export default function CTASection({ openBookingModal, openWhatsApp }: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 lg:py-32" id="cta-banner-section">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury Designed Living Space"
          className="h-full w-full object-cover brightness-[0.25] contrast-105 scale-102 transition-transform duration-[10000ms] animate-pulse-slow"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/45 to-[#0A0A0A]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12 relative z-10 text-center flex flex-col items-center">
        
        {/* Little Crest / Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/5 mb-6 text-gold"
          id="cta-lux-crest"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl font-normal leading-tight text-white sm:text-5xl"
        >
          Ready To Transform <br />
          <span className="italic text-gold font-light">Your Space?</span>
        </motion.h2>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-sm font-light text-muted-text mt-6 max-w-xl leading-relaxed"
        >
          Schedule a private, complimentary design session with our master stylist. We bring the samples, scan your space, and customize high-end draperies tailored completely for your residence.
        </motion.p>

        {/* Two Expensive-feeling Magnetic/Animated Gold Border Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-6 w-full justify-center"
        >
          {/* Button 1: Book Consultation with gold outline flow */}
          <button
            onClick={openBookingModal}
            className="group relative w-full sm:w-auto overflow-hidden bg-gold px-10 py-5 text-xs font-bold tracking-[0.25em] text-luxury-bg uppercase transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_0_35px_rgba(200,165,106,0.4)] flex items-center justify-center space-x-3 rounded-none"
            id="cta-book-btn"
          >
            {/* Magnetic light glare element */}
            <span className="absolute inset-y-0 left-0 w-12 bg-white/10 skew-x-[-20deg] translate-x-[-100px] group-hover:translate-x-[400px] transition-transform duration-1000 ease-out" />
            
            <CalendarCheck className="h-4 w-4" />
            <span>BOOK FREE CONSULTATION</span>
          </button>

          {/* Button 2: WhatsApp Us with fine gold border pulsing glow */}
          <button
            onClick={openWhatsApp}
            className="group relative w-full sm:w-auto border border-gold px-10 py-5 text-xs font-bold tracking-[0.25em] text-white uppercase bg-transparent transition-all duration-300 hover:bg-gold/10 hover:text-gold flex items-center justify-center space-x-3 rounded-none"
            id="cta-whatsapp-btn"
          >
            {/* Fine border glow effect on hover */}
            <span className="absolute inset-0 border border-gold/50 scale-100 group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />
            
            <MessageSquareMore className="h-4 w-4 text-gold group-hover:scale-110 transition-transform" />
            <span>CHAT ON WHATSAPP</span>
          </button>

        </motion.div>

        {/* Security / Quality Promise Footer */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[10px] tracking-widest text-muted-text uppercase">
          <span>✔ zero obligation advisory</span>
          <span className="h-1.5 w-1.5 rounded-full bg-gold/50 hidden sm:inline" />
          <span>✔ full luxury color deck</span>
          <span className="h-1.5 w-1.5 rounded-full bg-gold/50 hidden sm:inline" />
          <span>✔ laser measurement scans included</span>
        </div>

      </div>
    </section>
  );
}
