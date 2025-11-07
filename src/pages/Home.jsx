// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import {
  Code,
  Database,
  Cloud,
  Smartphone,
  ChevronLeft,
  ArrowRight,
  Layout,
  Settings,
  ChevronRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import Layouts from "../Components/Layout";

const services = [
  {
    icon: Layout,
    title: "Website Design & Development",
    description:
      "Transform your digital presence with cutting-edge, responsive websites...",
    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Modern UI/UX"],
    color: "from-green-400 to-green-600",
    link: "/services/website-designing",
    ctaLink: "/contact",
  },
  {
    icon: Settings,
    title: "Custom CRM Solutions",
    description:
      "Empower your business with tailored CRM systems...",
    features: ["Sales Automation", "Customer Analytics", "Integration Ready", "Scalable Architecture"],
    color: "from-green-500 to-green-700",
    link: "/services/crm-development",
    ctaLink: "/contact",
  },
  {
    icon: Smartphone,
    title: "Mobile & Web Applications",
    description:
      "Build powerful, feature-rich applications...",
    features: ["Cross-Platform", "Native Performance", "Secure & Reliable", "Cloud Integration"],
    color: "from-green-400 to-green-600",
    link: "/services/application-development",
    ctaLink: "/contact",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure Management",
    description:
      "Leverage enterprise-grade cloud solutions…",
    features: ["Auto-Scaling", "High Availability", "Cost Optimization", "24/7 Monitoring"],
    color: "from-green-500 to-green-700",
    link: "/services/cloud-management",
    ctaLink: "/contact",
  },
  {
    icon: Database,
    title: "Database Architecture & Management",
    description:
      "Ensure your data is secure, accessible, and optimized...",
    features: ["Data Security", "Performance Tuning", "Backup & Recovery", "Migration Services"],
    color: "from-green-400 to-green-600",
    link: "/services/database-management",
    ctaLink: "/contact",
  },
  {
    icon: Code,
    title: "AWS Cloud Services",
    description:
      "Harness the full power of Amazon Web Services...",
    features: ["Cloud Migration", "Serverless Solutions", "DevOps Integration", "Cost Management"],
    color: "from-green-500 to-green-700",
    link: "/services/aws-services",
    ctaLink: "/contact",
  },
];

export default function AbaccoLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentService = services[currentSlide];
  const Icon = currentService.icon;
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % services.length);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (isAnimating) return;
    setDirection("right");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
      setIsAnimating(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection("left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
      setIsAnimating(false);
    }, 500);
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === currentSlide) return;
    setDirection(index > currentSlide ? "right" : "left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Layouts>
      <div className="min-h-screen text-white overflow-hidden  py-20">
        {/* Animated Background */}
        {/* <div className="fixed inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div> */}

        <div className="relative z-10">
          {/* Hero Section */}
          <div className="container mx-auto px-6 pt-15 pb-15">
            <div className={`text-center transition-all duration-700`}>
              <div className="w-full flex justify-center mb-6">
                <div className="relative h-42 w-32 flex items-center justify-center">
                  {/* Rotating dots circle 1 */}
                  <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: "3s" }}>
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="rgba(19, 236, 99, 0.71)"
                      strokeWidth="3"
                      strokeDasharray="2 8"
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Rotating dots circle 2 - opposite direction */}
                  <svg className="absolute inset-0 w-full h-full" style={{ animation: "spin 16s linear infinite reverse" }}>
                    <circle
                      cx="50%"
                      cy="50%"
                      r="35%"
                      fill="none"
                      stroke="rgba(1, 255, 94, 0.7)"
                      strokeWidth="3"
                      strokeDasharray="2 8"
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                  
                  {/* Static image */}
                  <img
                    src="/Logo/icon.png"
                    alt=""
                    className="relative z-10 h-42 w-32 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              <div className="inline-block mb-6">
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-green-600/20 px-6 py-3 rounded-full border border-green-500/30">
                  <Zap className="w-5 h-5 text-[#019101]" />
                  <span className="text-sm font-medium text-gray-300">
                    Powering Digital Innovation
                  </span>
                </div>
              </div>

              <h1 className="text-sm md:text-8xl font-bold mb-8 py-5 text-white">
                <span className="text-green-500">Abacco</span> Technology
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                Ransforming businesses with modern digital solutions from high
                performance websites to intelligent cloud and CRM platforms
                tailored to your growth.
              </p>
              {/* <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transforming businesses through cutting-edge technology solutions and innovative digital experiences
            </p> */}
            </div>
          </div>
        </div>

        <div className="">
          {/* Main Service Display */}
          <div className="min-h-screen  py-10">
            {/* Header Section */}
            <div className="container mx-auto px-6 mb-10">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Our Services
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Comprehensive technology solutions designed to elevate your
                  business and drive measurable results
                </p>
              </div>
            </div>

            {/* Main Service Display */}
            <div className="container mx-auto px-6 pb-20">
              <div className="max-w-6xl mx-auto relative">
                {/* Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 group"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 group"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Service Card with Slide Animation */}
                <div className="overflow-hidden">
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isAnimating
                        ? direction === "right"
                          ? "opacity-0 transform -translate-x-20 scale-95"
                          : "opacity-0 transform translate-x-20 scale-95"
                        : "opacity-100 transform translate-x-0 scale-100"
                    }`}
                  >
                    <div className=" backdrop-blur-xl rounded-3xl p-4 md:p-12 border border-green-500/20 shadow-2xl">
                      <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                        {/* Icon Section */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br ${currentService.color} flex items-center justify-center shadow-2xl shadow-green-500/30 transform hover:scale-105 hover:rotate-3 transition-all duration-300`}
                          >
                            <Icon
                              className="w-16 h-16 md:w-20 md:h-20 text-white"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 text-center lg:text-left">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
                            {currentService.title}
                          </h2>

                          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                            {currentService.description}
                          </p>

                          {/* Features Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-8">
                            {currentService.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-gray-400"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-sm md:text-base">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                              href={currentService.ctaLink}
                              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                            >
                              <span>Get Started</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <a
                              href={currentService.link}
                              className="inline-flex items-center justify-center gap-3 bg-gray-700/50 border border-gray-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
                            >
                              <span>Learn More</span>
                            </a>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empowering Businesses Section */}
          <section className="text-white py-16 sm:py-24 lg:py-32 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute bottom-20 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-7xl mx-auto">
                
                {/* Left Content */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fadeInLeft">
                  <h1 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                    Empowering Businesses with{" "}
                    <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-transparent bg-clip-text">
                      Smart Digital Solutions
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl">
                    At Abacco Technology, we design, develop, and deliver powerful digital tools —
                    from dynamic websites to enterprise-grade CRMs, cloud systems, and custom
                    applications. Our mission is simple: to make technology work seamlessly for your
                    business. Backed by modern technology and a customer-first approach, we help
                    businesses innovate faster, operate smarter, and scale with confidence.
                  </p>
                </div>

                {/* Right Image */}
                <div className="relative animate-fadeInRight flex justify-center">
                  <div className="relative group w-full max-w-md md:max-w-lg lg:max-w-xl">
                    
                    {/* Glow layer */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                    {/* Image box */}
                    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-gray-700/50 group-hover:border-green-500/50 transition-all duration-500 group-hover:scale-[1.02]">
                      <img
                        src="/Logo/empowering .png"  // ✅ remove space from filename!
                        alt="Team collaboration"
                        className="w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-105 object-cover"
                      />

                      {/* Floating Support Card */}
                      <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-xl p-3 sm:p-4 shadow-xl animate-float">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-white">Live Support</p>
                            <p className="text-[10px] sm:text-xs text-gray-400">24/7 Available</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Card */}
                      <div className="absolute -top-6 -right-4 sm:-right-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 sm:p-4 shadow-xl animate-float" style={{ animationDelay: "0.5s" }}>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">500+</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-green-100">Projects Delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animations */}
            <style jsx>{`
              @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px);} to { opacity: 1; transform: translateX(0);} }
              @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px);} to { opacity: 1; transform: translateX(0);} }
              @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
              .animate-fadeInLeft { animation: fadeInLeft .8s ease-out; }
              .animate-fadeInRight { animation: fadeInRight .8s ease-out; }
              .animate-float { animation: float 3s ease-in-out infinite; }
            `}</style>
          </section>


          {/* Stats Section */}
          <div className="container mx-auto px-6 mt-15 pb-30">
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-700 delay-200`}
            >
              <div className="text-center p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-2xl border border-green-500/10 hover:border-green-500/30 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-green-500 mb-2">
                  100%
                </div>
                <div className="text-gray-400">Secure Solutions</div>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-2xl border border-green-500/10 hover:border-green-500/30 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-green-500 mb-2">
                  500+
                </div>
                <div className="text-gray-400">Projects Delivered</div>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg rounded-2xl border border-green-500/10 hover:border-green-500/30 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-green-500 mb-2">
                  24/7
                </div>
                <div className="text-gray-400">Expert Support</div>
              </div>
            </div>
          </div>

          {/* Get Started Today */}
          <div className="container mx-auto px-6 pb-20">
            <div
              className={`max-w-4xl mx-auto text-center transition-all duration-700 delay-300`}
            >
              <div className="bg-gradient-to-r from-[#019101] to-green-600 rounded-3xl p-12 shadow-2xl shadow-green-500/30">
                <h3 className="text-4xl font-bold mb-4">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-xl text-green-50 mb-8">
                  Let's build something extraordinary together
                </p>
                <button  className="bg-white text-[#019101] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  <a href="/contact">Get Started Today</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}
