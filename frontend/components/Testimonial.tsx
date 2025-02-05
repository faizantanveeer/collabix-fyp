"use client";

import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="relative py-24">
      {/* Soft Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9fafb] to-[#eaeef3]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 mt-3">
            Real stories from businesses and influencers who found success with
            Collabix.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Featured Testimonial - Larger */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-3 bg-white p-10 rounded-3xl shadow-xl border border-gray-200"
          >
            <p className="text-xl text-gray-700 leading-relaxed">
              “Collabix transformed how we work with influencers. The engagement
              and ROI have skyrocketed!”
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Anna Lee"
                className="w-12 h-12 rounded-full border-2 border-gray-300"
              />
              <div>
                <div className="text-gray-900 font-semibold">Anna Lee</div>
                <div className="text-gray-500 text-sm">
                  Marketing Director, TechSolutions
                </div>
              </div>
            </div>
          </motion.div>

          {/* Smaller Testimonials - Right Side */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <p className="text-gray-700">"{testimonial.feedback}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                  <div>
                    <div className="text-gray-900 font-medium">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Data
const testimonials = [
  {
    name: "Mark Smith",
    role: "Influencer",
    feedback:
      "This platform made influencer collaborations incredibly easy. The results speak for themselves!",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Sophia Martinez",
    role: "Founder, Trendy Apparel",
    feedback:
      "Collabix changed the way we approach influencer marketing. The impact on our brand has been incredible!",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
  },
];
