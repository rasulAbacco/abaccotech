import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7x2 mx-auto px-4 py-12 ml-3 mr-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-3 cursor-pointer">
              <img src="/Logo/icon.png" className="h-12 w-12 object-contain" />
              <div className="leading-tight text-white">
                <p className="font-bold text-[25px] tracking-wide">Abacco Technology</p>
                <p className="text-xs text-gray-300">Smart Solutions for a Digital World</p>
              </div>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner in digital marketing solutions. We help businesses grow through innovative marketing strategies.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-lg bg-[#017701] hover:bg-[#019901] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#017701] hover:bg-[#019901] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#017701] hover:bg-[#019901] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#017701] hover:bg-[#019901] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#017701] hover:bg-[#019901] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#017701] rounded"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  About Us
                </a>
              </li>
              <li>
                <a href="/why-choose-us" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Pricing
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#017701] rounded"></div>
              Our Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/services/website-designing" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Website Designing
                </a>
              </li>
              <li>
                <a href="/services/crm-development" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  CRM Development
                </a>
              </li>
              <li>
                <a href="/services/Application-Development" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Application Development
                </a>
              </li>
              <li>
                <a href="/services/cloud-management" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Cloud Management
                </a>
              </li>
               <li>
                <a href="/services/database-management" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  Database Management
                </a>
              </li>
               <li>
                <a href="/services/aws-services" className="text-gray-400 hover:text-[#017701] transition-colors flex items-center gap-2 group">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  AWS Services
                </a>
              </li>
            </ul>
             
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-[#017701] rounded"></div>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <Mail size={20} className="text-[#017701] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href="mailto:info@abaccotech.com" className="hover:text-[#017701] transition-colors">
                    info@abaccotech.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <Phone size={20} className="text-[#017701] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href="tel:+919972452044" className="hover:text-[#017701] transition-colors">
                    +91 9972452044
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={20} className="text-[#017701] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-sm">
                    No 12,13 & 12/A, Kirthan Arcade, 3rd Floor, Aditya Nagar, Sandeep Unnikrishnan Road, Bangalore - 560097
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2025 Abacco Tech. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-[#017701] transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-[#017701] transition-colors">Terms of Service</a>
              <a href="/refund-policy" className="hover:text-[#017701] transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}