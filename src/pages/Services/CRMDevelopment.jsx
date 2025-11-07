import { motion } from "framer-motion";
import { CheckCircle, Users, BarChart3, Zap, Shield, Globe, Clock, TrendingUp, Database, Lock, Smartphone, Cloud } from "lucide-react";
import Layout from "../../Components/Layout";

export default function CRMDevelopment() {
  const features = [
    "Lead & Sales Management",
    "Customer Tracking",
    "Reporting & Analytics Dashboards",
    "Integration with Marketing Tools",
    "Workflow Automation & Task Management",
    "Role-Based Access & Permissions",
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Increase Sales by 35%",
      description: "Automated workflows and intelligent lead scoring help your team close deals faster"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Better Customer Retention",
      description: "360° customer view enables personalized interactions and stronger relationships"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Save 20+ Hours Weekly",
      description: "Eliminate repetitive tasks with smart automation and streamlined processes"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Data-Driven Decisions",
      description: "Real-time analytics and custom reports provide actionable business insights"
    }
  ];

  const industries = [
    { name: "Healthcare", icon: <Users className="w-6 h-6" /> },
    { name: "Real Estate", icon: <Globe className="w-6 h-6" /> },
    { name: "Finance", icon: <TrendingUp className="w-6 h-6" /> },
    { name: "E-commerce", icon: <Database className="w-6 h-6" /> },
    { name: "Manufacturing", icon: <BarChart3 className="w-6 h-6" /> },
    { name: "Education", icon: <Cloud className="w-6 h-6" /> }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We analyze your business needs, workflows, and goals to design the perfect CRM solution"
    },
    {
      step: "02",
      title: "Custom Development",
      description: "Our team builds your CRM with scalable architecture and intuitive user experience"
    },
    {
      step: "03",
      title: "Integration & Testing",
      description: "Seamlessly connect with existing tools and conduct thorough quality assurance"
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "Deploy your CRM and receive ongoing training, maintenance, and optimization"
    }
  ];

  return (
    <Layout>
    <div className=" text-white min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full"
          >
            <span className="text-green-400 text-sm font-semibold">Enterprise CRM Solutions</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent">
            Custom CRM Development
          </h1>

          <p className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-300 leading-relaxed mb-10">
            Transform your customer relationships with intelligent CRM systems that adapt to your business. Boost productivity, increase sales, and deliver exceptional experiences.
          </p>

           
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for <span className="text-green-400">Modern Teams</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Our CRM solutions integrate intelligent automation, real-time data, and scalable architecture to help your business grow exponentially.
            </p>
            <ul className="space-y-4">
              {features.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer"
                >
                  <CheckCircle className="text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-lg text-gray-200 group-hover:text-white transition-colors duration-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-10 border border-gray-700 shadow-2xl hover:border-green-500/50 transition-all duration-500">
              <h3 className="text-3xl font-bold mb-6 text-green-400">Why Choose Us?</h3>
              <p className="text-gray-300 mb-8 text-lg">
                Empower your team with powerful tools built for automation, insights, and seamless collaboration across all departments.
              </p>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: <Zap />, text: "Tailored CRM Workflows" },
                  { icon: <BarChart3 />, text: "Real-time Data Insights" },
                  { icon: <Shield />, text: "Secure Cloud Architecture" },
                  { icon: <Smartphone />, text: "Mobile-Friendly Access" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-green-400">{item.icon}</div>
                    <span className="text-gray-200 font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20  ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Measurable <span className="text-green-400">Business Impact</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Our CRM solutions deliver tangible results that drive growth and efficiency across your organization.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industries Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Solutions for <span className="text-green-400">Every Industry</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            We build customized CRM systems tailored to the unique needs of your industry.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="text-green-400 mb-3 group-hover:scale-125 transition-transform duration-300">
                {industry.icon}
              </div>
              <span className="text-gray-200 font-semibold group-hover:text-white transition-colors duration-300">
                {industry.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-6 py-20 ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Development <span className="text-green-400">Process</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            A proven methodology that ensures your CRM is delivered on time, within budget, and exceeds expectations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
            >
              <div className="absolute -top-6 left-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4 text-white group-hover:text-green-400 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Transform Your Customer Management
            </h2>
            <p className="text-xl mb-8 text-gray-400 max-w-2xl mx-auto">
              Let's build a CRM solution that scales with your business and drives measurable results.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 shadow-xl"
            >
              <a href="/contact">Get a Free Consultation</a>
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
    </Layout>
  );
}