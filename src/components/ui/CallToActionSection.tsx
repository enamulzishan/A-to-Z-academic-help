import Link from "next/link";
import { SecureBadge } from "./SecureBadge";

export function CallToActionSection() {
  return (
    <section className="py-24 bg-navy text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Book a Free Consultation</h2>
        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          Tell us about your academic needs. Our team will review your requirements and get back to you within 24 hours.
        </p>
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <Link 
            href="/contact" 
            className="bg-gold text-white font-bold py-4 px-10 rounded-xl hover:bg-gold/90 transition-colors shadow-lg text-lg w-full sm:w-auto"
          >
            Book a Free Consultation
          </Link>
          <SecureBadge className="bg-white/10 border-white/20 text-gray-300" />
        </div>
      </div>
    </section>
  );
}
