import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Image src="/atoz-academic.png" alt="A to Z Academic Help" width={200} height={60} className="h-16 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              From Level 3 to PhD — We Support Your Academic Journey! Professional academic guidance, research support, and study assistance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-gold transition-colors">Our Services</Link></li>
              <li><Link href="/resources" className="hover:text-gold transition-colors">Academic Resources</Link></li>
              <li><Link href="/team" className="hover:text-gold transition-colors">Our Team</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/services/academic-support" className="hover:text-gold transition-colors">Academic Support</Link></li>
              <li><Link href="/services/research-support" className="hover:text-gold transition-colors">Research Support</Link></li>
              <li><Link href="/services/phd-support" className="hover:text-gold transition-colors">PhD & Doctoral Support</Link></li>
              <li><Link href="/services/research-proposal" className="hover:text-gold transition-colors">Research Proposals</Link></li>
              <li><Link href="/services/university-application" className="hover:text-gold transition-colors">University Applications</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                <a href="mailto:atozacademichelp@gmail.com" className="hover:text-gold transition-colors">atozacademichelp@gmail.com</a>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                <a href="https://wa.me/8801570234599" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">WhatsApp: 01570234599</a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                <span>United Kingdom</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {currentYear} A to Z Academic Help. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/legal/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="/legal/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/legal/academic-integrity" className="hover:text-white transition-colors">Academic Integrity</Link>
            <Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
