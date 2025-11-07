import React from "react";
import Layout from "../Components/Layout";
import { 
  FaUsers, 
  FaRocket, 
  FaClock, 
  FaDollarSign, 
  FaHeadset, 
  FaThumbsUp, 
  FaCode, 
  FaBriefcase, 
  FaHandshake,
  FaShieldAlt,
  FaChartLine,
  FaLightbulb,
  FaCertificate,
  FaGlobe,
  FaMobileAlt
} from "react-icons/fa";

function WhyChooseUs() {
  const features = [
    {
      icon: <FaUsers />,
      title: "Expert Developers & Designers",
      desc: "Our highly skilled team of developers and designers brings years of experience in delivering modern, powerful, and visually stunning digital solutions. We stay updated with the latest industry trends and best practices to ensure your project stands out in the competitive digital landscape.",
    },
    {
      icon: <FaRocket />,
      title: "Customized & Scalable Solutions",
      desc: "Every business is unique, and so are our solutions. We build tailored products designed specifically for your business needs, ensuring they can scale seamlessly as your company grows. Our architecture supports future expansion without compromising performance or security.",
    },
    {
      icon: <FaClock />,
      title: "On-Time Delivery",
      desc: "We understand that time is money. Our agile project management approach ensures we deliver projects on schedule with a transparent communication process. You'll receive regular updates and milestones, keeping you informed every step of the way.",
    },
    {
      icon: <FaDollarSign />,
      title: "Transparent Pricing",
      desc: "No surprises, no hidden costs. We believe in fair and transparent pricing with flexible packages suitable for startups, SMEs, and enterprises. You'll know exactly what you're paying for, with detailed breakdowns and cost-effective solutions that maximize your ROI.",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Technical Support",
      desc: "Your success doesn't follow a 9-to-5 schedule, and neither do we. Our dedicated support team is always ready to assist you anytime, anywhere. Whether it's a technical issue, a question, or guidance you need, we're just a call or message away.",
    },
    {
      icon: <FaThumbsUp />,
      title: "100% Client Satisfaction",
      desc: "Your satisfaction is our ultimate goal. We prioritize customer success above everything else, ensuring every deliverable meets or exceeds your expectations. Our client retention rate speaks volumes about our commitment to quality and service excellence.",
    },
    {
      icon: <FaCode />,
      title: "Latest Technology Stack",
      desc: "We leverage cutting-edge technologies and modern frameworks including React, Node.js, Python, Cloud services, and more. This ensures your solution is not only high-performing and secure but also future-ready, giving you a competitive advantage.",
    },
    {
      icon: <FaBriefcase />,
      title: "Proven Portfolio",
      desc: "Our track record speaks for itself. We've successfully delivered projects across diverse industries including IT, E-commerce, Education, Healthcare, Finance, and more. Check our portfolio to see real results and satisfied clients who trusted us with their vision.",
    },
    {
      icon: <FaHandshake />,
      title: "Long-Term Partnership",
      desc: "We don't just build and disappear. We work as your dedicated technology partner, ensuring continuous improvement, innovation, and support. As your business evolves, we're here to help you adapt, upgrade, and stay ahead of the curve.",
    },
  ];

  const whyDifferent = [
    {
      icon: <FaShieldAlt />,
      title: "Security First Approach",
      desc: "We implement industry-leading security practices, data encryption, and regular security audits to protect your business and customer data.",
    },
    {
      icon: <FaChartLine />,
      title: "Data-Driven Results",
      desc: "Every decision we make is backed by data and analytics. We track performance metrics and continuously optimize for better results.",
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation & Creativity",
      desc: "We don't just follow trends; we create them. Our innovative approach helps your brand stand out with unique and creative solutions.",
    },
    {
      icon: <FaCertificate />,
      title: "Certified Professionals",
      desc: "Our team holds industry-recognized certifications ensuring you work with qualified experts who follow best practices.",
    },
  ];

  const processHighlights = [
    {
      icon: <FaGlobe />,
      title: "Global Standards, Local Touch",
      desc: "We follow international quality standards while understanding local market needs and cultural nuances.",
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile-First Strategy",
      desc: "With mobile traffic dominating the web, we ensure your digital presence is optimized for all devices and screen sizes.",
    },
  ];

  return (
    <Layout>
      <div className="">
        <section className="text-white min-h-screen py-20 mt-20">
          <div className="container mx-auto px-6">
            {/* Heading */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold text-green-500 mb-4">
                <span className="text-white">Why</span> Choose Us
              </h2>
              <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed">
                At Abacco Technology, we combine innovation, quality, and
                dedication to bring your digital vision to life. Here's what makes us the perfect technology partner for your business.
              </p>
            </div>

            {/* Main Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-green-500/50 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer transform"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="text-4xl text-green-500 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-green-500 mb-3 group-hover:text-green-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* What Makes Us Different Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  What Makes Us Different
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Beyond the basics, here's what truly sets us apart from the competition
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyDifferent.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur border border-green-500/20 rounded-xl p-6 hover:from-green-500/20 hover:border-green-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-3xl text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Commitment Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Our Commitment to Excellence
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  We go above and beyond to ensure your success in the digital world
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {processHighlights.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-blue-500/10 hover:border-green-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl text-green-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-3">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-20 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12 border border-green-500/20">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Grow Your Digital Presence?
              </h3>
              <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
                Let's build something amazing together. Whether you need a
                website, software, or marketing services – Abacco Technology is
                here for you.
              </p>
              <a
                href="/contact"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
              >
                Contact Us Today
              </a>
            </div>
          </div>
        </section>

        {/* Add CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
          }
        `}</style>
      </div>
    </Layout>
  );
}

export default WhyChooseUs;