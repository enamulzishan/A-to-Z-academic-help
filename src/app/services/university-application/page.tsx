import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RelatedServices } from "@/components/services/RelatedServices";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "University Application Support",
  description: "Strategic advice, review, and editing for personal statements and admissions essays for UK universities.",
};

const features = [
  "Personal Statement Review & Editing",
  "Course Selection Strategy",
  "Admissions Essay Structuring",
  "CV / Resume Formatting for Academia",
  "Interview Preparation",
  "Postgraduate Application Strategy"
];

export default function ApplicationSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-bold mt-8 mb-6">University Application Support</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            Stand out in a competitive applicant pool. We help you articulate your academic journey and future ambitions to secure your place at top-tier institutions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-navy mb-6">Crafting a Compelling Narrative</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your grades only tell part of the story. Admissions committees are looking for passion, intellectual curiosity, and a clear fit for their programs. Your personal statement or admissions essay is your opportunity to demonstrate these qualities.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our consultants help you identify your unique strengths and weave them into a persuasive narrative. We ensure your application materials are professional, articulate, and tailored to the specific expectations of UK universities.
            </p>
          </div>
          <div className="w-full md:w-1/2 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-navy mb-6">Application Assistance</h3>
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
        <RelatedServices currentService="university-application" />
      </div>
    </div>
  );
}
