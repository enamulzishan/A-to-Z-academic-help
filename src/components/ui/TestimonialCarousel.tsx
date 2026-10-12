"use client";

import { useState, useEffect } from "react";
import { testimonials as defaultTestimonials } from "@/data/testimonials";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TestimonialItem } from "@/lib/data";

interface TestimonialCarouselProps {
  testimonials?: TestimonialItem[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials.map(t => ({
    id: t.id,
    quote: t.quote,
    author: t.author,
    role: t.role,
    university: t.university,
    approved: true,
    display_order: 1
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  if (items.length === 0) return null;

  return (
    <div className="relative max-w-4xl mx-auto px-12">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between pointer-events-none">
        <button 
          onClick={prev}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={next}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-hidden py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center text-center px-4 md:px-12"
          >
            <Quote className="w-12 h-12 text-gold/30 mb-6" />
            <p className="text-xl md:text-2xl text-navy italic leading-relaxed mb-8">
              &quot;{items[currentIndex]?.quote}&quot;
            </p>
            <div>
              <h4 className="font-bold text-navy">{items[currentIndex]?.author}</h4>
              <p className="text-sm text-gray-500 font-medium">
                {items[currentIndex]?.role}
                {items[currentIndex]?.university ? `, ${items[currentIndex]?.university}` : ""}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-gold w-8" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
