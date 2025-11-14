// src/Pricing.jsx
import { useState } from "react";
import { CheckCircle, Globe, Mail, TrendingUp, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "../Components/Layout";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function Pricing() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: 0,
  });
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    { icon: Globe, title: "Domain & Hosting Setup", price: "₹1,999/year", description: "Professional setup and hosting" },
    { icon: Mail, title: "Business Email Setup", price: "₹499", description: "Custom domain-based email" },
    { icon: TrendingUp, title: "Advanced SEO & Analytics", price: "₹3,999", description: "Boost search visibility" },
    { icon: RefreshCw, title: "Website Renewal Cost", price: "₹4,999/year", description: "Website management & updates" },
  ];

const handleRazorpayCheckout = async () => {
  
  // Clean phone number
  const cleanedPhone = formData.phone.replace(/\D/g, ""); // remove non-numeric

  // Validate Name
  if (!formData.name.trim()) {
    alert("Please enter your full name.");
    return;
  }

  // Validate Email
  if (!formData.email.trim()) {
    alert("Please enter your email address.");
    return;
  }

  // Validate Phone
  if (cleanedPhone.length !== 10) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  // Save cleaned phone back
  formData.phone = cleanedPhone;

  // Continue with payment
  const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      amount: totalAmount,
      plan: formData.plan,
      planPrice: formData.planPrice,
      addOns: selectedAddOns.length > 0 ? selectedAddOns : [],
    }),
  });

  const data = await res.json();

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY,
    order_id: data.id,
    amount: data.amount,
    currency: "INR",
    name: formData.name,
    description: "Website Package Payment",
    prefill: {
      name: formData.name,
      email: formData.email,
      contact: cleanedPhone,   // cleaned number
    },

    handler: async function (response) {
      alert("✅ Payment Successful — Invoice will be emailed shortly.");
      setShowForm(false);

      fetch(`${API_BASE_URL}/payment/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });
    },
    theme: { color: "#22c55e" },
  };

  new window.Razorpay(options).open();
};


  return (
    <Layout>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[95%] max-w-md px-8 py-7 rounded-[20px] shadow-2xl border border-gray-200 animate-scaleIn">
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Enter Your Details
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Please fill in your information to continue the payment
            </p>

            {/* Inputs */}
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleInput}
                className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleInput}
                className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                onChange={handleInput}
                className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Add-On Services (Optional)</h3>

              {addOns.map((add, i) => (
                <label key={i} className="flex items-center gap-2 mb-2 text-gray-700">
                  <input
                    type="checkbox"
                   onChange={(e) => {
                      let list = [...selectedAddOns];

                      if (e.target.checked) {
                        // ✅ Only add if not already in list
                        if (!list.find(item => item.title === add.title)) {
                          list.push({
                            title: add.title,
                            price: add.price
                          });
                          setTotalAmount(prev => prev + Number(add.price.replace(/\D/g, "")) * 100);
                        }
                      } else {
                        // ✅ Properly remove if unchecked
                        list = list.filter(item => item.title !== add.title);
                        setTotalAmount(prev => prev - Number(add.price.replace(/\D/g, "")) * 100);
                      }

                      setSelectedAddOns(list);
                      setFormData(prev => ({ ...prev, addOns: list }));
                    }}

                  />
                  {add.title} — {add.price}
                </label>
              ))}

              <p className="font-bold mt-3 text-lg text-gray-900">
                Total: ₹{totalAmount / 100}
              </p>
            </div>


            {/* Proceed Button */}
            <button
              className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white py-3 cursor-pointer rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              onClick={handleRazorpayCheckout}
            >
              Proceed to Pay
            </button>

            {/* Cancel Button */}
            <button
              className="w-full mt-3 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition cursor-pointer"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}


      <div className="min-h-screen text-white pt-32 pb-20">
        <div className="container mx-auto px-6">
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

                  <button
                    onClick={() => {
                      const planPrice = Number(plan.price.replace(/\D/g, ""));
                      const amount = planPrice * 100;

                      setFormData((prev) => ({
                        ...prev,
                        amount,
                        plan: plan.title,
                        planPrice,
                      }));

                      setTotalAmount(amount);
                      setShowForm(true);
                    }}
                    className={`block text-center font-semibold py-2 rounded-lg transition w-full cursor-pointer shadow-xl
                      ${
                        plan.title === "Professional"
                          ? "bg-gray-800 hover:bg-gray-700 text-white"
                          : "bg-green-600 hover:bg-green-500 text-white"
                      }
                    `}
                  >
                    Pay Now
                  </button>

                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Optional Add-Ons
            </motion.h2>

            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Enhance your website with these additional services
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addOn, i) => {
                const Icon = addOn.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
