import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LevelsInteractive } from "@/components/ui/LevelsInteractive";
import { RelatedServices } from "@/components/services/RelatedServices";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Academic Support Services",
  description: "Comprehensive assignment support, essay structure, critical analysis, and proofreading for all academic levels.",
};

const features = [
  "Assignments & Coursework Guidance",
  "Academic Writing Support",
  "Essay Structure & Development",
  "Proofreading & Editing",
  "Referencing & Formatting (Harvard, APA, MLA, etc.)",
  "Academic Skills Development"
];

export default function AcademicSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-6">Academic Support</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Elevate your academic performance with our expert guidance. From structuring complex essays to mastering academic tone, we help you achieve your full potential.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-navy mb-6">How We Can Help</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our academic support service is designed to bridge the gap between your current grades and your target achievements. We provide personalized, constructive feedback on your academic writing, ensuring you understand not just how to improve a specific assignment, but how to become a better academic writer overall.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're struggling with critical analysis, losing marks on referencing, or just need a professional eye to review your final draft, our consultants are here to support you.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-navy mb-6">What's Included</h3>
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
        <RelatedServices currentService="academic-support" />
      </div>
    </div>
  );
}
