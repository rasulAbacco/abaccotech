//  src/Components/Footer.jsx
import React from "react";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";

// ---------- Footer data ----------
const QUICK_LINKS = [
  { title: "Home", path: "/" },
  { title: "About Us", path: "/about" },
  { title: "Why Choose Us", path: "/why-choose-us" },
  { title: "Pricing", path: "/pricing" },
  { title: "Contact Us", path: "/contact" },
];

const SERVICES = [
  { title: "Website Designing", path: "/services/website-designing" },
  { title: "CRM Development", path: "/services/crm-development" },
  { title: "Application Development", path: "/services/Application-Development" },
  { title: "Cloud Management", path: "/services/cloud-management" },
  { title: "Database Management", path: "/services/database-management" },
  { title: "AWS Services", path: "/services/aws-services" },
];

const LEGAL_LINKS = [
  { title: "Privacy Policy", path: "/privacy" },
  { title: "Terms of Service", path: "/terms" },
  { title: "Refund Policy", path: "/refund-policy" },
];

const EMAIL = "info@abaccotech.com";
const PHONE_DISPLAY = "+91 99724 52044";
const PHONE_LINK = "+919972452044";
const ADDRESS =
  "No 12, 13 & 12/A, Kirthan Arcade, 3rd Floor, Aditya Nagar, Sandeep Unnikrishnan Road, Bangalore - 560097";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

// ---------- Shared styles (same sizes & hover colour as the Navbar) ----------
const focusRing =
  "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f19]";

const headingClass =
  "text-xs font-semibold uppercase tracking-wide text-green-400/90 mb-3 pb-1.5 border-b border-white/10";

const linkClass = `inline-block py-1 text-sm text-gray-300 hover:text-green-400 transition ${focusRing}`;

const contactRowClass = `flex items-start gap-3 text-sm text-gray-300 hover:text-green-400 transition ${focusRing}`;

export default function Footer() {
  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <footer className="bg-[#0b0f19] text-white border-t border-white/10">
      {/* Main Footer Content — same side padding as the Navbar so edges line up */}
      <div className="px-6 md:px-10 py-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <a href="/" className={`flex items-center gap-3 w-fit ${focusRing}`}>
              <img
                src="/Logo/icon.png"
                alt="Abacco Technology logo"
                className="h-10 w-10 object-contain"
              />
              <div className="leading-tight text-white">
                <p className="font-bold text-[19px] tracking-wide">Abacco Technology</p>
                <p className="text-[11px] text-gray-300">Smart Solutions for a Digital World</p>
              </div>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your trusted partner in digital marketing solutions. We help businesses grow
              through innovative marketing strategies.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h2 className={headingClass}>Quick Links</h2>
            <ul className="space-y-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <a href={link.path} className={linkClass}>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Our Services */}
          <nav aria-label="Our services">
            <h2 className={headingClass}>Our Services</h2>
            <ul className="space-y-1">
              {SERVICES.map((service) => (
                <li key={service.path}>
                  <a href={service.path} className={linkClass}>
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Us — each whole row is clickable for an easier tap target */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className={headingClass}>Contact Us</h2>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${EMAIL}`} className={contactRowClass}>
                  <Mail size={16} className="mt-0.5 shrink-0 text-green-400" />
                  <span>
                    <span className="block text-[11px] text-gray-400">Email</span>
                    {EMAIL}
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_LINK}`} className={contactRowClass}>
                  <Phone size={16} className="mt-0.5 shrink-0 text-green-400" />
                  <span>
                    <span className="block text-[11px] text-gray-400">Phone</span>
                    {PHONE_DISPLAY}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactRowClass}
                >
                  <MapPin size={16} className="mt-0.5 shrink-0 text-green-400" />
                  <span>
                    <span className="block text-[11px] text-gray-400">Address</span>
                    <span className="block leading-relaxed">{ADDRESS}</span>
                    <span className="block mt-1 text-[11px] font-medium text-green-400">
                      Get directions
                      <span className="sr-only"> (opens Google Maps in a new tab)</span>
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Abacco Technology. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <nav aria-label="Legal">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      className={`inline-block py-1 hover:text-green-400 transition ${focusRing}`}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              onClick={scrollToTop}
              className={`flex items-center gap-1.5 py-1 text-gray-300 hover:text-green-400 transition ${focusRing}`}
            >
              <ArrowUp size={14} />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}