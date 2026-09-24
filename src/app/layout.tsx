import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppWidget } from "@/components/ui/WhatsAppWidget";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { LeadCaptureModal } from "@/components/ui/LeadCaptureModal";
import { CalendlyModal } from "@/components/ui/CalendlyModal";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | A to Z Academic Help",
    default: "A to Z Academic Help | Academic & Research Support",
  },
  description: "A to Z Academic Help provides professional academic support to students, researchers and prospective postgraduate applicants. From Level 3 to PhD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow pt-[72px]">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
        <CookieBanner />
        <LeadCaptureModal />
        <Suspense fallback={null}>
          <CalendlyModal />
        </Suspense>
      </body>
    </html>
  );
}
