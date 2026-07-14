import { motion } from 'motion/react';
import { Award, Feather, ShieldCheck, Clock } from 'lucide-react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Sourced from legendary European silk & velvet mills.',
    },
    {
      icon: Feather,
      title: 'Custom Designs',
      description: 'Meticulously tailored to your room\'s precise dimensions.',
    },
    {
      icon: ShieldCheck,
      title: 'Expert Installation',
      description: 'Surgical calibration by certified master technicians.',
    },
    {
      icon: Clock,
      title: 'Timeless Beauty',
      description: 'Backed by our exclusive 10-year aesthetic guarantee.',
    },
  ];

  return (
    <div className="bg-luxury-sec py-10 border-b border-gold/10" id="trust-bar-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-white/[0.01] transition-colors duration-300"
                id={`trust-item-${idx}`}
              >
                {/* Icon wrapper with gold circle outline */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 group-hover:border-gold group-hover:bg-gold/15 transition-all duration-500">
                  <IconComponent className="h-5 w-5 text-gold group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <div className="flex flex-col">
                  <h4 className="font-serif text-sm font-medium tracking-wide text-white group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs font-light text-muted-text mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
