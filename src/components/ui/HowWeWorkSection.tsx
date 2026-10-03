import { ClipboardList, Search, PhoneCall, CheckSquare } from "lucide-react";

export function HowWeWorkSection() {
  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6 text-navy" />,
      title: "1. Submit Request",
      desc: "Tell us about your academic needs via our consultation form."
    },
    {
      icon: <Search className="w-6 h-6 text-navy" />,
      title: "2. We Review",
      desc: "Our team reviews your requirements within 24 hours."
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-navy" />,
      title: "3. Discovery Call",
      desc: "A free consultation to discuss goals and expectations."
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-navy" />,
      title: "4. Tailored Plan",
      desc: "We provide a structured, customized support plan."
    }
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-4xl font-bold text-navy mb-4">How Our Consultation Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">A simple, transparent process designed to get you the exact support you need.</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6 relative z-10">
                {step.icon}
              </div>
              {/* Connector Line for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-gray-200 -z-0"></div>
              )}
              <h3 className="text-xl font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
