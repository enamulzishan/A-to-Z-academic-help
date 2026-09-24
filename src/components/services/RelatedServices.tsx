import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedServicesProps {
  currentService: string;
}

const services = [
  { id: "academic-support", title: "Academic Support", desc: "Coursework and essay guidance", href: "/services/academic-support" },
  { id: "research-support", title: "Research Support", desc: "Comprehensive research assistance", href: "/services/research-support" },
  { id: "phd-support", title: "PhD Support", desc: "Doctoral level guidance", href: "/services/phd-support" },
  { id: "university-application", title: "University Applications", desc: "Personal statements & admissions", href: "/services/university-application" },
  { id: "research-proposal", title: "Research Proposals", desc: "Proposal structuring and ideation", href: "/services/research-proposal" },
];

export function RelatedServices({ currentService }: RelatedServicesProps) {
  const related = services.filter((s) => s.id !== currentService).slice(0, 3);

  return (
    <section className="py-16 bg-light-grey rounded-2xl my-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-navy mb-8 text-center">Explore Related Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((service) => (
            <Link 
              key={service.id} 
              href={service.href}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group flex flex-col"
            >
              <h4 className="text-lg font-semibold text-navy mb-2 group-hover:text-gold transition-colors">{service.title}</h4>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{service.desc}</p>
              <div className="flex items-center text-navy font-medium text-sm">
                Learn more
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
