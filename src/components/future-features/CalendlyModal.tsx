"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

export function CalendlyModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isOpen = searchParams.get("book") === "true";
  const [isLoading, setIsLoading] = useState(true);

  const closeModal = () => {
    // Remove ?book=true from the URL without full reload
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("book");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLoading(true);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col relative overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h3 className="font-bold text-navy">Book a Free Consultation</h3>
                <p className="text-xs text-gray-500 hidden sm:block">Tell us about your academic needs. Our team will review your requirements and get back to you within 24 hours.</p>
              </div>
              <button 
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-navy hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-grow relative bg-white">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                  <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
                  <p className="text-gray-500 font-medium animate-pulse">Loading calendar...</p>
                </div>
              )}
              <iframe
                src="https://calendly.com/atozacademichelp/consultation?embed_domain=localhost&embed_type=PopupText"
                width="100%"
                height="100%"
                frameBorder="0"
                className="absolute inset-0"
                onLoad={() => setIsLoading(false)}
                title="Schedule a Consultation"
              ></iframe>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
