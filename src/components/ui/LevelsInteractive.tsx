"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const levelsData = [
  {
    id: "level3",
    title: "Level 3",
    description: "Foundation support, study skills, and basic academic writing guidance for college-level students transitioning to higher education."
  },
  {
    id: "undergrad",
    title: "Undergraduate",
    description: "Comprehensive assignment support, essay structure, critical analysis, and final year dissertation guidance."
  },
  {
    id: "masters",
    title: "Master's",
    description: "Advanced research skills, complex data analysis, comprehensive literature reviews, and master's dissertation support."
  },
  {
    id: "mres",
    title: "MRes / MPhil",
    description: "Specialized research methodology training, advanced literature synthesis, and preparation for doctoral studies."
  },
  {
    id: "phd",
    title: "PhD / DBA",
    description: "Doctoral research proposals, conceptual frameworks, methodology guidance, thesis structuring, and Viva preparation."
  }
];

export function LevelsInteractive() {
  const [activeLevel, setActiveLevel] = useState<string | null>("undergrad");

  return (
    <div className="w-full max-w-4xl mx-auto my-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 bg-navy text-white text-center">
        <h3 className="text-2xl font-semibold mb-2">Levels We Support</h3>
        <p className="text-gray-300">Click a level to see how we can help you</p>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar / Stages */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
          {levelsData.map((level) => (
            <button
              key={level.id}
              onClick={() => setActiveLevel(level.id)}
              className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
                activeLevel === level.id 
                  ? "bg-white border-l-4 border-gold text-navy font-semibold shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-navy border-l-4 border-transparent"
              }`}
            >
              <span>{level.title}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeLevel === level.id ? "-rotate-90 md:rotate-0" : ""}`} />
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="w-full md:w-2/3 p-8 flex items-center min-h-[200px]">
          {levelsData.map((level) => (
            activeLevel === level.id && (
              <div key={level.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-xl font-semibold text-navy mb-3">{level.title} Support</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {level.description}
                </p>
                <div className="mt-6">
                  <a href="/contact" className="inline-block px-5 py-2.5 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-medium">
                    Get {level.title} Support
                  </a>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
