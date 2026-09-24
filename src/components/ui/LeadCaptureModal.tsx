"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download } from "lucide-react";

export function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show modal when user scrolls down 60% of the page, only once per session
    const handleScroll = () => {
      if (hasShown) return;
      
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0 && scrollY / scrollHeight > 0.6) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate API call to Formspree/backend
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => setIsOpen(false), 3000);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-navy transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-navy p-8 text-center text-white">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Free Research Proposal Checklist</h3>
              <p className="text-gray-300 text-sm">Ensure your PhD or Master's proposal hits all the critical requirements before submission.</p>
            </div>

            <div className="p-8">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Download className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-navy mb-2">Checklist Sent!</h4>
                  <p className="text-sm text-gray-600">Check your inbox. Your download link is on the way.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-colors"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gold text-white font-bold py-3 rounded-lg hover:bg-gold/90 transition-colors shadow-sm flex items-center justify-center"
                  >
                    Download Free Checklist
                  </button>
                  <p className="text-xs text-center text-gray-500">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
