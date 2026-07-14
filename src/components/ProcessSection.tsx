import { motion } from 'motion/react';
import { MessageSquare, Layers, Ruler, CheckSquare, Sparkles } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      step: '01',
      title: 'Consultation',
      subtitle: 'Understanding style & space',
      description: 'Understanding your style, needs & space through a complimentary premium design advisory.',
      icon: MessageSquare,
    },
    {
      step: '02',
      title: 'Design & Selection',
      subtitle: 'Premium Fabrics & Textures',
      description: 'Handpick fabrics, patterns & textures from legendary European silk, linen, and velvet mills.',
      icon: Layers,
    },
    {
      step: '03',
      title: 'Measurement',
      subtitle: 'Laser cavity telemetry',
      description: 'Precise on-site measurements down to fractions of a millimeter using digital scanners.',
      icon: Ruler,
    },
    {
      step: '04',
      title: 'Installation',
      subtitle: 'Surgical expert fitting',
      description: 'Expert installation with perfection, on-site steaming, and fine calibration of all track mechanics.',
      icon: CheckSquare,
    },
  ];

  return (
    <section className="bg-cream py-20 lg:py-28 border-b border-gold/15 text-luxury-bg relative overflow-hidden" id="process-timeline-section">
      {/* Decorative luxury backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(200,165,106,0.06),transparent_40%)]" />
      
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-20 text-center">
          <span className="font-sans text-[10px] font-bold tracking-[0.4em] text-gold-soft uppercase mb-2 block">
            OUR METICULOUS JOURNEY
          </span>
          <h2 className="font-serif text-3xl font-light text-luxury-bg sm:text-4xl">
            From Vision To Reality
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-gold mt-4" />
        </div>

        {/* Timeline Layout with animated line */}
        <div className="relative mt-12">
          
          {/* HORIZONTAL LINE (Desktop only) */}
          <div className="hidden lg:block absolute top-[44px] left-[50px] right-[50px] h-[1px] bg-gold/20">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-gold-soft via-gold to-gold-soft" 
            />
          </div>

          {/* Grid for steps */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: 'easeOut' }}
                  className="group flex flex-col items-center lg:items-start text-center lg:text-left relative"
                  id={`process-step-${idx}`}
                >
                  {/* Icon Circle */}
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-luxury-bg border border-gold/30 text-gold shadow-xl group-hover:border-gold group-hover:scale-105 transition-all duration-300">
                    <IconComponent className="h-7 w-7" />
                    
                    {/* Tiny sequential number tag */}
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-luxury-bg border border-cream shadow">
                      {item.step}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="mt-6 flex flex-col items-center lg:items-start">
                    <span className="font-sans text-[9px] font-bold tracking-[0.3em] text-gold-soft uppercase mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="font-serif text-xl font-normal text-luxury-bg group-hover:text-gold-soft transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    {/* Golden accent bar under text */}
                    <div className="h-[1px] w-8 bg-gold-soft/30 my-3 group-hover:w-16 transition-all duration-500" />
                    
                    <p className="font-sans text-xs font-light text-zinc-700 leading-relaxed max-w-[260px]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Decorative Sparkle Footer block */}
        <div className="mt-16 flex justify-center items-center space-x-3 text-gold-soft">
          <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase">100% QUALITY SIGN-OFF AT EACH MILESTONE</span>
          <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

      </div>
    </section>
  );
}
