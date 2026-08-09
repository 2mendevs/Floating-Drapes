import React, { useState, useRef, useEffect } from 'react';
import { Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface CompareCardProps {
  key?: React.Key;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

function CompareCard({ beforeImage, afterImage, title, description }: CompareCardProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left button pressed
      handleMove(e.clientX);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="flex flex-col bg-white rounded-[20px] overflow-hidden border border-[#EAEAEA] shadow-[0_10px_30px_rgba(2,30,59,0.04)] hover:shadow-[0_15px_40px_rgba(2,30,59,0.08)] transition-all duration-300 h-full">
      
      {/* Interactive slider container */}
      <div 
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden select-none cursor-ew-resize bg-zinc-100"
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
      >
        {/* AFTER IMAGE (Full width backdrop) */}
        <img
          src={getOptimizedImageUrl(afterImage, 800, 75)}
          alt="After Transformation"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute right-4 bottom-4 z-10 bg-[#029BFA] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow border border-white/20">
          AFTER
        </div>

        {/* BEFORE IMAGE (Clipped on top) */}
        <div 
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={getOptimizedImageUrl(beforeImage, 800, 75)}
            alt="Before Transformation"
            className="absolute inset-y-0 left-0 h-full object-cover max-w-none pointer-events-none"
            style={{ width: containerWidth, height: '100%' }}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div className="absolute left-4 bottom-4 z-10 bg-[#021E3B] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow border border-white/15">
            BEFORE
          </div>
        </div>

        {/* Slider Divider line and handle */}
        <div 
          className="absolute inset-y-0 w-[2px] bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="h-9 w-9 rounded-full bg-[#029BFA] text-white shadow-[0_0_15px_rgba(2,155,250,0.5)] flex items-center justify-center border-2 border-white transform -translate-x-1/2">
            <Sliders className="h-4 w-4 rotate-90" />
          </div>
        </div>

        {/* Range input transparent overlay */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos}
          onChange={handleRangeChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Before and after comparison slider"
        />
      </div>

      {/* Description copy beneath */}
      <div className="p-6 text-left space-y-2 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-[20px] font-bold text-[#021E3B] leading-tight">
            {title}
          </h3>
          <p className="font-sans text-[14px] font-light text-zinc-500 leading-[150%] mt-2">
            {description}
          </p>
        </div>
      </div>

    </div>
  );
}

export default function BeforeAfterSection() {
  const comparisons = [
    {
      id: 1,
      title: 'Modern Living Room Makeover',
      description: 'Replaced outdated window drapes with custom luxury navy silk curtains, instantly elevating the room’s visual weight.',
      beforeImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Exquisite Master Bedroom',
      description: 'Upgraded plain walls with custom-textured wallpaper and layered blackout curtains to maximize luxury and sleep comfort.',
      beforeImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'Grand Dining Room Styling',
      description: 'Integrated premium biophilic drapes paired with bespoke blinds to harness natural light control beautifully.',
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1617806118233-18e1db207faf?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: 'Sunlit Villa Lounge',
      description: 'Transformed harsh direct sunlight into a soft ambient glow using custom sheer linen drapes with motorized tracking.',
      beforeImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      title: 'Bespoke Royal Penthouse',
      description: 'Elevated a high-ceiling living space with floor-to-ceiling pleated velvet curtains and gold accent wall coverings.',
      beforeImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 6,
      title: 'Executive Office Suite',
      description: 'Replaced basic industrial blinds with rich acoustic textured drapes for refined corporate elegance and sound damping.',
      beforeImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
      afterImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? comparisons.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === comparisons.length - 1 ? 0 : prev + 1));
  };

  // Compute visible items for cycling seamlessly
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < comparisons.length; i++) {
      items.push(comparisons[(currentIndex + i) % comparisons.length]);
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="bg-white py-10 lg:py-14 border-b border-[#EAEAEA]" id="before-after-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-sans text-[13px] md:text-[14px] font-semibold tracking-[0.25em] text-[#029BFA] uppercase mb-3 block">
            BEFORE & AFTER
          </span>
          <h2 className="font-serif text-[36px] sm:text-[42px] font-bold text-[#021E3B] leading-[1.2] uppercase">
            See The Transformation
          </h2>
          <div className="h-[3px] w-12 bg-[#029BFA] mx-auto mt-4" />
        </div>

        {/* Carousel Wrapper */}
        <div className="relative mt-12 max-w-6xl mx-auto" id="before-after-wrapper">
          
          {/* NAVIGATION ARROWS (SAME STYLE AS TESTIMONIALS SECTION) */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 z-30 hidden sm:block">
            <button
              onClick={prevSlide}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#021E3B] border border-[#EAEAEA] hover:border-[#029BFA] hover:text-[#029BFA] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
              aria-label="Previous transformation"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 z-30 hidden sm:block">
            <button
              onClick={nextSlide}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#021E3B] border border-[#EAEAEA] hover:border-[#029BFA] hover:text-[#029BFA] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
              aria-label="Next transformation"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop View: 3 items */}
          <div className="hidden lg:grid grid-cols-3 gap-8 items-stretch">
            {visibleItems.slice(0, 3).map((c) => (
              <CompareCard
                key={c.id}
                beforeImage={c.beforeImage}
                afterImage={c.afterImage}
                title={c.title}
                description={c.description}
              />
            ))}
          </div>

          {/* Tablet View: 2 items */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-8 items-stretch">
            {visibleItems.slice(0, 2).map((c) => (
              <CompareCard
                key={c.id}
                beforeImage={c.beforeImage}
                afterImage={c.afterImage}
                title={c.title}
                description={c.description}
              />
            ))}
          </div>

          {/* Mobile View: 1 item */}
          <div className="md:hidden">
            <CompareCard
              key={visibleItems[0].id}
              beforeImage={visibleItems[0].beforeImage}
              afterImage={visibleItems[0].afterImage}
              title={visibleItems[0].title}
              description={visibleItems[0].description}
            />
          </div>

          {/* Navigation Controls on Mobile */}
          <div className="flex justify-between items-center sm:hidden mt-6">
            <button
              onClick={prevSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#021E3B] border border-[#EAEAEA] shadow-sm cursor-pointer"
              aria-label="Previous transformation"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center space-x-2">
              {comparisons.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#029BFA]' : 'w-2.5 bg-zinc-200'
                  }`}
                  aria-label={`Go to transformation ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#021E3B] border border-[#EAEAEA] shadow-sm cursor-pointer"
              aria-label="Next transformation"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots Indicator for Desktop / Tablet */}
          <div className="hidden sm:flex justify-center items-center space-x-2 mt-10">
            {comparisons.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-[#029BFA]' : 'w-2.5 bg-zinc-200 hover:bg-zinc-300'
                }`}
                aria-label={`Go to transformation ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
