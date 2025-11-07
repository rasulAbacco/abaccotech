import { CheckCircle, Globe, Mail, TrendingUp, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "../Components/Layout";

export default function Pricing() {
  const plans = [
    {
      title: "Starter",
      price: "₹7,999",
      period: "One Time",
      features: ["Basic Website", "Up to 5 Pages", "Mobile Responsive", "1 Month Support"],
      highlighted: false,
    },
    {
      title: "Professional",
      price: "₹14,999",
      period: "One Time",
      features: ["Dynamic Website", "Up to 10 Pages", "SEO Ready", "3 Months Support"],
      highlighted: true,
    },
    {
      title: "Premium",
      price: "₹24,999",
      period: "One Time",
      features: ["E-Commerce Website", "Unlimited Pages", "Payment Gateway Integration", "6 Months Support"],
      highlighted: false,
    },
  ];

  const addOns = [
    {
      icon: Globe,
      title: "Domain & Hosting Setup",
      price: "₹1,999/year",
      description: "Professional domain registration and reliable hosting"
    },
    {
      icon: Mail,
      title: "Business Email Setup",
      price: "₹499",
      description: "Custom email addresses for your domain"
    },
    {
      icon: TrendingUp,
      title: "Advanced SEO & Analytics",
      price: "₹3,999",
      description: "Boost visibility with comprehensive SEO optimization"
    },
    {
      icon: RefreshCw,
      title: "Website Renewal Cost",
      price: "₹4,999/year",
      description: "Annual maintenance and updates for your website"
    }
  ];

  return (
    <Layout>
    <div className=" min-h-screen text-white pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Pricing Plans Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Simple & Transparent Pricing
          </motion.h1>

          <p className="text-gray-400 max-w-xl mx-auto mb-12">
            Choose a plan that fits your business goals. No hidden fees.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`p-8 rounded-2xl border backdrop-blur-lg transition hover:scale-[1.03] hover:shadow-green-500/20 shadow-xl
                ${plan.highlighted ? "bg-green-600 border-green-500" : "bg-gray-800 border-gray-700"}`}
              >
                <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                <p className="text-4xl font-bold mb-1">{plan.price}</p>
                <p className="text-sm text-gray-300 mb-6">{plan.period}</p>

                <div className="space-y-2 text-left mb-8">
                  {plan.features.map((f, j) => (
                    <p key={j} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" /> {f}
                    </p>
                  ))}
                </div>

                <a
                  href="/contact"
                  className={`block text-center font-semibold py-2 rounded-lg transition
                ${plan.highlighted ? "bg-gray-900 hover:bg-gray-800 text-white" : "bg-green-600 hover:bg-green-500 text-white"}`}
                >
                  Get Started
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Optional Add-Ons Section */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Optional Add-Ons
          </motion.h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-12">
            Enhance your website with these professional services to maximize your online presence
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addOn, i) => {
              const Icon = addOn.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-green-500 transition hover:shadow-lg hover:shadow-green-500/10"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-green-600/20">
                      <Icon className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{addOn.title}</h3>
                  <p className="text-2xl font-bold text-green-400 mb-3">{addOn.price}</p>
                  <p className="text-sm text-gray-400">{addOn.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <a
              href="/contact"
              className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg hover:shadow-green-500/30"
            >
              Discuss Your Requirements
            </a>
          </motion.div>
        </div>
      </div>
    </div>
    </Layout>

  );
}