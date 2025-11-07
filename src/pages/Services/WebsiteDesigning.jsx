import React from "react";
import {
  Building,
  ShoppingCart,
  Briefcase,
  TrendingUp,
  Smartphone,
  Zap,
  Shield,
  Settings,
  Clock,
  DollarSign,
  ArrowRight,
  Check,
} from "lucide-react";
import Layouts from "../../Components/Layout";
export default function WebsiteDesignPage() {
  return (
    <Layouts>
    <div className="text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-6 text-center">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div> */}
        <div className="relative z-10 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Premium <span className="text-green-500">Website Designing</span> Services
            </h1>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
                Your website is more than just a screen — it’s your digital identity. We build 
                responsive, fast-loading, and visually engaging websites that reflect your brand 
                and convert visitors into loyal customers.
            </p>

            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed mt-4">
                Elevate your online presence with immersive design, smooth user experience, 
                and conversion-focused strategies tailored to grow your business.
            </p>
        </div>

        
      </section>

      {/* Features Section */}
      <section className=" ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            What We <span className="text-green-500">Offer</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Comprehensive web solutions tailored to your business needs
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Building className="w-10 h-10" />,
                title: "Corporate Websites",
                desc: "Professional company websites to build your brand online.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: <ShoppingCart className="w-10 h-10" />,
                title: "E-commerce Stores",
                desc: "High-conversion online stores that boost your sales.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: <Briefcase className="w-10 h-10" />,
                title: "Portfolios & Landing Pages",
                desc: "Personal & business portfolios designed to impress.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: "SEO & Analytics",
                desc: "SEO-ready builds with analytics integration for growth insights.",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative  backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10">
                  <div className="text-green-500 mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections for Each Service */}

      {/* Corporate Websites Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl mr-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold">Corporate Websites</h2>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Establish your company's online presence with a professional,
                sleek corporate website that communicates trust and authority.
                Perfect for businesses looking to showcase their services, team,
                and values.
              </p>
              <ul className="space-y-3">
                {[
                  "Custom brand-aligned design",
                  "Multi-page architecture",
                  "Contact forms & CRM integration",
                  "Team & service showcases",
                  "Client testimonials section",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-300 group hover:text-green-400 transition-colors"
                  >
                    <Check className="w-5 h-5 text-green-500 mr-3 group-hover:scale-125 transition-transform" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl p-8 border border-green-500/30 hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30">
              <div className="aspect-video bg-gray-900/50 rounded-xl flex items-center justify-center border border-gray-700">
                <Building className="w-20 h-20 text-green-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-commerce Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl p-8 border border-green-500/30 hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30">
              <div className="aspect-video bg-gray-900/50 rounded-xl flex items-center justify-center border border-gray-700">
                <ShoppingCart className="w-20 h-20 text-green-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl mr-4">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold">E-commerce Stores</h2>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Launch your online store with powerful e-commerce solutions
                designed to convert visitors into customers. From product
                showcases to secure checkout, we build stores that sell.
              </p>
              <ul className="space-y-3">
                {[
                  "Shopping cart & checkout systems",
                  "Payment gateway integration",
                  "Inventory management",
                  "Product filtering & search",
                  "Order tracking & customer accounts",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-300 group hover:text-green-400 transition-colors"
                  >
                    <Check className="w-5 h-5 text-green-500 mr-3 group-hover:scale-125 transition-transform" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio & Landing Pages Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl mr-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold">
                  Portfolios & Landing Pages
                </h2>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Make a lasting impression with stunning portfolio websites and
                high-converting landing pages. Showcase your work, capture
                leads, and tell your story beautifully.
              </p>
              <ul className="space-y-3">
                {[
                  "Visual project galleries",
                  "Single-page scroll designs",
                  "Lead capture forms",
                  "Social media integration",
                  "Downloadable resume/portfolio",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-300 group hover:text-green-400 transition-colors"
                  >
                    <Check className="w-5 h-5 text-green-500 mr-3 group-hover:scale-125 transition-transform" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl p-8 border border-green-500/30 hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30">
              <div className="aspect-video bg-gray-900/50 rounded-xl flex items-center justify-center border border-gray-700">
                <Briefcase className="w-20 h-20 text-green-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & Analytics Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl p-8 border border-green-500/30 hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30">
              <div className="aspect-video bg-gray-900/50 rounded-xl flex items-center justify-center border border-gray-700">
                <TrendingUp className="w-20 h-20 text-green-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl mr-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold">SEO & Analytics</h2>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Get found online and track your success. Every website we build
                is optimized for search engines and equipped with powerful
                analytics to measure and improve performance.
              </p>
              <ul className="space-y-3">
                {[
                  "On-page SEO optimization",
                  "Google Analytics integration",
                  "Performance tracking dashboards",
                  "Keyword optimization",
                  "Meta tags & schema markup",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-gray-300 group hover:text-green-400 transition-colors"
                  >
                    <Check className="w-5 h-5 text-green-500 mr-3 group-hover:scale-125 transition-transform" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

 

      {/* CTA Section */}
      <section className="py-28 text-center px-6 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Build Your Dream Website?
          </h2>
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Let's create a stunning online presence for your business with
            cutting-edge technology, creative design, and performance-focused
            development.
          </p>
          <button className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold text-lg px-12 py-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 inline-flex items-center">
            <a href="/contact">Get Started</a><ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
    </Layouts>
  );
}
