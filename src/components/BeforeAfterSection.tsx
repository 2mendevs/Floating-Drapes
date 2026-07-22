import React, { useState, useRef, useEffect } from 'react';
import { Sliders } from 'lucide-react';

interface CompareCardProps {
  key?: React.Key;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
}

function CompareCard({ beforeImage, afterImage, title, description }: CompareCardProps) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const [containerWidth, setContainerWidth] = useState<number>(600); // default fallback
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set initial width
    setContainerWidth(containerRef.current.getBoundingClientRect().width);

    // Watch for resizes to avoid stretched images on rotate or resize
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
    <div className="flex flex-col bg-white rounded-[20px] overflow-hidden border border-[#EAEAEA] shadow-[0_10px_30px_rgba(2,30,59,0.04)] hover:shadow-[0_15px_40px_rgba(2,30,59,0.08)] transition-all duration-300">
      
      {/* Interactive slider container */}
      <div 
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden select-none cursor-ew-resize bg-zinc-100"
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
      >
        {/* AFTER IMAGE (Full width backdrop) */}
        <img
          src={afterImage}
          alt="After Transformation"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
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
            src={beforeImage}
            alt="Before Transformation"
            className="absolute inset-y-0 left-0 h-full object-cover max-w-none pointer-events-none"
            style={{ width: containerWidth, height: '100%' }}
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

        {/* Range input transparent overlay to allow easy dragging across desktop/mobile */}
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
      <div className="p-6 text-left space-y-2 flex-grow">
        <h3 className="font-serif text-[20px] font-bold text-[#021E3B] leading-tight">
          {title}
        </h3>
        <p className="font-sans text-[14px] font-light text-zinc-500 leading-[150%]">
          {description}
        </p>
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
    }
  ];

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

        {/* Draggable sliders grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-12" id="before-after-grid">
          {comparisons.map((c) => (
            <CompareCard
              key={c.id}
              beforeImage={c.beforeImage}
              afterImage={c.afterImage}
              title={c.title}
              description={c.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
