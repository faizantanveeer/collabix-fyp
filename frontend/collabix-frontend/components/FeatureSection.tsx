"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, BarChart } from "lucide-react"; // Using Lucide icons for modern look

export default function Features() {
  return (
    <section className="py-20 bg-[#0a0e17] text-white relative overflow-hidden">
      {/* Glowing Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a1f2e,#0a0e17)] opacity-80"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            Why <span className="">Collabix?</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-300 mt-3">
            We offer cutting-edge tools to make influencer marketing seamless.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group p-8 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-full mx-auto mb-6">
                <feature.icon size={32} className="text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-medium text-white mb-3 text-center">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-lg text-center">
                {feature.description}
              </p>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-transparent to-black/40 rounded-xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Data
const features = [
  {
    title: "Automated Matching",
    description:
      "Find the perfect influencers for your brand with AI-powered matchmaking.",
    icon: Sparkles,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track campaign performance with real-time insights and detailed reports.",
    icon: BarChart,
  },
  {
    title: "Secure Payments",
    description:
      "Effortlessly manage transactions with our trusted and secure payment system.",
    icon: ShieldCheck,
  },
];
