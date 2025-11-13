import { useState } from "react";
import { FaDatabase, FaShieldAlt, FaServer, FaLock, FaChartLine, FaClock, FaHdd, FaCog, FaCheckCircle, FaBolt, FaSync, FaArrowRight, FaLayerGroup, FaRocket, FaUsers } from "react-icons/fa";
import { MdSecurity, MdSpeed, MdBackup, MdAnalytics, MdArchitecture, MdAutorenew } from "react-icons/md";
import { SiPostgresql, SiMongodb, SiMysql, SiRedis, SiOracle, SiApachecassandra } from "react-icons/si";
import Layout from "../../Components/Layout";

export default function DatabaseManagement() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  const mainServices = [
    {
      icon: MdArchitecture,
      title: "Database Design & Architecture",
      desc: "Strategic database design with scalable architecture patterns for optimal performance and growth",
      features: [
        "Schema design & normalization",
        "Scalable architecture planning",
        "Data modeling & relationships",
        "Index strategy development"
      ],
      gradient: "from-green-500 via-emerald-600 to-teal-600",
      iconBg: "from-green-500/20 to-teal-500/20"
    },
    {
      icon: MdSpeed,
      title: "Optimization & Performance Tuning",
      desc: "Advanced optimization techniques to maximize database speed and efficiency",
      features: [
        "Query optimization & analysis",
        "Index tuning & management",
        "Resource allocation optimization",
        "Performance monitoring & alerts"
      ],
      gradient: "from-green-500 via-emerald-600 to-teal-600",
      iconBg: "from-green-500/20 to-teal-500/20"
    },
    {
      icon: MdBackup,
      title: "Backup & Recovery Solutions",
      desc: "Comprehensive backup strategies with rapid recovery to ensure business continuity",
      features: [
        "Automated backup schedules",
        "Point-in-time recovery",
        "Disaster recovery planning",
        "Data integrity verification"
      ],
      gradient: "from-green-500 via-emerald-600 to-teal-600",
      iconBg: "from-green-500/20 to-teal-500/20"
    },
    {
      icon: MdAutorenew,
      title: "Data Migration & Automation",
      desc: "Seamless data migration with intelligent automation for enhanced operational efficiency",
      features: [
        "Zero-downtime migrations",
        "Automated data workflows",
        "ETL pipeline development",
        "Legacy system modernization"
      ],
      gradient: "from-green-500 via-emerald-600 to-teal-600",
      iconBg: "from-green-500/20 to-teal-500/20"
    }
  ];

  const technologies = [
    { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-400" },
    { name: "MongoDB", icon: SiMongodb, color: "text-green-500" },
    { name: "MySQL", icon: SiMysql, color: "text-blue-500" },
    { name: "Redis", icon: SiRedis, color: "text-red-500" },
    { name: "Oracle", icon: SiOracle, color: "text-red-600" },
    { name: "Cassandra", icon: SiApachecassandra, color: "text-cyan-400" },
  ];

  const stats = [
    { value: "99.99%", label: "Uptime Guarantee", icon: FaClock, color: "blue" },
    { value: "500+", label: "Databases Managed", icon: FaDatabase, color: "green" },
    { value: "24/7", label: "Support Available", icon: FaShieldAlt, color: "purple" },
    { value: "<1ms", label: "Query Response", icon: FaBolt, color: "orange" },
  ];

  const whyChoose = [
    {
      icon: FaLock,
      title: "Enterprise Security",
      desc: "Bank-grade encryption and advanced security protocols"
    },
    {
      icon: FaRocket,
      title: "Lightning Fast",
      desc: "Optimized for maximum performance and speed"
    },
    {
      icon: FaLayerGroup,
      title: "Scalable Solutions",
      desc: "Grow seamlessly from startup to enterprise"
    },
    {
      icon: FaUsers,
      title: "Expert Support",
      desc: "Dedicated team available around the clock"
    }
  ];

  return (
    <Layout>
    <div className="text-white min-h-screen  ">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 px-5 py-2.5 rounded-full backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
              <FaDatabase className="text-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-semibold">Professional Database Solutions</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Database Management
            </h1>

            <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Data is the heart of your business. We ensure it's well-structured, protected, and always accessible to keep your applications running smoothly.
            </p>

            {/* CTA Buttons */}
            {/* <div className="flex gap-4 justify-center items-center flex-wrap">
              <button className="group relative bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-xl font-bold text-gray-900 overflow-hidden hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Today
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
             
            </div> */}
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float-delayed"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <stat.icon className="text-green-400 text-3xl mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />
                <div className="text-4xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Services Section - THREE SECTIONS */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Core Services
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive database solutions designed to power your business operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {mainServices.map((service, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-3xl border border-gray-800 hover:border-green-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm overflow-hidden"
            >
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  <service.icon className="text-white text-3xl" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-base leading-relaxed mb-6">
                  {service.desc}
                </p>

                {/* Features List */}
                <ul className="space-y-3">
                  {service.features.map((feature, fIdx) => (
                    <li 
                      key={fIdx} 
                      className="flex items-start gap-3 text-gray-300 group-hover:text-white transition-colors"
                      style={{ 
                        transitionDelay: `${fIdx * 50}ms`,
                        transform: hoveredCard === idx ? 'translateX(0)' : 'translateX(-10px)',
                        opacity: hoveredCard === idx ? 1 : 0.7
                      }}
                    >
                      <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <div className="mt-6 pt-6 border-t border-gray-700/50 group-hover:border-green-500/30 transition-colors">
                  <button className="text-green-400 font-semibold flex items-center gap-2 group-hover:gap-4 transition-all">
                    Learn More
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24  ">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Technologies We Master 
            </h2>
            <p className="text-gray-400 text-lg">
              Expert support for all major database platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, idx) => (
              <div
                key={idx}
                className="group relative bg-gray-800/40 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10 flex flex-col items-center justify-center gap-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <tech.icon className={`text-6xl ${tech.color} group-hover:scale-125 transition-transform duration-500 relative z-10`} />
                <p className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors relative z-10">
                  {tech.name}
                </p>
                {/* Pulse Ring */}
                <div className="absolute inset-0 border-2 border-green-500/0 group-hover:border-green-500/30 rounded-2xl scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose  Our Services 
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Industry-leading database management with unmatched reliability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {whyChoose.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-8 rounded-2xl border border-gray-800 hover:border-green-500/60 transition-all duration-500 hover:-translate-y-2 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                  <item.icon className="text-green-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>

              {/* Corner Decoration */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600"></div> */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-block animate-bounce">
              <FaRocket className="text-6xl text-white mb-6" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Database?
            </h2>
            <p className="text-white/90 text-xl mb-10 leading-relaxed">
              Let's build a powerful, secure, and scalable database infrastructure that grows with your business.
            </p>
            <button className="group relative inline-flex items-center gap-3 bg-green-500 hover:bg-gray-800 text-white px-12 py-6 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                <a href="/contact">Get Started Now</a>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Floating Elements */}
 
      </section>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(20px) scale(1.05); }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
    </Layout>
  );
}