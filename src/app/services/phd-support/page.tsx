import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RelatedServices } from "@/components/services/RelatedServices";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "PhD & Doctoral Support",
  description: "Specialized doctoral assistance including PhD proposals, conceptual frameworks, thesis editing, and Viva preparation.",
};

const features = [
  "PhD Topic & Proposal Development",
  "Conceptual Framework Construction",
  "Advanced Literature Review Synthesis",
  "Methodology & Paradigm Guidance",
  "Thesis Structure & Editing",
  "Viva Preparation & Mock Vivas",
  "Academic Publication Support"
];

export default function PhDSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-6">PhD & Doctoral Support</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            The doctoral journey is intellectually demanding and often isolating. Our specialized PhD consultants provide the rigorous academic mentorship required to excel at the highest level.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-navy mb-6">Navigating Your Doctorate</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Completing a PhD or DBA requires more than just hard work; it requires strategic alignment with academic standards, original contribution to knowledge, and a robust defense of your methodology.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are struggling to finalize your initial proposal, feeling stuck in the "messy middle" of data collection, or anxious about your upcoming Viva Voce, our doctoral consultants—all holding PhDs themselves—offer the bespoke, high-level guidance you need.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-navy mb-6">Doctoral Services</h3>
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

      {/* Related Services */}
      <div className="container mx-auto px-4 mt-20">
        <RelatedServices currentService="phd-support" />
      </div>
    </div>
  );
}
