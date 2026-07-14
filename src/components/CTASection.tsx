import { motion } from 'motion/react';
import { CalendarCheck, MessageSquareMore, Sparkles } from 'lucide-react';

interface CTAProps {
  openBookingModal: () => void;
  openWhatsApp: () => void;
}

export default function CTASection({ openBookingModal, openWhatsApp }: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20 lg:py-28 border-b border-white/5" id="cta-banner-section">
      {/* Background soft lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl rounded-full bg-gold/5 blur-[140px] pointer-events-none z-0" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Beautiful dark room image in a curved frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative aspect-[4/3] sm:aspect-video lg:aspect-[3/4] w-full overflow-hidden rounded-3xl border border-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Styled Living Space"
              className="h-full w-full object-cover brightness-[0.75] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            {/* Fine border lines overlay inside the curved frame */}
            <div className="absolute inset-4 border border-gold/15 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
            
            {/* Tag in corner */}
            <div className="absolute bottom-6 left-6 text-left">
              <span className="font-serif text-sm text-white block">The Royal Suite drapes</span>
              <span className="font-sans text-[8.5px] tracking-widest text-gold uppercase mt-1 block">✦ Installed in 2026</span>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Text and Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Little Crest / Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 bg-gold/5 text-gold"
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
              className="font-serif text-3xl sm:text-4.5xl lg:text-[46px] font-light leading-[1.1] text-white"
            >
              Ready to Transform <br />
              <span className="italic text-gold font-light">Your Space?</span>
            </motion.h2>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-xs sm:text-[13.5px] font-light text-muted-text leading-relaxed max-w-xl"
            >
              Book a free consultation with our experts and bring your vision to life. Schedule a private, complimentary design session with our master stylist. We bring the samples, scan your space, and customize high-end draperies tailored completely for your residence.
            </motion.p>

            {/* Two Expensive-feeling Gold Border Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full animate-none"
            >
              {/* Button 1: Book Consultation with gold outline flow */}
              <button
                onClick={openBookingModal}
                className="group relative overflow-hidden bg-gold px-8 py-4 text-[10.5px] font-bold tracking-[0.25em] text-luxury-bg uppercase transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_0_35px_rgba(200,165,106,0.35)] flex items-center justify-center space-x-3 rounded-none cursor-pointer"
                id="cta-book-btn"
              >
                {/* Magnetic light glare element */}
                <span className="absolute inset-y-0 left-0 w-12 bg-white/15 skew-x-[-20deg] translate-x-[-100px] group-hover:translate-x-[400px] transition-transform duration-1000 ease-out" />
                
                <CalendarCheck className="h-4 w-4" />
                <span>BOOK FREE CONSULTATION</span>
              </button>

              {/* Button 2: WhatsApp Us with fine gold border pulsing glow */}
              <button
                onClick={openWhatsApp}
                className="group relative border border-gold/45 px-8 py-4 text-[10.5px] font-bold tracking-[0.25em] text-white uppercase bg-transparent transition-all duration-300 hover:bg-gold/10 hover:text-gold flex items-center justify-center space-x-3 rounded-none cursor-pointer"
                id="cta-whatsapp-btn"
              >
                {/* Fine border glow effect on hover */}
                <span className="absolute inset-0 border border-gold/50 scale-100 group-hover:scale-105 transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />
                
                <MessageSquareMore className="h-4 w-4 text-gold group-hover:scale-110 transition-transform" />
                <span>CHAT ON WHATSAPP</span>
              </button>
            </motion.div>

            {/* Security / Quality Promise Footer */}
            <div className="pt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[9.5px] tracking-[0.18em] text-muted-text uppercase font-semibold">
              <span className="flex items-center space-x-1">
                <span className="text-gold">✔</span> <span>zero obligation advisory</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-gold/50 hidden sm:inline" />
              <span className="flex items-center space-x-1">
                <span className="text-gold">✔</span> <span>full luxury color deck</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-gold/50 hidden sm:inline" />
              <span className="flex items-center space-x-1">
                <span className="text-gold">✔</span> <span>laser measurements included</span>
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
