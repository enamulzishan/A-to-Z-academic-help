"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="bg-navy text-white pt-20 pb-32 relative overflow-hidden">
      {/* Decorative background element with subtle floating animation */}
      <motion.div 
        className="absolute top-0 right-0 w-1/2 h-full bg-[#C9A227]/10 blur-3xl rounded-full"
        animate={shouldReduceMotion ? { opacity: 1 } : {
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ translateX: '33%', translateY: '-25%' }}
      />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          className="max-w-3xl text-center mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A227] to-yellow-400 drop-shadow-md">A to Z</span>
            <span className="text-white drop-shadow-sm"> Academic Help</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed"
          >
            From Level 3 to PhD — We Support Your Academic Journey with professional guidance, research support, and expert editing.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-medium text-gray-400 justify-items-center w-full mb-12"
          >
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-[#C9A227] mr-2 flex-shrink-0" />
              <span>Level 3 to PhD</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-[#C9A227] mr-2 flex-shrink-0" />
              <span>Research Guidance</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-[#C9A227] mr-2 flex-shrink-0" />
              <span>Academic Editing</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-[#C9A227] mr-2 flex-shrink-0" />
              <span>UK Specialists</span>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full"
          >
            <Link 
              href="/services" 
              className="bg-[#C9A227] text-white font-bold py-4 px-8 rounded-lg hover:bg-[#b08d22] transition-colors shadow-lg text-center"
            >
              Explore Services
            </Link>
            <Link 
              href="?book=true" 
              className="bg-white/10 text-white font-bold py-4 px-8 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm text-center border border-white/20"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
