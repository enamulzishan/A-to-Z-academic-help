import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const legalPages = {
  "privacy-policy": { title: "Privacy Policy", lastUpdated: "September 2026" },
  "terms": { title: "Terms & Conditions", lastUpdated: "September 2026" },
  "cookie-policy": { title: "Cookie Policy", lastUpdated: "September 2026" },
  "refund-policy": { title: "Refund Policy", lastUpdated: "September 2026" },
  "academic-integrity": { title: "Academic Integrity Policy", lastUpdated: "September 2026" },
  "disclaimer": { title: "Disclaimer", lastUpdated: "September 2026" },
};

export async function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pageData = legalPages[params.slug as keyof typeof legalPages];
  if (!pageData) return { title: 'Not Found' };
  
  return {
    title: `${pageData.title} | A to Z Academic Help`,
  };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const pageData = legalPages[params.slug as keyof typeof legalPages];
  
  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">{pageData.title}</h1>
          <p className="text-gray-300">
            Last Updated: {pageData.lastUpdated}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-16">
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="italic bg-gray-50 p-6 rounded-lg border border-gray-100">
            This is a template page for the {pageData.title}. The official legal content will be provided by our legal team prior to launch.
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to A to Z Academic Help. This document sets out our {pageData.title.toLowerCase()}. Please read it carefully.
          </p>

          <h2>2. Scope</h2>
          <p>
            This policy applies to all services provided by A to Z Academic Help, including academic consulting, research support, and editing services.
          </p>
          
          <h2>3. Details</h2>
          <p>
            Detailed provisions regarding this policy will be inserted here.
          </p>

          <h2>4. Contact Us</h2>
          <p>
            If you have any questions about this policy, please contact us at <a href="mailto:legal@atozacademichelp.co.uk" className="text-navy font-semibold">legal@atozacademichelp.co.uk</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
