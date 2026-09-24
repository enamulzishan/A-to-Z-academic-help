"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl p-4 md:p-6"
        >
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 flex-grow pr-4">
              <p>
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies as described in our{" "}
                <Link href="/legal/cookie-policy" className="text-navy font-semibold underline">
                  Cookie Policy
                </Link>.
              </p>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button 
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-navy transition-colors"
              >
                Decline
              </button>
              <button 
                onClick={handleAccept}
                className="px-6 py-2 bg-navy text-white text-sm font-bold rounded-lg hover:bg-navy/90 transition-colors shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
