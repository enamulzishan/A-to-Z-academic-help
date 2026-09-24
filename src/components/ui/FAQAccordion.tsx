"use client";

import { useState } from "react";
import { FAQ } from "@/data/faqs";
import { ChevronDown, Search } from "lucide-react";

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by category
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy sm:text-sm transition-shadow shadow-sm"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {Object.keys(groupedFaqs).length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No FAQs found matching your search.
        </div>
      )}

      {Object.entries(groupedFaqs).map(([category, items]) => (
        <div key={category} className="mb-12">
          <h3 className="text-2xl font-bold text-navy mb-6 pb-2 border-b border-gray-200">{category} Questions</h3>
          <div className="space-y-4">
            {items.map((faq) => {
              const isOpen = activeId === faq.id;
              return (
                <div key={faq.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-navy/30">
                  <button
                    onClick={() => setActiveId(isOpen ? null : faq.id)}
                    className="flex justify-between items-center w-full p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-semibold text-lg pr-8 ${isOpen ? "text-navy" : "text-gray-800"}`}>
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-navy" : "text-gray-400"}`} />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <p className="text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
