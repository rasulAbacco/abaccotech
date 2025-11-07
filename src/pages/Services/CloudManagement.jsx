import { Cloud, ShieldCheck, Server, Clock, Database, ArrowRight, CheckCircle, Zap, Users, TrendingUp, Award, Code, Rocket, BarChart3, Globe, Lock, RefreshCw } from "lucide-react";
import Layout from "../../Components/Layout";

export default function CloudManagement() {
  const services = [
    { icon: Cloud, title: "Cloud Setup & Architecture", desc: "Deploy AWS, Azure & GCP with scalable & secure infrastructure." },
    { icon: Server, title: "Cloud Migration", desc: "Move your applications & data to cloud seamlessly." },
    { icon: ShieldCheck, title: "Security & Compliance", desc: "Robust IAM, encryption, audits & disaster recovery." },
    { icon: Clock, title: "24/7 Cloud Monitoring", desc: "Continuous performance, uptime & cost visibility." },
  ];

  const benefits = [
    "Proactive optimization & monitoring",
    "Battle-tested security frameworks",
    "Dedicated cloud engineers & support",
    "Guaranteed cost-efficient architecture",
  ];

  const features = [
    "Auto-scaling infrastructure",
    "Disaster recovery setup",
    "Real-time threat monitoring",
    "Performance tuning & backup automation",
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Clients Served" },
    { icon: Server, value: "99.9%", label: "Uptime SLA" },
    { icon: TrendingUp, value: "40%", label: "Cost Reduction" },
    { icon: Award, value: "15+", label: "Years Experience" },
  ];

  const process = [
    { step: "01", title: "Assess & Plan", desc: "Comprehensive audit of your current infrastructure and cloud readiness", icon: BarChart3 },
    { step: "02", title: "Design & Build", desc: "Architect scalable solutions tailored to your business needs", icon: Code },
    { step: "03", title: "Deploy & Migrate", desc: "Seamless migration with zero downtime and data integrity", icon: Rocket },
    { step: "04", title: "Optimize & Support", desc: "Continuous monitoring, optimization and 24/7 expert support", icon: RefreshCw },
  ];

  const industries = [
    { name: "FinTech & Banking", desc: "Secure, compliant cloud solutions for financial services", icon: Lock },
    { name: "Healthcare & MedTech", desc: "HIPAA-compliant infrastructure with data protection", icon: ShieldCheck },
    { name: "E-Commerce & Retail", desc: "High-performance platforms that scale with demand", icon: Globe },
  ];

  return (
    <Layout>
      <div className="text-white min-h-screen">

        {/* HERO - No Background */}
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-6 flex justify-center items-center text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full w-fit mx-auto animate-pulse">
                <p className="text-green-400 text-sm font-semibold flex items-center gap-2 justify-center">
                  <Zap size={16} /> Enterprise Cloud Solutions
                </p>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in">
                Cloud 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    &nbsp; Management
                </span>
              </h1>

              <p className="text-gray-300 text-lg max-w-xl mx-auto">
                Build, scale, secure & automate your cloud ecosystem with our experts. 
                Modern cloud solutions built for performance & reliability.
              </p>

              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto group">
                <a href="/contact">Book Your Cloud Consultation</a> 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-16 border-y border-white/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center group cursor-pointer">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-20 container mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-14">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Cloud Expertise</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-800/60 to-gray-800/30 p-8 rounded-2xl border border-white/10 backdrop-blur hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group hover:-translate-y-2">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl w-fit mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <s.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* OUR PROCESS - NEW SECTION */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-4xl font-bold mb-4">Our Cloud Transformation Process</h2>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
              A proven methodology that ensures successful cloud adoption and long-term success
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((item, i) => (
                <div key={i} className="relative group">
                  <div className="bg-gray-800/60 p-6 rounded-2xl border border-white/10 hover:border-green-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10">
                    <div className="text-green-400/30 text-5xl font-bold mb-4 group-hover:text-green-400/50 transition-colors">
                      {item.step}
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-green-500/50 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRIES WE SERVE - NEW SECTION */}
        <section className="py-20 container mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-4">Industries We Serve</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Specialized cloud solutions tailored for your industry's unique requirements
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {industries.map((industry, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 p-8 rounded-2xl border border-white/10 hover:border-green-500/60 transition-all duration-300 group hover:scale-105 cursor-pointer">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-full w-fit mb-6 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-300">
                  <industry.icon className="w-8 h-8 text-green-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition">{industry.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{industry.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* FEATURE GRID */}
        <section className="py-20 container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-10 text-center">Core Cloud Capabilities</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-center text-gray-300 bg-gray-800/40 p-4 rounded-xl border border-white/10 hover:border-emerald-500/60 transition-all duration-300 group hover:translate-x-2">
                <Database className="text-emerald-400 group-hover:scale-125 transition-transform flex-shrink-0" /> 
                <span className="group-hover:text-white transition-colors">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        {/* <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-gray-900 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4">Ready to Modernize Your Cloud?</h3>
            <p className="text-lg mb-8 text-white/90">Let's build scalable and secure infrastructure together.</p>
            <button className="px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 group">
              Schedule Strategy Call
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </div>
        </section> */}

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
          .bg-grid-white\/10 {
            background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
          }
        `}</style>
      </div>
      </Layout>
  );
}