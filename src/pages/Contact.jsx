import React, { useState } from "react";
import Layout from "../Components/Layout";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaClock,
  FaCheckCircle,
  FaRocket,
  FaComments,
  FaHeadset,
  FaWhatsapp
} from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setFormStatus("sending");

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("phone", formData.phone);
  formDataToSend.append("message", formData.message);

  // FormSubmit extra fields (recommended)
  formDataToSend.append("_captcha", "false");
  formDataToSend.append("_template", "table");
  formDataToSend.append("_autoresponse", "Thank you for contacting Abacco Technology!");

  try {
    await fetch("https://formsubmit.co/info@abaccotech.com", {
      method: "POST",
      body: formDataToSend,
    });

    setFormStatus("success");
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setFormStatus(null), 3000);
  } catch (error) {
    alert("Error sending message. Try again.");
    setFormStatus(null);
  }
};



  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      details: "info@abaccotech.com",
      subtext: "We'll respond within 24 hours",
      link: "mailto:info@abaccotech.com"
    },
    {
      icon: <FaPhone />,
      title: "Call Us",
      details: "+91 9972452044",
      subtext: "Mon-Sat, 9:00 AM - 6:00 PM IST",
      link: "tel:+919972452044"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      details: "No 12,13 & 12/A, Kirthan Arcade, 3rd",
      subtext: "Floor, Aditya Nagar, Sandeep Unnikrishnan Road, Bangalore - 560097",
 
    }
  ];

  const quickLinks = [
    {
      icon: <FaRocket />,
      title: "Start a Project",
      desc: "Ready to begin? Let's discuss your requirements"
    },
    {
      icon: <FaComments />,
      title: "General Inquiry",
      desc: "Have questions? We're here to help"
    },
    {
      icon: <FaHeadset />,
      title: "Technical Support",
      desc: "Need assistance with existing projects?"
    }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "#", label: "Facebook" },
    { icon: <FaTwitter />, url: "#", label: "Twitter" },
    { icon: <FaLinkedinIn />, url: "#", label: "LinkedIn" },
    { icon: <FaInstagram />, url: "#", label: "Instagram" }
  ];

  return (
    <Layout>
      <div className="">
        <section className="text-white min-h-screen py-20">
          <div className="container mx-auto px-6">
            {/* Heading */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-extrabold text-green-500 mb-4 mt-10">
                Contact Us
              </h2>
              <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed">
                Let's Discuss Your Next Project – We're here to help you turn your
                ideas into reality.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                //   href={item.link}
                  className="group bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-green-500/50 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="text-4xl text-green-500 mb-4 transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-green-400 font-medium mb-1">
                    {item.details}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {item.subtext}
                  </p>
                </a>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-10 mb-16">
              {/* Left Side - Get In Touch */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-green-500">Get In Touch</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Reach out to us for business inquiries, project discussions, or
                    collaboration opportunities. We're excited to hear from you!
                  </p>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white mb-4">
                    How Can We Help?
                  </h4>
                  {quickLinks.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-2xl text-green-500 mt-1 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">
                          {item.title}
                        </h5>
                        <p className="text-gray-400 text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Business Hours */}
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur border border-green-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FaClock className="text-2xl text-green-500" />
                    <h4 className="text-xl font-semibold text-white">
                      Business Hours
                    </h4>
                  </div>
                  <div className="space-y-2 text-gray-300">
                    <p className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="text-green-400 font-medium">5:30 PM - 3:30 AM</span>
                    </p>
                    {/* <p className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="text-green-400 font-medium">02:00 PM - 10:00 PM</span>
                    </p> */}
                    <p className="flex justify-between">
                      <span>Saturday & Sunday:</span>
                      <span className="text-gray-500">Closed</span>
                    </p>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">
                    Connect With Us
                  </h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        aria-label={social.label}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur border border-white/10 rounded-lg text-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 hover:scale-110 hover:rotate-6 transition-all duration-300"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="lg:sticky lg:top-24 h-fit">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 space-y-5 hover:border-green-500/30 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Send us a Message
                  </h3>

                  <div className="group">
                    <label className="block text-gray-300 mb-2 font-medium">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-gray-300 mb-2 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-gray-300 mb-2 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-gray-300 mb-2 font-medium">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your project or inquiry..."
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none transition-all duration-300"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {formStatus === "sending" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : formStatus === "success" ? (
                      <>
                        <FaCheckCircle /> Message Sent!
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>

                  {formStatus === "success" && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center animate-fade-in">
                      <p className="text-green-400 font-medium">
                        Thank you! We'll get back to you soon.
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-16">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl overflow-hidden hover:border-green-500/30 transition-all duration-300">
                <div className=" ">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.232682654666!2d77.55273030000001!3d13.084434600000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae2387c5242ab3%3A0xb5933098d4ce3ad9!2sAbacco%20technology!5e0!3m2!1sen!2sin!4v1762358158494!5m2!1sen!2sin"
                    className="w-full h-120 border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                </div>
            </div>
            </div>


            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12 border border-green-500/20">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
                We typically respond within a few hours. Let's build something
                great together! Our team is eager to discuss your ideas and provide
                tailored solutions for your business.
              </p>
                <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/919972452044?text=Hi%2C%20I%20need%20support%20regarding%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
                >
                  <FaWhatsapp /> WhatsApp
                </a>

                <a
                  href="mailto:info@abaccotech.com"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-green-500/50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <FaEnvelope /> Email Us
                </a>
              </div>
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

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    </Layout>
  );
}

export default Contact;