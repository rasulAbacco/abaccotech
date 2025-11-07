import React, { useState } from 'react';
import { FaAws, FaShieldAlt, FaServer, FaChartLine, FaRocket, FaCloud, FaDatabase, FaLock, FaDollarSign, FaCode, FaCog, FaUserShield, FaCheckCircle, FaLinkedin, FaTwitter, FaGithub, FaNetworkWired, FaTools, FaCloudUploadAlt, FaRegLightbulb } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { BiSupport } from 'react-icons/bi';
import { MdSecurity, MdSpeed, MdBackup } from 'react-icons/md';
import {  SiTerraform, SiDocker, SiKubernetes } from 'react-icons/si';
import Layout from '../../Components/Layout';

export default function AWSService() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);

  const services = [
    {
      icon: FaRocket,
      title: "Serverless & App Deployment",
      desc: "Build and deploy serverless applications using AWS Lambda and modern cloud architecture.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaCloud,
      title: "EC2, S3, Lambda & RDS Management",
      desc: "Full management of AWS compute, storage, and database services for peak performance.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaShieldAlt,
      title: "Security & Compliance",
      desc: "Complete AWS security audits, IAM control, encryption, and compliance monitoring.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaDollarSign,
      title: "Cost Optimization",
      desc: "Reduce AWS bills with smart architecture planning, resource allocation & usage insights.",
      color: "from-green-500 to-emerald-500"
    },
  ];

 

 

 
  const serverlessDetails = [
    {
      icon: FaRocket,
      title: "Lambda Functions",
      description: "Event-driven serverless computing that automatically scales",
      features: ["Auto-scaling", "Pay-per-execution", "Zero server management", "Millisecond billing"]
    },
    {
      icon: FaCode,
      title: "API Gateway",
      description: "Create, publish, and manage secure APIs at any scale",
      features: ["RESTful APIs", "WebSocket support", "Request throttling", "API versioning"]
    },
    {
      icon: FaCloudUploadAlt,
      title: "Step Functions",
      description: "Orchestrate microservices and distributed applications",
      features: ["Visual workflow", "Error handling", "State management", "Parallel execution"]
    },
    {
      icon: FaDatabase,
      title: "DynamoDB",
      description: "Fast, flexible NoSQL database with seamless scalability",
      features: ["Single-digit latency", "Global tables", "Built-in security", "Auto-scaling"]
    }
  ];

  const awsManagementServices = [
    {
      icon: FaServer,
      title: "EC2 Management",
      details: ["Instance optimization", "Load balancing", "Auto-scaling groups", "Reserved instance planning"],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: FaDatabase,
      title: "S3 Storage Solutions",
      details: ["Bucket policies", "Lifecycle management", "Cross-region replication", "Intelligent tiering"],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: FaRocket,
      title: "Lambda Optimization",
      details: ["Performance tuning", "Memory optimization", "Cold start reduction", "Event source mapping"],
      color: "from-green-500 to-teal-500"
    },
    {
      icon: FaDatabase,
      title: "RDS Database Management",
      details: ["Automated backups", "Read replicas", "Multi-AZ deployment", "Performance insights"],
      color: "from-green-500 to-teal-500"
    }
  ];

  const securityServices = [
    {
      icon: MdSecurity,
      title: "IAM & Access Control",
      points: ["Multi-factor authentication", "Role-based access control", "Policy auditing", "Identity federation"]
    },
    {
      icon: FaLock,
      title: "Encryption & Data Protection",
      points: ["KMS key management", "SSL/TLS certificates", "Data encryption at rest", "In-transit encryption"]
    },
    {
      icon: FaUserShield,
      title: "Compliance & Governance",
      points: ["HIPAA compliance", "PCI-DSS standards", "SOC 2 certification", "GDPR readiness"]
    },
    {
      icon: FaNetworkWired,
      title: "Network Security",
      points: ["VPC configuration", "Security groups", "WAF implementation", "DDoS protection"]
    }
  ];

 
  const techStack = [
    { name: "AWS Lambda", icon: SiTerraform },
    { name: "Terraform", icon: SiTerraform },
    { name: "Docker", icon: SiDocker },
    { name: "Kubernetes", icon: SiKubernetes },
    { name: "CloudFormation", icon: FaAws },
    { name: "CloudWatch", icon: FaChartLine },
    { name: "EC2", icon: FaServer },
    { name: "RDS", icon: FaDatabase }
  ];

  return (
    <Layout>
    <div className="text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24">
         <div className="container mx-auto px-6 relative z-10">
          <div className="space-y-6 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 px-6 py-3 rounded-full backdrop-blur-sm">
              <FaAws className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm font-semibold">AWS Premier Consulting Partner</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white">
              <span className='text-green-500'>Amazon</span> Web Services
            </h1>

            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Harness the power of AWS cloud with our certified experts. We help you deploy, secure, and optimize cloud platforms for maximum performance.
            </p>

            {/* <div className="flex gap-4 justify-center flex-wrap">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <FaRocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105">
                View Case Studies
              </button>
            </div> */}
          </div>
        </div>

      
      </section>

      {/* Core Services */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our AWS Services</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Comprehensive cloud solutions tailored to your business needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform duration-500 group-hover:scale-110`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {service.desc}
                </p>
                
                {/* <div className={`mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0`}>
                  Learn More <FaRocket className="w-3 h-3" />
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Serverless Deployment - Detailed Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-blue-500/30 px-4 py-2 rounded-full mb-4">
            <FaRocket className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Serverless Architecture</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Serverless Deployment Excellence</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">Build scalable, cost-effective applications without managing servers. Focus on code, not infrastructure.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {serverlessDetails.map((item, idx) => (
            <div key={idx} className="group bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {item.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <IoMdCheckmarkCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AWS Management Services - EC2, S3, Lambda, RDS */}
      <section className="container mx-auto px-6 py-24 bg-gradient-to-br from-gray-800/30 to-transparent rounded-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-4">
            <FaCloud className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Core AWS Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Complete AWS Infrastructure Management</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">Expert management of your critical AWS services for optimal performance and reliability</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {awsManagementServices.map((service, idx) => (
            <div key={idx} className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-green-500/50 transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <FaCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Compliance - Detailed */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-4">
            <FaShieldAlt className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Security First</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Security & Compliance Audits</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">Enterprise-grade security with comprehensive compliance monitoring and threat protection</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {securityServices.map((service, idx) => (
            <div key={idx} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">{service.title}</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {service.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-900/50 p-3 rounded-lg">
                    <IoMdCheckmarkCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Tech Stack Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Technology Stack</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Cutting-edge tools and technologies we use to deliver exceptional AWS solutions</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {techStack.map((tech, idx) => (
            <div key={idx} className="group bg-gray-800/20 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <tech.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-center">{tech.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className=" mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Cloud Infrastructure?</h2>
            <p className="text-gray-300 text-lg mb-8">Get a free consultation with our AWS experts and discover how we can optimize your cloud environment for performance, security, and cost.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <button className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Schedule Free Consultation <FaRocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button> */}
              <button className="px-8 py-4 bg-green-500 backdrop-blur-sm border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <a href="/contact">Contact Us</a>
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mt-8">No commitment. 30-minute consultation with our certified AWS architects.</p>
          </div>
          
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>
    </div>
    </Layout>
  );
}