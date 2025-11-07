import React, { useState, useRef, useEffect } from "react";
import { Mail, Phone, Menu, X, Home, Info, Briefcase, MessageSquare, ChevronDown, Send, Facebook, Twitter, Linkedin, Instagram, PhoneCall, Code } from "lucide-react";
import {
  Monitor,
  Workflow,
  Smartphone,
  CloudCog,
  Database,
  Cloud
} from "lucide-react";
import { GiReceiveMoney } from "react-icons/gi";
import { FaRegHandshake } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
  
export default function PremiumNavbar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/10 shadow-lg">
      {/* Top Contact Bar */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 text-sm bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="flex items-center gap-6 ml-5">
          <a href="mailto:info@abaccotech.com" className="flex items-center gap-2 hover:text-black/80 transition">
            <Mail size={15}/> info@abaccotech.com
          </a>
          <a href="tel:+919972452044" className="flex items-center gap-2 hover:text-black/80 transition">
            <Phone size={15}/> +91 9972452044
          </a>
        </div>

        <div className="flex gap-3 mr-10">
          {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
            <a key={i} href="#" className="text-white hover:text-black hover:bg-white p-1 rounded-full transition">
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-5">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <img src="/Logo/icon.png" className="h-12 w-12 object-contain" />
          <div className="leading-tight text-white">
            <p className="font-bold text-[25px] tracking-wide">Abacco Technology</p>
            <p className="text-xs text-gray-300">Smart Solutions for a Digital World</p>
          </div>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-9 text-white font-medium mr-18 ">
          <a href="/" className="hover:text-green-400 transition flex items-center gap-1">
            <Home size={18}/> Home
          </a>
          <a href="/about" className="hover:text-green-400 transition flex items-center gap-1">
            <HiMiniUserGroup size={18}/> About
          </a>

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setOpenDropdown(!openDropdown)} 
              className="hover:text-green-400 transition flex items-center gap-1"
            >
              <Briefcase size={18}/> Services <ChevronDown size={15} className={`${openDropdown ? "rotate-180" : ""} transition`}/>
            </button>

            {openDropdown && (
              <div className="absolute mt-2 w-64 bg-gray-800 border border-green-600/30 rounded-xl shadow-xl p-2 animate-fade-slide">
                {[
                  { icon: Monitor, title:"Website Designing", desc:"Modern & Responsive", path: "/services/website-designing" },
                  { icon: Workflow, title:"CRM Development", desc:"Industry Standard Solutions", path: "/services/crm-development" },
                  { icon: Smartphone, title:"Application Development", desc:"Android & iOS", path: "/services/Application-Development" },
                  { icon: CloudCog, title:"Cloud Management", desc:"Infrastructure Solutions", path: "/services/cloud-management" },
                  { icon: Database, title:"Database Management", desc:"Secure & Scalable DB Services", path: "/services/database-management" },
                  { icon: Cloud, title:"AWS Services", desc:"Cloud Hosting & DevOps", path: "/services/aws-services" },

                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.path}
                    className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-white hover:bg-green-600/20 transition cursor-pointer"
                  >
                    <item.icon size={18} className="text-green-400"/> 
                    <div className="text-left text-sm">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="/why-choose-us" className="hover:text-green-400 transition flex items-center gap-1">
            <FaRegHandshake size={18}/> Why Choose Us
          </a>

          <a href="/pricing" className="hover:text-green-400 transition flex items-center gap-1">
            <GiReceiveMoney size={18}/> Pricing
          </a>


          <a href="/contact" className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold transition">
            <Send size={18}/> Contact Us
          </a>
        </nav>

        {/* Mobile Menu Icon */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden text-white">
          {mobileMenu ? <X size={26}/> : <Menu size={26}/>}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="lg:hidden bg-black/95 text-white flex flex-col gap-3 px-6 py-6 animate-slide-down">
          <a href="/" className="text-left py-2 border-b border-white/10">Home</a>
          <a href="/about" className="text-left py-2 border-b border-white/10">About</a>
          
          {/* Mobile Services Dropdown */}
          <div>
            <button 
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full text-left py-2 border-b border-white/10 flex justify-between items-center"
            >
              <span>Services</span>
              <ChevronDown size={18} className={`${mobileServicesOpen ? "rotate-180" : ""} transition`} />
            </button>
            
            {mobileServicesOpen && (
              <div className="pl-4 mt-2 space-y-2">
                {[
                   { icon: Monitor, title:"Website Designing", desc:"Modern & Responsive", path: "/services/website-designing" },
                  { icon: Workflow, title:"CRM Development", desc:"Industry Standard Solutions", path: "/services/crm-development" },
                  { icon: Smartphone, title:"Application Development", desc:"Android & iOS", path: "/services/Application-Development" },
                  { icon: CloudCog, title:"Cloud Management", desc:"Infrastructure Solutions", path: "/services/cloud-management" },
                  { icon: Database, title:"Database Management", desc:"Secure & Scalable DB Services", path: "/services/database-management" },
                  { icon: Cloud, title:"AWS Services", desc:"Cloud Hosting & DevOps", path: "/services/aws-services" },
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.path}
                    className="block py-2 text-sm text-gray-300 hover:text-white"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <a href="/why-choose-us" className="text-left py-2 border-b border-white/10">Why Choose Us</a>
          <a href="/pricing" className="text-left py-2 border-b border-white/10">Pricing</a>
          <a href="/contact" className="text-left py-2">Contact Us</a>
        </div>
      )}
    </header>
  );
}