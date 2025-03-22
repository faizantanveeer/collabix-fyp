import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Features from "./FeatureSection";
import Testimonials from "./Testimonial";
import Hero from "./Hero";
import Chatbot from "@/components/Chatbot";

const LandingPage = () => {
  const [showScrollEffect, setShowScrollEffect] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollEffect(true);
      } else {
        setShowScrollEffect(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Hero />

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 text-gray-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium mb-6">How Collabix Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A seamless experience for businesses and influencers to connect and
            grow together.
          </p>
        </div>
        <div className="flex flex-wrap justify-center text-center gap-10 max-w-6xl mx-auto">
          <div className="p-8 max-w-xs   rounded-xl hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl">
            <h3 className="text-2xl font-medium mb-4">
              <DotLottieReact
                src="https://lottie.host/e05177fa-bf74-4df5-8f80-e1b2c46c958f/Yj6H8n1Qhw.lottie"
                loop
                autoplay
              />
              1. Create Your Profile
            </h3>
            <p className="text-gray-600 text-lg">
              Set up your brand or influencer profile and start discovering
              opportunities.
            </p>
          </div>
          <div className="p-8 max-w-xs  rounded-xl shadow-sm hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl">
            <h3 className="text-2xl font-medium mb-4">
              <DotLottieReact
                src="https://lottie.host/822bc22e-f82a-40eb-b6d4-1aa483ec1246/5WbnKYPWhi.lottie"
                loop
                autoplay
              />
              2. Find Your Match
            </h3>
            <p className="text-gray-600 text-lg">
              Browse and connect with influencers or businesses that match your
              needs.
            </p>
          </div>
          <div className="p-8 max-w-xs rounded-xl shadow-sm hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl">
            <h3 className="text-2xl font-medium mb-4">
              {" "}
              <DotLottieReact
                src="https://lottie.host/3077b293-b356-4237-be6a-a0fd954b12b7/R4hef8eS6k.lottie"
                loop
                autoplay
              />
              3. Start Collaborating
            </h3>
            <p className="text-gray-600 text-lg">
              Execute campaigns with influencers and track performance
              seamlessly.
            </p>
          </div>
        </div>
      </section>

      <Features />

      <Testimonials />

      {/* Call to Action Section */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight">
          Where Collaboration Meets Impact.
        </h1>
        <Link href="/signup">
          <button
            type="submit"
            className="text-gray-900 flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-gray-900 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
          >
            Get Started
            <svg
              className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
              viewBox="0 0 16 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                className="fill-gray-800 group-hover:fill-gray-800"
              ></path>
            </svg>
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-white text-center">
        <p>&copy; 2025 Collabix. All Rights Reserved.</p>
        <div className="mt-4 gap-7 flex items-center justify-center">
          <Link href="/contact" className="mr-4 hover:text-gray-400">
            Influencer
          </Link>

          <Link href="/dashboard" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link href="/contact" className="mr-4 hover:text-gray-400">
            Contact
          </Link>
          <Link href="/about" className="hover:text-gray-400">
            About
          </Link>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default LandingPage;
