import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle, Calendar, DollarSign, PenTool } from 'lucide-react';
import { BookingSubmission } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferredDate: '',
    projectType: 'Curtains Installation',
    budget: '$2,000 - $5,000',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury API call
    setTimeout(() => {
      const submissions: BookingSubmission[] = JSON.parse(localStorage.getItem('velora_bookings') || '[]');
      const newSubmission: BookingSubmission = {
        id: 'b-' + Date.now(),
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      submissions.push(newSubmission);
      localStorage.setItem('velora_bookings', JSON.stringify(submissions));

      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Clean up fields
      setFormData({
        name: '',
        phone: '',
        preferredDate: '',
        projectType: 'Curtains Installation',
        budget: '$2,000 - $5,000',
      });
    }, 1500);
  };

  const projectTypes = [
    'Curtains Installation',
    'Wallpaper Covering',
    'Complete Villa Styling',
    'Commercial Showcase',
    'Bespoke Automation Request'
  ];

  const budgets = [
    'Under $2,000',
    '$2,000 - $5,000',
    '$5,000 - $15,000',
    '$15,000 - $50,000',
    'Estate Premium ($50k+)'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="booking-modal-overlay">
          {/* Dark blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Form Card */}
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-lg overflow-hidden border border-gold/25 bg-luxury-sec p-6 sm:p-10 shadow-[0_0_50px_rgba(200,165,106,0.25)] rounded-none text-white"
            id="booking-modal-card"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1 text-muted-text hover:text-gold transition-colors"
              aria-label="Close"
              id="close-booking-modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Success Layout */}
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8"
                id="booking-success-anim"
              >
                <div className="h-16 w-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold mb-6 animate-bounce">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <span className="font-sans text-[10px] tracking-[0.3em] text-gold uppercase mb-2">APPOINTMENT SECURED</span>
                <h3 className="font-serif text-2xl text-white mb-4">Your Private Consultation is Scheduled</h3>
                <p className="font-sans text-xs text-muted-text max-w-sm leading-relaxed mb-8">
                  Thank you. An interior concierge from Floating Drapes will contact you directly within 2 business hours to verify details and bring your material sample deck.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="bg-gold hover:bg-gold-soft text-luxury-bg px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  RETURN TO GALLERY
                </button>
              </motion.div>
            ) : (
              /* Regular Input Form */
              <div className="flex flex-col">
                <div className="mb-6 flex items-center space-x-2 text-gold">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase">PRIVATE CONSULTATION</span>
                </div>

                <h3 className="font-serif text-2xl font-light text-white mb-2">
                  Begin Your <span className="italic text-gold">Bespoke Fitting</span>
                </h3>
                <p className="font-sans text-xs font-light text-muted-text mb-8 leading-relaxed">
                  Enter your details below. We bring a custom swatch palette directly to your location.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name field */}
                  <div>
                    <label className="block text-[9px] font-bold tracking-[0.2em] text-gold uppercase mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Countess Sterling"
                      className="w-full bg-white/5 border border-gold/15 px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors rounded-none"
                    />
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-[9px] font-bold tracking-[0.2em] text-gold uppercase mb-2">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +1 (555) 019-2831"
                      className="w-full bg-white/5 border border-gold/15 px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Preferred Date */}
                    <div>
                      <label className="block text-[9px] font-bold tracking-[0.2em] text-gold uppercase mb-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Preferred Date</span>
                        </span>
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-white/5 border border-gold/15 px-4 py-3 text-xs text-white focus:outline-none focus:border-gold transition-colors rounded-none"
                      />
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-[9px] font-bold tracking-[0.2em] text-gold uppercase mb-2">
                        <span className="flex items-center space-x-1">
                          <PenTool className="h-3 w-3" />
                          <span>Project Type</span>
                        </span>
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full bg-luxury-sec border border-gold/15 px-3 py-3 text-xs text-white focus:outline-none focus:border-gold transition-colors rounded-none"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-luxury-sec text-white">{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Estimated budget */}
                  <div>
                    <label className="block text-[9px] font-bold tracking-[0.2em] text-gold uppercase mb-2">
                      <span className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>Estimated Budget</span>
                      </span>
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-luxury-sec border border-gold/15 px-3 py-3 text-xs text-white focus:outline-none focus:border-gold transition-colors rounded-none"
                    >
                      {budgets.map((b) => (
                        <option key={b} value={b} className="bg-luxury-sec text-white">{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gold hover:bg-gold-soft text-luxury-bg py-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center space-x-2 rounded-none disabled:opacity-50"
                      id="submit-booking-modal-btn"
                    >
                      {isSubmitting ? (
                        <span>TRANSMITTING ADVISORY SECURELY...</span>
                      ) : (
                        <span>CONFIRM BOOKING SESSION</span>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}
            
            {/* Subtle floating particle glow */}
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-gold/5 blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
