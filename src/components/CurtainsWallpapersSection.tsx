import { ArrowRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface SectionProps {
  onSelectCategory: (category: 'curtains' | 'wallpapers' | 'blinds') => void;
}

export default function CurtainsWallpapersSection({ onSelectCategory }: SectionProps) {
  const products = [
    {
      id: 'curtains',
      title: 'Curtains',
      badge: '1000+',
      description: 'Premium quality fabrics in a wide range of colors, textures & patterns.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
      actionLabel: 'Explore Curtains',
    },
    {
      id: 'wallpapers',
      title: 'Wallpapers',
      badge: '1500+',
      description: 'From modern textures to timeless patterns, find the perfect match.',
      image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80',
      actionLabel: 'Explore Wallpapers',
    },
    {
      id: 'blinds',
      title: 'Blinds',
      badge: '600+',
      description: 'Stylish & functional blinds for light control and privacy.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      actionLabel: 'Explore Blinds',
    }
  ];

  return (
    <section className="bg-white py-10 lg:py-14 border-b border-[#EAEAEA]" id="categories-overview-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-[13px] md:text-[14px] font-semibold tracking-[0.25em] text-[#029BFA] uppercase mb-3 block">
            OUR PRODUCTS
          </span>
          <h2 className="font-serif text-[36px] sm:text-[42px] font-bold text-[#021E3B] leading-[1.2] uppercase">
            Elegance In Every Detail
          </h2>
          <div className="h-[3px] w-12 bg-[#029BFA] mx-auto mt-4" />
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mt-12">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectCategory(p.id as any)}
              className="group cursor-pointer bg-white rounded-[20px] overflow-hidden border border-[#EAEAEA] flex flex-col justify-between min-h-[480px] transition-all duration-500 hover:-translate-y-2"
              style={{ boxShadow: '0px 10px 30px rgba(2,30,59,0.04)' }}
              id={`${p.id}-overview-card`}
            >
              {/* Image with counter badge in top corner */}
              <div className="relative h-[280px] w-full overflow-hidden shrink-0">
                <OptimizedImage
                  src={p.image}
                  alt={p.title}
                  width={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Blue circular badge in top right corner */}
                <div className="absolute top-4 right-4 flex flex-col items-center justify-center h-16 w-16 rounded-full bg-[#029BFA] text-white border-2 border-white shadow-[0_4px_12px_rgba(2,155,250,0.3)]">
                  <span className="text-[14px] font-bold leading-none">{p.badge}</span>
                  <span className="text-[7.5px] font-medium uppercase tracking-wider mt-0.5 leading-none">DESIGNS</span>
                </div>
              </div>

              {/* Card Content block */}
              <div className="p-8 flex flex-col justify-between flex-grow text-[#111111]">
                <div className="space-y-3">
                  <h3 className="font-serif text-[26px] sm:text-[28px] font-bold text-[#021E3B]">
                    {p.title}
                  </h3>
                  <p className="font-sans text-[15px] font-light text-zinc-500 leading-[150%]">
                    {p.description}
                  </p>
                </div>

                {/* Explore button links with dynamic interactive arrow */}
                <div className="pt-6 border-t border-[#F5F5F5] mt-6 text-left">
                  <span className="inline-flex items-center space-x-2 text-[14px] font-bold text-[#029BFA] group-hover:text-[#021E3B] transition-colors">
                    <span>{p.actionLabel}</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
