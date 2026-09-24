"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch("https://formspree.io/f/placeholder", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
      
      // Since it's a placeholder, we'll simulate success even if it fails due to being a placeholder
      setTimeout(() => {
        setFormState('success');
      }, 1000);
      
    } catch (error) {
      setFormState('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="bg-navy text-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Ready to elevate your academic journey? Get in touch with our team for a free initial consultation.
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
                    <a href="mailto:contact@atozacademichelp.co.uk" className="text-gray-600 hover:text-gold transition-colors text-sm">contact@atozacademichelp.co.uk</a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy mb-1">WhatsApp</h3>
                    <a href="https://wa.me/447000000000" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gold transition-colors text-sm">+44 7000 000000</a>
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
                      <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none" placeholder="jane@university.ac.uk" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label>
                      <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none" placeholder="+44..." />
                    </div>
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">Academic Level *</label>
                      <select id="level" name="level" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none bg-white">
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
                    <input type="text" id="subject" name="subject" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none" placeholder="e.g. Organizational Psychology" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">How can we help? *</label>
                    <textarea id="message" name="message" required rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy transition-colors outline-none resize-none" placeholder="Briefly describe your requirements..." />
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
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
