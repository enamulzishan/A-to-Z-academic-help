"use client";

import { MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export function StickyCTA() {
  return (
    <div className="sticky top-24 bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-4">
        <MessageSquare className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">Have a research idea?</h3>
      <p className="text-gray-600 mb-6 text-sm">
        Let's refine it together. Our academic consultants can help you turn your concept into a robust proposal.
      </p>
      <Link 
        href="/contact" 
        className="flex items-center justify-center w-full bg-navy text-white py-3 px-4 rounded-lg font-medium hover:bg-navy/90 transition-colors group"
      >
        Let's talk
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
      
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
        Replies typically within 24 hours
      </div>
    </div>
  );
}
