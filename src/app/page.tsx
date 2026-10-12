import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { LevelsInteractive } from "@/components/ui/LevelsInteractive";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { ChecklistDownloadSection } from "@/components/ui/ChecklistDownloadSection";
import { getAllPosts } from "@/lib/blog";
import { Hero } from "@/components/home/Hero";
import { TeamPreviewSection } from "@/components/ui/TeamPreviewSection";
import { HowWeWorkSection } from "@/components/ui/HowWeWorkSection";
import { CallToActionSection } from "@/components/ui/CallToActionSection";

import { getApprovedTestimonials } from "@/lib/data";

export default async function Home() {
  const latestPosts = getAllPosts().slice(0, 3);
  const testimonials = await getApprovedTestimonials();

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Levels Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy mb-4">Levels We Support</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Tailored academic assistance for every stage of your educational journey.</p>
          </div>
          <LevelsInteractive />
        </div>
      </section>

      {/* Services Grid (Quick Overview) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-navy mb-4">Our Expertise</h2>
              <p className="text-gray-600 max-w-2xl">Comprehensive academic consulting services.</p>
            </div>
            <Link href="/services" className="hidden md:flex items-center text-navy font-bold hover:text-gold transition-colors">
              View all services <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
              <BookOpen className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-bold text-navy mb-3">Academic Support</h3>
              <p className="text-gray-600 mb-6">Coursework, essays, and structuring guidance.</p>
              <Link href="/services/academic-support" className="text-navy font-semibold hover:text-gold inline-flex items-center">Learn more <ArrowRight className="w-4 h-4 ml-1"/></Link>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
              <BookOpen className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-bold text-navy mb-3">Research Proposals</h3>
              <p className="text-gray-600 mb-6">End-to-end support for developing compelling proposals.</p>
              <Link href="/services/research-proposal" className="text-navy font-semibold hover:text-gold inline-flex items-center">Learn more <ArrowRight className="w-4 h-4 ml-1"/></Link>
            </div>
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
              <BookOpen className="w-10 h-10 text-gold mb-6" />
              <h3 className="text-2xl font-bold text-navy mb-3">PhD Support</h3>
              <p className="text-gray-600 mb-6">Advanced methodologies and Viva preparation.</p>
              <Link href="/services/phd-support" className="text-navy font-semibold hover:text-gold inline-flex items-center">Learn more <ArrowRight className="w-4 h-4 ml-1"/></Link>
            </div>
          </div>
        </div>
      </section>

      <HowWeWorkSection />
      
      <TeamPreviewSection />

      {/* Testimonials (from Supabase - only approved ones) */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-navy mb-4">Student Success</h2>
              <p className="text-gray-600">Hear from those who have achieved their academic goals with us.</p>
            </div>
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>
      )}

      <ChecklistDownloadSection />

      {/* Latest Resources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-bold text-navy">Latest Insights</h2>
            <Link href="/resources" className="text-navy font-bold hover:text-gold flex items-center transition-colors">
              All articles <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map(post => (
              <Link key={post.slug} href={`/resources/${post.slug}`} className="group block border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6 h-full flex flex-col">
                  <span className="text-gold text-xs font-bold uppercase tracking-wider mb-3">{post.category}</span>
                  <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                  <div className="text-navy font-semibold text-sm flex items-center mt-auto">Read <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CallToActionSection />
    </div>
  );
}
