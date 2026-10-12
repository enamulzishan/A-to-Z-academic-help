"use client";

import { useState } from "react";
import { FileCheck, Download, Loader2 } from "lucide-react";

export function ChecklistDownloadSection() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    
    setFormState('loading');
    
    try {
      const payload = {
        email,
        form_name: "Free Research Proposal Checklist",
        form_type: "checklist",
        source_page: typeof window !== "undefined" ? window.location.pathname : "",
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit form");
      }
      
      // Trigger direct download
      const link = document.createElement('a');
      link.href = '/research-proposal-checklist.pdf';
      link.download = 'Research_Proposal_Checklist.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFormState('success');
    } catch (error) {
      setFormState('error');
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-navy rounded-2xl shadow-lg p-8 md:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left text-white">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gold/20 rounded-full mb-6">
                <FileCheck className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-3xl md:text-5xl font-bold font-heading mb-5 tracking-tight text-white">
                <span className="text-gold">Free</span> Research Proposal Checklist
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-0">
                Ensure your PhD or Master's proposal hits all the critical requirements before submission.
              </p>
            </div>

            {/* Form Content */}
            <div className="w-full md:w-96 flex-shrink-0 bg-white p-8 rounded-2xl shadow-xl">
              {formState === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-navy mb-2">Thank You!</h4>
                  <p className="text-sm text-gray-600">
                    Your download should start automatically. If it doesn't,{" "}
                    <a 
                      href="/research-proposal-checklist.pdf" 
                      download="Research_Proposal_Checklist.pdf"
                      className="text-gold hover:underline font-medium"
                    >
                      click here
                    </a>{" "}
                    to download directly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-colors text-navy placeholder-gray-400"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full bg-gold text-white font-bold py-3.5 rounded-xl hover:bg-gold/90 transition-colors shadow-sm flex items-center justify-center"
                  >
                    {formState === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Download Free Checklist"
                    )}
                  </button>
                  {formState === 'error' && (
                    <p className="text-xs text-red-500 text-center">Something went wrong. Try again.</p>
                  )}
                  <p className="text-xs text-center text-gray-500 mt-3 font-medium">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
