import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us | A to Z Academic Help",
  description: "Learn about our mission, our team of academic consultants, and our approach to supporting your educational journey.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">About Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            We are a network of dedicated academics committed to elevating your research and educational outcomes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-navy mb-6">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            At A to Z Academic Help, our mission is simple: to provide rigorous, ethical, and highly personalized academic support to students and researchers worldwide. We believe that with the right guidance, every student can achieve their full potential.
          </p>

          <h2 className="text-3xl font-bold text-navy mb-6">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            We are not an essay mill. We are a consultancy of experienced academics—PhDs, postdocs, and former university lecturers—who understand the demands of higher education in the UK and internationally. We specialize in research methodologies, structuring complex arguments, and academic editing.
          </p>

          <h2 className="text-3xl font-bold text-navy mb-6">Our Approach</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-4 mb-8">
            <li><strong>Ethical Guidance:</strong> We adhere strictly to academic integrity policies. We do not write papers for students; we teach you how to write better papers yourself.</li>
            <li><strong>Personalized Matching:</strong> We match you with a consultant whose expertise aligns perfectly with your specific subject area and methodological needs.</li>
            <li><strong>Constructive Feedback:</strong> Our reviews go beyond basic proofreading. We provide detailed, actionable feedback designed to improve your critical thinking and academic voice.</li>
          </ul>

          <h2 className="text-3xl font-bold text-navy mb-6">Why Choose Us?</h2>
          <p className="text-gray-600 leading-relaxed">
            Whether you are an undergraduate struggling with your first dissertation, or a DBA candidate preparing for your Viva, we offer a tailored, supportive environment to help you succeed.
          </p>
        </div>
      </div>
    </div>
  );
}
