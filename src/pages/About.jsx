import React from 'react'
import Layout from '../Components/Layout'
import { Target, Rocket, Lightbulb, Star, Users, Shield, Code, Smartphone, Cloud, Palette, Database, TrendingUp } from 'lucide-react'

function About() {
  const values = [
    {
      title: "Innovation",
      description: "We stay ahead of technology trends, constantly exploring new tools and methodologies to deliver cutting-edge solutions.",
      icon: Lightbulb
    },
    {
      title: "Quality",
      description: "Excellence is non-negotiable. We follow industry best practices and rigorous testing to ensure flawless delivery.",
      icon: Star
    },
    {
      title: "Collaboration",
      description: "We believe in transparent communication and working as an extension of your team to achieve shared goals.",
      icon: Users
    },
    {
      title: "Integrity",
      description: "Trust and honesty form the foundation of every client relationship we build and maintain.",
      icon: Shield
    }
  ]

  const services = [
    { name: "Custom Web Development", icon: Code },
    { name: "Mobile App Solutions", icon: Smartphone },
    { name: "CRM & ERP Systems", icon: Database },
    { name: "Cloud Infrastructure", icon: Cloud },
    { name: "UI/UX Design", icon: Palette },
    { name: "Digital Transformation", icon: TrendingUp }
  ]

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl py-20 mt-25">
          {/* Animated Heading */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4">
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-[20px] font-semibold tracking-wide">
                About Us
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-green-500 mb-6 leading-tight">
              Building Digital <span className="text-white">Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-white-600 max-w-3xl mx-auto leading-relaxed">
              We design, build, and scale digital products that accelerate business growth and drive innovation across industries.
            </p>
          </div>

          {/* Who We Are Section */}
          <div className="mb-20 transform transition-all duration-500 hover:scale-[1.01]">
            <div className="border-2 border-green-800 rounded-2xl p-10 md:p-14 hover:border-green-500 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-green-500 rounded-full mr-4"></div>
                <h2 className="text-4xl font-bold text-white">
                  Who We Are
                </h2>
              </div>
              <p className="text-white-700 leading-relaxed text-lg mb-4">
                Abacco Technology is a full-stack IT solutions provider specializing in website design, CRM development, mobile and web application development, and advanced cloud and database management. With years of experience serving startups, enterprises, and global brands, we combine creativity, technology, and business strategy to deliver scalable, high-performing solutions that drive measurable growth.
              </p>
              <p className="text-white-700 leading-relaxed text-lg">
                Our team of developers, designers, and technology strategists work closely with clients to understand their business goals and craft custom solutions that create impact. We don't just build software—we build partnerships that last.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="group border-2 border-gray-900 p-10 rounded-2xl hover:bg-green-500 hover:border-green-500 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <Target className="w-12 h-12 mb-4 text-green-500 group-hover:text-white transition-colors duration-300" strokeWidth={2} />
              <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-white transition-colors duration-300">Our Mission</h3>
              <p className="text-white-700 group-hover:text-white leading-relaxed text-lg transition-colors duration-300">
                To empower businesses through innovative technology, reliable infrastructure, and user-centric design. We aim to simplify complexity and deliver solutions that help organizations operate smarter, faster, and more efficiently.
              </p>
            </div>

            <div className="group border-2 border-gray-900 p-10 rounded-2xl hover:bg-green-500 hover:border-green-500 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <Rocket className="w-12 h-12 mb-4 text-green-500 group-hover:text-green-500 transition-colors duration-300" strokeWidth={2} />
              <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-white transition-colors duration-300">Our Vision</h3>
              <p className="text-white-700 group-hover:text-white-300 leading-relaxed text-lg transition-colors duration-300">
                To be a trusted global partner for digital transformation and intelligent automation. Our vision is to shape the future of business technology by enabling seamless, scalable, and secure digital ecosystems.
              </p>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-500 mb-4">Our Core Values</h2>
              <p className="text-white-600 text-lg">The principles that guide everything we do</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div 
                    key={index}
                    className="group border-1 border-gray-700 p-8 rounded-2xl hover:border-green-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <IconComponent className="w-12 h-12 mb-4 text-green-500 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-green-500 transition-colors">
                      {value.title}
                    </h4>
                    <p className="text-white-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* What We Do Section */}
          <div className="rounded-2xl p-10 md:p-14 mb-20   border-green-900 hover:border-green-500 transition-all duration-300">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">What We Do</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {services.map((service, index) => {
                const IconComponent = service.icon
                return (
                  <div 
                    key={index}
                    className="group border border-white p-6 rounded-xl hover:bg-green-500 hover:border-green-500 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5 text-green-500 mr-3 group-hover:text-white transition-colors" strokeWidth={2} />
                      <p className="text-white text-lg font-medium group-hover:translate-x-2 transition-transform">
                        {service.name}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-green-500 rounded-2xl p-12 border-2 border-green-500 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your digital goals and create solutions that drive real results.
            </p>
            <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-500 transition-all duration-300 hover:scale-105 border-2 border-gray-900">
              <a href="/contact">Get Started Today →</a>
            </button>
          </div>
        </div>
      </div>

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
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </Layout>
  )
}

export default About