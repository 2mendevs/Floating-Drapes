import { motion } from 'motion/react';
import { Gem, ShieldAlert, Sparkle, Wind } from 'lucide-react';

export default function PremiumFeaturesStrip() {
  const items = [
    {
      icon: Gem,
      title: 'Premium Materials',
      desc: 'European linen, sateen linings, and mulberry silk thread.'
    },
    {
      icon: Sparkle,
      title: 'Bespoke Designs',
      desc: 'Made-to-order patterns sculpted for high-end home architectures.'
    },
    {
      icon: Wind,
      title: 'Expert Installation',
      desc: 'Seamless wall paste application and motorized track calibration.'
    },
    {
      icon: ShieldAlert,
      title: 'Timeless Beauty',
      desc: 'Materials treated for UV defense to guarantee long-lasting vibrance.'
    }
  ];

  return (
    <section className="bg-luxury-bg py-16 border-b border-white/5 relative" id="premium-features-strip">
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
                className="group relative p-6 bg-white/[0.02] border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_25px_rgba(200,165,106,0.08)] transition-all duration-300 rounded-none flex flex-col justify-between"
                id={`feature-strip-card-${i}`}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="mb-4 text-gold group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-base font-normal tracking-wide text-white mb-2">
                    {el.title}
                  </h4>
                  <p className="font-sans text-xs font-light text-muted-text leading-relaxed">
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
