import { CheckCircle } from "lucide-react";

export function WhyUkSection() {
  const points = [
    "Direct experience within top UK universities",
    "Expertise in UK academic conventions & referencing (Harvard, APA-UK)",
    "Familiarity with UK dissertation and thesis methodology standards",
    "Deep understanding of UK university application and admission processes",
    "Strict adherence to UK academic integrity requirements (QAA guidelines)"
  ];

  return (
    <section className="py-16 bg-navy text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Why <span className="text-gold">UK-Focused?</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Our specialists bring localized expertise to ensure your academic work meets the rigorous and specific standards expected by UK institutions.
            </p>
          </div>
          <div className="md:w-2/3">
            <div className="grid sm:grid-cols-2 gap-4">
              {points.map((point, i) => (
                <div key={i} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/10">
                  <CheckCircle className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-200 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
