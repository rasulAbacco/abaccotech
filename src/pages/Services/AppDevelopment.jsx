import { Code2, Smartphone, Cloud, ShieldCheck, Zap, Users, Layers, Check, ArrowRight, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import Layout from "../../Components/Layout";

export default function ApplicationDevelopment() {
  const [activeTab, setActiveTab] = useState('mobile');

  const services = [
    {
      icon: Smartphone,
      title: "Mobile App Development",
      desc: "Native & cross-platform apps for Android and iOS with fast performance and beautiful UI.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Code2,
      title: "Web App Development",
      desc: "High-performance, modern web applications built for scale & usability.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Cloud,
      title: "Cloud-Ready Architecture",
      desc: "Secure, scalable & API-driven backend architecture ready for cloud deployment.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: ShieldCheck,
      title: "Security & Optimization",
      desc: "Top-grade security standards, speed optimization & real-time monitoring.",
      gradient: "from-green-500 to-emerald-500"
    },
  ];

  const technologies = {
    mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    web: ['React', 'Next.js', 'Vue.js', 'Node.js', 'TypeScript'],
    cloud: ['AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes']
  };

  const process = [
    { step: '01', title: 'Discovery & Planning', desc: 'Understanding your vision and defining the roadmap' },
    { step: '02', title: 'Design & Prototyping', desc: 'Creating intuitive user experiences and interfaces' },
    { step: '03', title: 'Development & Testing', desc: 'Building with best practices and rigorous QA' },
    { step: '04', title: 'Launch & Support', desc: 'Deploying successfully with ongoing maintenance' }
  ];

  const stats = [
    { icon: Users, value: '200+', label: 'Projects Delivered' },
    { icon: Star, value: '98%', label: 'Client Satisfaction' },
    { icon: TrendingUp, value: '5X', label: 'Average ROI' },
    { icon: Zap, value: '24/7', label: 'Support Available' }
  ];

  const features = [
    'Scalable architecture for growth',
    'Cross-platform compatibility',
    'Real-time data synchronization',
    'Advanced security measures',
    'Intuitive user interfaces',
    'Performance optimization'
  ];

  return (
    <Layout>
    <div className=" text-white min-h-screen">
      
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30 backdrop-blur-sm">
                <span className="text-green-400 text-sm font-semibold">🚀 Enterprise-Grade Solutions</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Powerful
                <span className="block mt-2 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                  Application Development
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your ideas into high-performance digital products — from mobile apps to enterprise web platforms with cutting-edge technology.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <a href="/pricing">Let's Build Your App</a>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
         
              </div>
            </div>

            {/* Animated Card Showcase */}
            <div className="relative h-96">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Floating cards animation */}
                  <div className="absolute top-0 right-0 w-48 h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10 p-6 transform rotate-6 hover:rotate-0 transition-transform duration-500 hover:scale-105 cursor-pointer">
                    <Smartphone className="w-10 h-10 text-purple-400 mb-3" />
                    <h3 className="font-bold mb-2">Mobile First</h3>
                    <p className="text-sm text-gray-300">Native iOS & Android</p>
                  </div>
                  
                  <div className="absolute bottom-10 left-0 w-48 h-56 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-sm border border-white/10 p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:scale-105 cursor-pointer">
                    <Code2 className="w-10 h-10 text-blue-400 mb-3" />
                    <h3 className="font-bold mb-2">Web Apps</h3>
                    <p className="text-sm text-gray-300">Modern & Responsive</p>
                  </div>
                  
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-48 h-56 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl backdrop-blur-sm border border-white/10 p-6 hover:scale-105 transition-transform duration-500 cursor-pointer z-10">
                    <Cloud className="w-10 h-10 text-green-400 mb-3" />
                    <h3 className="font-bold mb-2">Cloud Native</h3>
                    <p className="text-sm text-gray-300">Scalable Infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with Enhanced Cards */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What We <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Offer</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive development services tailored to your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, i) => (
            <div
              key={i}
              className="group relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon with animated background */}
              <div className="relative mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                <div className={`relative inline-flex p-4 bg-gradient-to-br ${item.gradient} rounded-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {item.desc}
              </p>
              
              {/* Arrow indicator */}
              
              
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack Section - NEW */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Technology Stack</span>
          </h2>
          <p className="text-gray-400 text-lg">Cutting-edge tools and frameworks we use</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {['mobile', 'web', 'cloud'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl   mx-auto">
          {technologies[activeTab].map((tech, i) => {
            const techIcons = {
              'React Native': Smartphone,
              'Flutter': Layers,
              'Swift': Smartphone,
              'Kotlin': Code2,
              'Firebase': Cloud,
              'React': Code2,
              'Next.js': Zap,
              'Vue.js': Layers,
              'Node.js': Cloud,
              'TypeScript': Code2,
              'AWS': Cloud,
              'Google Cloud': Cloud,
              'Azure': Cloud,
              'Docker': Layers,
              'Kubernetes': ShieldCheck
            };
            const Icon = techIcons[tech] || Layers;
            
            return (
              <div
                key={i}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl h-[10rem] border border-white/10 hover:border-green-500/50 hover:bg-gray-700/50 transition-all duration-300 text-center group cursor-pointer transform hover:scale-105"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-green-400 mt-5 group-hover:rotate-12 transition-transform duration-300" />
                <p className="font-semibold text-sm">{tech}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Development Process Section - NEW */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Development Process</span>
            </h2>
            <p className="text-gray-400 text-lg">A proven methodology for successful delivery</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {process.map((item, i) => (
              <div key={i} className="relative group">
                {/* Connecting line */}
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green-500/50 to-transparent"></div>
                )}
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                  <div className="text-5xl font-bold text-green-500/70 mb-4 group-hover:text-green-500/40 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - NEW */}
  
      <section className="container mx-auto px-6 py-20 relative overflow-hidden">
        {/* Animated background elements */}
        
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="space-y-4">
               
              <h2 className="text-5xl font-bold leading-tight">
                Built with{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 text-transparent bg-clip-text animate-gradient">
                    Excellence
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Every application we develop is crafted with meticulous attention to detail, following industry best practices and focusing on delivering exceptional user experiences.
              </p>
            </div>
            
            <div className="space-y-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-800/40 to-gray-800/20 rounded-2xl border border-white/5 hover:border-green-500/40 hover:from-gray-800/60 hover:to-gray-800/40 transition-all duration-500 group cursor-pointer backdrop-blur-sm"
                  style={{
                    animation: `slideInLeft 0.6s ease-out ${i * 0.1}s both`
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-green-500/25">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative h-[500px]">
            {/* Floating orbs */}
            
            {/* Main card */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-transparent rounded-3xl blur-3xl animate-pulse"></div>
            <div className="relative h-full mt-13 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-12 flex flex-col items-center justify-center shadow-2xl overflow-hidden group hover:border-green-500/30 transition-all duration-500">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
              
              <div className="relative text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-400/30 rounded-full blur-2xl animate-pulse"></div>
                  <Zap className="relative w-20 h-20 text-green-400 animate-bounce" style={{animationDuration: '2s'}} />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">Lightning Fast</p>
                  <p className="text-gray-400 text-lg">Optimized for peak performance</p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">99.9%</div>
                    <div className="text-xs text-gray-500">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">&lt;100ms</div>
                    <div className="text-xs text-gray-500">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">A+</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-20px) scale(1.1);
            }
          }
          
          @keyframes gradient {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s linear infinite;
          }
        `}</style>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className="container mx-auto px-6 py-20">
        <div className="relative overflow-hidden p-12 md:p-16 rounded-3xl">
          {/* Animated background pattern */}
           
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-White mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Let's develop your next-generation digital product together and transform your vision into reality.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button className="group px-8 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                <a href="/contact">Get start now</a>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
             
            </div>
          </div>
        </div>
      </section>

    </div>
    </Layout>
  );
}