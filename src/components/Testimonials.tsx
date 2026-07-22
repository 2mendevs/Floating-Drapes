import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 't1',
      name: 'Priya S.',
      location: 'Coimbatore',
      review: 'Floating Drapes completely transformed our home. The quality, service and attention to detail were exceptional.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 't2',
      name: 'Karthik R.',
      location: 'Coimbatore',
      review: 'Excellent collection and very professional team. They helped us choose the perfect designs.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 't3',
      name: 'Anita M.',
      location: 'Coimbatore',
      review: 'From measurement to installation, everything was smooth and hassle-free. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
    }
  ];

  // For responsive carousel behaviors, let's keep track of sliding although all 3 are fully visible on desktop
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-zinc-50 py-10 lg:py-14 border-b border-[#EAEAEA]" id="testimonials-section">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative">
          <span className="font-sans text-[13px] font-semibold tracking-[0.25em] text-[#029BFA] uppercase mb-3 block">
            TESTIMONIALS
          </span>
          <h2 className="font-serif text-[36px] sm:text-[42px] font-bold text-[#021E3B] leading-[1.2] uppercase">
            What Our Clients Say
          </h2>
          <div className="h-[3px] w-12 bg-[#029BFA] mx-auto mt-4" />
        </div>

        {/* Carousel Container */}
        <div className="relative mt-12 max-w-6xl mx-auto" id="testimonials-wrapper">
          
          {/* NAVIGATION ARROWS */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 z-10 hidden sm:block">
            <button
              onClick={prevSlide}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#021E3B] border border-[#EAEAEA] hover:border-[#029BFA] hover:text-[#029BFA] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 z-10 hidden sm:block">
            <button
              onClick={nextSlide}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#021E3B] border border-[#EAEAEA] hover:border-[#029BFA] hover:text-[#029BFA] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop View: 3 columns */}
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-[20px] p-8 border border-[#EAEAEA] flex flex-col justify-between text-left"
                style={{ boxShadow: '0px 10px 30px rgba(2,30,59,0.04)' }}
              >
                {/* Decorative Quote Icon */}
                <div className="absolute top-6 right-6 text-zinc-100 pointer-events-none">
                  <Quote className="h-10 w-10 fill-current text-[#029BFA]/10" />
                </div>

                <div className="space-y-6">
                  {/* Rating stars */}
                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-[#029BFA] text-[#029BFA]" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="font-sans text-[15px] font-light text-zinc-600 leading-[160%] italic">
                    "{item.review}"
                  </p>
                </div>

                {/* Profile Details Block */}
                <div className="mt-8 pt-6 border-t border-[#F5F5F5] flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-[#EAEAEA]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-[16px] font-bold text-[#021E3B]">
                      {item.name}
                    </h4>
                    <p className="font-sans text-[11px] font-medium text-[#029BFA] uppercase tracking-wide mt-0.5">
                      {item.location}
                    </p>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Tablet & Mobile View: Carousel */}
          <div className="lg:hidden" id="testimonials-carousel-mobile">
            <div className="bg-white rounded-[20px] p-8 border border-[#EAEAEA] flex flex-col justify-between text-left shadow-[0_10px_30px_rgba(2,30,59,0.04)] relative min-h-[300px]">
              
              <div className="absolute top-6 right-6 text-zinc-100 pointer-events-none">
                <Quote className="h-10 w-10 fill-current text-[#029BFA]/10" />
              </div>

              <div className="space-y-5">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-[#029BFA] text-[#029BFA]" />
                  ))}
                </div>

                <p className="font-sans text-[15px] font-light text-zinc-600 leading-[160%] italic">
                  "{testimonials[currentIndex].review}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F5F5F5] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-[#EAEAEA]">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-[16px] font-bold text-[#021E3B]">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="font-sans text-[11px] font-medium text-[#029BFA] uppercase tracking-wide mt-0.5">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>

                {/* Mobile controls inside card */}
                <div className="flex items-center space-x-2 sm:hidden">
                  <button
                    onClick={prevSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#EAEAEA] text-[#021E3B]"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#EAEAEA] text-[#021E3B]"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center space-x-2 mt-8 lg:hidden">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-[#029BFA]' : 'w-2.5 bg-zinc-200'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
