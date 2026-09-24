"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface TimelineStep {
  title: string;
  description: string;
}

const steps: TimelineStep[] = [
  { title: "Topic Ideation", description: "Brainstorming and refining a research topic that is original, feasible, and impactful." },
  { title: "Literature Review", description: "Identifying key gaps in existing research to justify your study." },
  { title: "Research Questions", description: "Formulating clear, measurable, and focused research questions or hypotheses." },
  { title: "Methodology Selection", description: "Choosing between qualitative, quantitative, or mixed methods approaches." },
  { title: "Data Collection Strategy", description: "Designing surveys, interview guides, or identifying secondary data sources." },
  { title: "Data Analysis Plan", description: "Outlining the statistical or thematic analysis techniques to be used." },
  { title: "Ethical Considerations", description: "Addressing potential ethical issues and ensuring compliance with university standards." },
  { title: "Timeline & Budget", description: "Creating a realistic project plan with milestones and resource allocation." },
  { title: "Structuring the Proposal", description: "Organizing the content logically according to your university's guidelines." },
  { title: "Review & Refinement", description: "Proofreading, editing, and ensuring academic rigor before submission." },
];

export function Timeline() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleSteps((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative py-8">
      {/* Vertical Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2" />

      <div className="space-y-12 relative">
        {steps.map((step, index) => {
          const isVisible = visibleSteps.includes(index);
          const isEven = index % 2 === 0;

          return (
            <div
              key={index}
              ref={(el) => { stepRefs.current[index] = el; }}
              data-index={index}
              className={`flex flex-col md:flex-row items-start md:items-center w-full transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Desktop Left Side */}
              <div className={`hidden md:block w-1/2 pr-12 text-right ${!isEven ? "md:order-1 opacity-0" : ""}`}>
                {isEven && (
                  <div>
                    <h4 className="text-xl font-semibold text-navy mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                )}
              </div>

              {/* Center Node */}
              <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white z-10 transition-colors duration-500 ${
                isVisible ? "bg-gold text-white" : "bg-gray-200 text-transparent"
              }`}>
                {isVisible ? <CheckCircle2 className="w-5 h-5" /> : <span className="w-3 h-3 rounded-full bg-gray-400" />}
              </div>

              {/* Desktop Right Side / Mobile Content */}
              <div className={`w-full md:w-1/2 pl-20 md:pl-12 ${isEven ? "md:opacity-0" : ""}`}>
                {(!isEven || true) && (
                  <div className={isEven ? "md:hidden" : ""}>
                    <h4 className="text-xl font-semibold text-navy mb-2">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
