import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight, BookOpen, Search, GraduationCap, FileText, PenTool } from "lucide-react";

export const metadata: Metadata = {
  title: "Academic & Research Services",
  description: "Explore our range of academic support, research consulting, and PhD guidance services.",
};

const servicesList = [
  {
    title: "Academic Support",
    description: "Comprehensive assistance with coursework, essay structure, and critical analysis for all levels.",
    icon: <BookOpen className="w-8 h-8 text-gold" />,
    href: "/services/academic-support",
  },
  {
    title: "Research Support",
    description: "Expert guidance on research methodology, data analysis, and literature reviews.",
    icon: <Search className="w-8 h-8 text-gold" />,
    href: "/services/research-support",
  },
  {
    title: "PhD & Doctoral Support",
    description: "Specialized assistance for doctoral candidates including thesis structuring and Viva prep.",
    icon: <GraduationCap className="w-8 h-8 text-gold" />,
    href: "/services/phd-support",
  },
  {
    title: "Research Proposals",
    description: "End-to-end support for developing compelling and rigorous research proposals.",
    icon: <FileText className="w-8 h-8 text-gold" />,
    href: "/services/research-proposal",
  },
  {
    title: "University Applications",
    description: "Strategic advice and review for personal statements and admissions essays.",
    icon: <PenTool className="w-8 h-8 text-gold" />,
    href: "/services/university-application",
  }
];

export default function ServicesHubPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-navy text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">Our Services</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Professional academic guidance tailored to your specific course, research area, and educational level.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service) => (
            <Link 
              key={service.href} 
              href={service.href}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-navy/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold text-navy mb-4">{service.title}</h2>
              <p className="text-gray-600 mb-8 flex-grow">{service.description}</p>
              
              <div className="flex items-center text-navy font-semibold group-hover:text-gold transition-colors mt-auto">
                Explore Service
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
