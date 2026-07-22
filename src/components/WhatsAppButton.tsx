import React, { useState } from 'react';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string, isUser: boolean }>>([
    { text: "Hello! Thank you for choosing Floating Drapes. I am your personal interior styling assistant. How can we help you transform your residence today?", isUser: false }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setMessages((prev) => [...prev, { text: userText, isUser: true }]);
    setChatMessage('');

    // Trigger consultant simulated reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { text: "Thank you for inquiring about our luxury catalog. A senior stylist has been notified of your message. You can also contact us directly at +91 88840 09398 for an immediate response.", isUser: false }
      ]);
    }, 1200);

    // Open real whatsapp link in window
    const encodedText = encodeURIComponent(userText);
    const whatsappUrl = `https://wa.me/918884009398?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleQuickTemplate = (text: string) => {
    setMessages((prev) => [...prev, { text: text, isUser: true }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: `Absolutely. I am initiating your inquiry regarding '${text}'. A master technician is preparing custom fabric samples. Let's secure a consultation appointment.`, isUser: false }
      ]);
    }, 1000);

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/918884009398?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans" id="floating-whatsapp-widget">
      
      {/* TRIGGER FLOATING BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold hover:bg-gold-soft text-luxury-bg shadow-[0_4px_25px_rgba(200,165,106,0.35)] cursor-pointer relative"
        title="Chat on WhatsApp"
        id="whatsapp-floating-btn"
      >
        <span className="absolute inset-0 rounded-full border border-gold animate-ping opacity-20" />
        <MessageSquare className="h-6 w-6 stroke-[2.5]" />
      </motion.button>

      {/* CHAT OVERLAY DRAW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="absolute bottom-18 right-0 w-80 sm:w-96 border border-gold/25 bg-luxury-sec text-white shadow-2xl overflow-hidden rounded-none flex flex-col"
            id="whatsapp-chat-box"
          >
            {/* Header of Chat */}
            <div className="bg-luxury-bg p-4 border-b border-gold/15 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-sm font-medium">Floating Drapes Concierge</span>
                  <span className="text-[9px] tracking-widest text-gold uppercase font-bold">Online / active</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-muted-text hover:text-white transition-colors p-1"
                aria-label="Close Chat"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 h-64 overflow-y-auto p-4 space-y-3 bg-luxury-bg/50">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-none px-3.5 py-2.5 text-xs font-light leading-relaxed ${
                    m.isUser 
                      ? 'bg-gold text-luxury-bg font-normal' 
                      : 'bg-white/5 border border-gold/15 text-white'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action templates */}
            <div className="p-3 border-t border-gold/10 bg-luxury-bg flex flex-wrap gap-2">
              <button 
                onClick={() => handleQuickTemplate("Hi, I'm interested in your curtain and wallpaper services.")}
                className="bg-white/5 hover:bg-gold/10 hover:text-gold border border-gold/15 px-2.5 py-1.5 text-[9px] font-semibold tracking-wider uppercase transition-colors"
              >
                Inquire Services ✦
              </button>
              <button 
                onClick={() => handleQuickTemplate("Can I request a callback for villa curtain planning?")}
                className="bg-white/5 hover:bg-gold/10 hover:text-gold border border-gold/15 px-2.5 py-1.5 text-[9px] font-semibold tracking-wider uppercase transition-colors"
              >
                Request Callback 📞
              </button>
              <button 
                onClick={() => handleQuickTemplate("Please send the Luxury Drapery catalogue.")}
                className="bg-white/5 hover:bg-gold/10 hover:text-gold border border-gold/15 px-2.5 py-1.5 text-[9px] font-semibold tracking-wider uppercase transition-colors"
              >
                Send Catalog 📖
              </button>
            </div>

            {/* Message input area */}
            <form onSubmit={handleSend} className="p-3 border-t border-gold/15 bg-luxury-sec flex items-center space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message to our stylist..."
                className="bg-white/5 border border-gold/15 px-3 py-2 text-xs flex-1 text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors rounded-none"
              />
              <button 
                type="submit" 
                className="bg-gold hover:bg-gold-soft text-luxury-bg h-8 w-8 flex items-center justify-center transition-colors rounded-none"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
