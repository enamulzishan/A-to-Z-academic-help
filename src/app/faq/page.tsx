import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { getFAQs } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Frequently Asked Questions | A to Z Academic Help",
  description: "Find answers to common questions about our academic support, research consulting, PhD guidance, and payment processes.",
};

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 text-center md:text-left">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300 max-w-2xl text-center md:text-left">
            Everything you need to know about how our academic consultancy works.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-10">
        <FAQAccordion faqs={faqs} />
      </div>
    </div>
  );
}
