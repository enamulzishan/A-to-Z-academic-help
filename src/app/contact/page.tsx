"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SecureBadge } from "@/components/ui/SecureBadge";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const payload = {
        form_type: "contact",
        full_name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        academic_level: formData.get("level"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        source_page: typeof window !== "undefined" ? window.location.pathname : "/contact",
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormState('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">Book a Free Consultation</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Tell us about your academic needs. Our team will review your requirements and get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
              <h2 className="text-2xl font-bold text-navy mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy mb-1">Email Us</h3>
                    <a href="mailto:atozacademichelp@gmail.com" className="text-gray-600 hover:text-gold transition-colors text-sm">atozacademichelp@gmail.com</a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy mb-1">WhatsApp</h3>
                    <a href="https://wa.me/8801570234599" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gold transition-colors text-sm">01570234599</a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy mb-1">Location</h3>
                    <p className="text-gray-600 text-sm">United Kingdom<br/>(Online Consultations Globally)</p>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-navy mb-4">Follow Us</h3>
                  <div className="flex items-center space-x-4">
                    {/* TODO: Add actual Facebook URL */}
                    <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white hover:bg-gold transition-colors shadow-sm" aria-label="Facebook">
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    {/* TODO: Add actual Instagram URL */}
                    <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white hover:bg-gold transition-colors shadow-sm" aria-label="Instagram">
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    {/* TODO: Add actual LinkedIn URL */}
                    <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white hover:bg-gold transition-colors shadow-sm" aria-label="LinkedIn">
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {formState === 'success' ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-8">Thank you for reaching out. One of our academic consultants will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setFormState('idle')}
                    className="px-6 py-2 border border-gray-200 rounded-lg text-navy font-medium hover:bg-gray-50 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none placeholder:text-gray-500 text-gray-900" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none placeholder:text-gray-500 text-gray-900" placeholder="jane@university.ac.uk" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label>
                      <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none placeholder:text-gray-500 text-gray-900" placeholder="+44..." />
                    </div>
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">Academic Level *</label>
                      <select id="level" name="level" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none bg-white placeholder:text-gray-500 text-gray-900">
                        <option value="">Select Level</option>
                        <option value="Level 3">Level 3 / Foundation</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Masters">Master's / MRes</option>
                        <option value="PhD">PhD / DBA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject / Research Area</label>
                    <input type="text" id="subject" name="subject" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none placeholder:text-gray-500 text-gray-900" placeholder="e.g. Organizational Psychology" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">How can we help? *</label>
                    <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none resize-none placeholder:text-gray-500 text-gray-900" placeholder="Briefly describe your requirements..." />
                  </div>

                  {formState === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                      There was an error sending your message. Please try again or email us directly.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={formState === 'loading'}
                    className="w-full bg-navy text-white font-bold py-4 rounded-lg hover:bg-navy/90 transition-colors shadow-sm flex items-center justify-center"
                  >
                    {formState === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                  <div className="flex justify-center mt-6">
                    <SecureBadge />
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
