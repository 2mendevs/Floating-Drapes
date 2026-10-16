import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CurtainsWallpapersSection } from './components/CurtainsWallpapersSection';
import { SignatureCollections } from './components/SignatureCollections';
import { CustomizationSection } from './components/CustomizationSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessSection } from './components/ProcessSection';
import { Testimonials } from './components/Testimonials';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { ContactForm } from './components/ContactForm';
import { BookingModal } from './components/BookingModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AdminPanel } from './components/AdminPanel';
import { ThemeInjector } from './components/ThemeInjector';

import {
  SiteConfig,
  CurtainItem,
  WallpaperItem,
  BookingSubmission,
  DEFAULT_SITE_CONFIG,
  Testimonial,
  TESTIMONIALS_DATA
} from './types';
import {
  BlindItem,
  EXTENDED_CURTAINS_DATA,
  EXTENDED_WALLPAPERS_DATA,
  EXTENDED_BLINDS_DATA
} from './data/productsData';
import {
  initUniversalSupabase,
  fetchUniversalSiteData,
  subscribeToUniversalChanges
} from './services/supabaseClient';

export function App() {
  // Pre-seed state with default fallback data so the page never loads blank
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [curtains, setCurtains] = useState<CurtainItem[]>(EXTENDED_CURTAINS_DATA);
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>(EXTENDED_WALLPAPERS_DATA);
  const [blinds, setBlinds] = useState<BlindItem[]>(EXTENDED_BLINDS_DATA);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS_DATA);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<string>('');

  const loadDataFromSupabase = async () => {
    try {
      await initUniversalSupabase();
      const remote = await fetchUniversalSiteData();

      if (remote.siteConfig) {
        setSiteConfig(remote.siteConfig);
      }
      if (remote.curtains && remote.curtains.length > 0) {
        setCurtains(remote.curtains);
      }
      if (remote.wallpapers && remote.wallpapers.length > 0) {
        setWallpapers(remote.wallpapers);
      }
      if (remote.blinds && remote.blinds.length > 0) {
        setBlinds(remote.blinds);
      }
      if (remote.testimonials && remote.testimonials.length > 0) {
        setTestimonials(remote.testimonials);
      }
    } catch (e) {
      console.warn('Could not pull remote Supabase data on refresh:', e);
    }
  };

  useEffect(() => {
    loadDataFromSupabase();

    // Listen for Realtime Supabase updates
    const unsubscribe = subscribeToUniversalChanges((table, payload) => {
      console.log(`Supabase Realtime update on table: ${table}`, payload);
      loadDataFromSupabase();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleOpenBooking = (service?: string) => {
    setBookingPrefill(service || '');
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-amber-200 selection:text-amber-900">
      <ThemeInjector config={siteConfig} />

      <Header
        config={siteConfig}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main>
        <Hero config={siteConfig} onOpenBooking={() => handleOpenBooking()} />

        <CurtainsWallpapersSection
          config={siteConfig}
          curtains={curtains}
          wallpapers={wallpapers}
          blinds={blinds}
          onOpenBooking={handleOpenBooking}
        />

        <SignatureCollections
          curtains={curtains}
          wallpapers={wallpapers}
          blinds={blinds}
          onOpenBooking={handleOpenBooking}
        />

        <CustomizationSection
          config={siteConfig}
          onOpenBooking={() => handleOpenBooking('Custom Tailored Consultation')}
        />

        <BeforeAfterSection />

        <WhyChooseUs config={siteConfig} />

        <ProcessSection onOpenBooking={() => handleOpenBooking()} />

        <Testimonials testimonials={testimonials} />

        <CTASection config={siteConfig} onOpenBooking={() => handleOpenBooking()} />

        <section id="contact" className="py-20 bg-stone-100/70 border-t border-stone-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer config={siteConfig} onOpenAdmin={() => setIsAdminOpen(true)} />

      <WhatsAppButton phone={siteConfig.phone || '919876543210'} />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        prefillService={bookingPrefill}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        siteConfig={siteConfig}
        onUpdateConfig={(newConfig) => setSiteConfig(newConfig)}
        curtains={curtains}
        wallpapers={wallpapers}
        blinds={blinds}
        onRefreshData={loadDataFromSupabase}
      />
    </div>
  );
}

export default App;
