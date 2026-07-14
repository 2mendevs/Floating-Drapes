import { motion } from 'motion/react';
import { Shield, Truck, Target, Scissors } from 'lucide-react';

export default function PremiumFeaturesStrip() {
  const items = [
    {
      icon: Shield,
      title: '10-Year Warranty',
      desc: 'Written architectural warranty on all luxury tracks, fabrics, and stitching.'
    },
    {
      icon: Truck,
      title: 'Complimentary White Glove Delivery',
      desc: 'Personalized premium shipping, room-by-room staging, and expert unpacking.'
    },
    {
      icon: Target,
      title: 'Laser Precision Measurement',
      desc: 'Millimeter-perfect structural scans to guarantee beautiful, fluid drapery.'
    },
    {
      icon: Scissors,
      title: 'Master Tailoring',
      desc: 'Painstakingly crafted by expert textile technicians in our European partner mills.'
    }
  ];

  return (
    <section className="bg-luxury-bg py-16 border-b border-luxury-border relative" id="premium-features-strip">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((el, i) => {
            const Icon = el.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative p-6 bg-white/[0.02] border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_25px_rgba(196,147,63,0.08)] transition-all duration-300 rounded-none flex flex-col justify-between"
                id={`feature-strip-card-${i}`}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 text-left">
                  <div className="mb-4 text-gold group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h4 className="font-serif text-base font-normal tracking-wide text-white mb-2">
                    {el.title}
                  </h4>
                  <p className="font-sans text-xs font-light text-[#A69A88] leading-relaxed">
                    {el.desc}
                  </p>
                </div>

                {/* Micro corner details */}
                <div className="absolute top-2 right-2 h-1.5 w-1.5 border-t border-r border-gold/25 group-hover:border-gold transition-colors" />
                <div className="absolute bottom-2 left-2 h-1.5 w-1.5 border-b border-l border-gold/25 group-hover:border-gold transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
