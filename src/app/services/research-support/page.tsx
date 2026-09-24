import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LevelsInteractive } from "@/components/ui/LevelsInteractive";
import { RelatedServices } from "@/components/services/RelatedServices";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Support Services",
  description: "Expert guidance on research methodology, data analysis, literature reviews, and thesis structuring.",
};

const features = [
  "Research Topic Development",
  "Research Questions & Hypotheses",
  "Literature Review Guidance",
  "Research Methodology Selection",
  "Data Analysis Guidance (SPSS, NVivo, etc.)",
  "Research Design & Frameworks"
];

export default function ResearchSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-6">Research Support</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Navigate the complexities of academic research with confidence. We provide methodological expertise and strategic guidance for dissertations and independent research projects.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-navy mb-6">Mastering Your Methodology</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Conducting original research can be an overwhelming process. Many students struggle with narrowing down a viable topic, selecting the appropriate methodology, or synthesizing vast amounts of literature.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our research support consultants are experienced academics who can help you design a robust study. From qualitative interviews to quantitative surveys, we ensure your research design is sound, ethical, and capable of answering your core research questions.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-navy mb-6">Areas of Expertise</h3>
            <ul className="space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-gold mr-3 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Levels Component */}
      <div className="container mx-auto px-4 mt-20">
        <LevelsInteractive />
      </div>

      {/* Related Services */}
      <div className="container mx-auto px-4">
        <RelatedServices currentService="research-support" />
      </div>
    </div>
  );
}
