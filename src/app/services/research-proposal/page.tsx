import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Timeline } from "@/components/ui/Timeline";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { RelatedServices } from "@/components/services/RelatedServices";
import { ChecklistDownloadSection } from "@/components/ui/ChecklistDownloadSection";

export const metadata: Metadata = {
  title: "Research Proposal Writing Service",
  description: "End-to-end support for developing compelling, rigorous, and logically structured research proposals for Master's and PhD applications.",
};

export default function ResearchProposalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-6">Research Proposal Support</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            A strong research proposal is the foundation of any successful postgraduate application. We guide you through our proven 10-step process to ensure your proposal is academically rigorous and compelling.
          </p>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-3xl font-bold text-navy mb-6">Our 10-Point Proposal Process</h2>
            <p className="text-gray-600 mb-12 leading-relaxed text-lg">
              Crafting a research proposal is a meticulous process that requires clarity of thought, a deep understanding of the existing literature, and a precise methodological approach. Here is how we help you build it, step-by-step.
            </p>
            
            <Timeline />
          </div>

          {/* Sticky Sidebar Area */}
          <div className="w-full lg:w-1/3 relative">
            <div className="hidden lg:block">
              <StickyCTA />
            </div>
            {/* Mobile CTA */}
            <div className="lg:hidden mt-12">
              <StickyCTA />
            </div>
          </div>

        </div>
      </div>

      <ChecklistDownloadSection />

      {/* Related Services */}
      <div className="container mx-auto px-4">
        <RelatedServices currentService="research-proposal" />
      </div>
    </div>
  );
}
