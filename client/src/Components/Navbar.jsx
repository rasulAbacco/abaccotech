//  src/Components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Home, ChevronDown, Users, Briefcase, Landmark, Phone } from "lucide-react";
import { GiReceiveMoney } from "react-icons/gi";

// ---------- Menu data ----------
// APPS: full suite, 4 columns x 2 category groups (matches reference layout)
const APPS_MENU = [
  [
    {
      heading: "Finance",
      color: "text-teal-600",
      items: [
        { title: "Accounting", path: "/apps/accounting" },
        { title: "Invoicing", path: "/apps/invoicing" },
        { title: "Expenses", path: "/apps/expenses" },
        { title: "Spreadsheet (BI)", path: "/apps/spreadsheet-bi" },
        { title: "Documents", path: "/apps/documents" },
        { title: "Sign", path: "/apps/sign" },
      ],
    },
    {
      heading: "Human Resources",
      color: "text-gray-800",
      items: [
        { title: "Employees", path: "/apps/employees" },
        { title: "Recruitment", path: "/apps/recruitment" },
        { title: "Time Off", path: "/apps/time-off" },
        { title: "Appraisals", path: "/apps/appraisals" },
        { title: "Referrals", path: "/apps/referrals" },
        { title: "Fleet", path: "/apps/fleet" },
      ],
    },
  ],
  [
    {
      heading: "Sales",
      color: "text-rose-500",
      items: [
        { title: "CRM", path: "/apps/crm" },
        { title: "Sales", path: "/apps/sales" },
        { title: "POS Shop", path: "/apps/pos-shop" },
        { title: "POS Restaurant", path: "/apps/pos-restaurant" },
        { title: "Subscriptions", path: "/apps/subscriptions" },
        { title: "Rental", path: "/apps/rental" },
      ],
    },
    {
      heading: "Marketing",
      color: "text-orange-500",
      items: [
        { title: "Social Marketing", path: "/apps/social-marketing" },
        { title: "Email Marketing", path: "/apps/email-marketing" },
        { title: "SMS Marketing", path: "/apps/sms-marketing" },
        { title: "Events", path: "/apps/events" },
        { title: "Marketing Automation", path: "/apps/marketing-automation" },
        { title: "Surveys", path: "/apps/surveys" },
      ],
    },
  ],
  [
    {
      heading: "Websites",
      color: "text-teal-600",
      items: [
        { title: "Website Builder", path: "/apps/website-builder" },
        { title: "eCommerce", path: "/apps/ecommerce" },
        { title: "Blog", path: "/apps/blog" },
        { title: "Forum", path: "/apps/forum" },
        { title: "Live Chat", path: "/apps/live-chat" },
        { title: "eLearning", path: "/apps/elearning" },
      ],
    },
    {
      heading: "Services",
      color: "text-orange-500",
      items: [
        { title: "Project", path: "/apps/project" },
        { title: "Timesheets", path: "/apps/timesheets" },
        { title: "Field Service", path: "/apps/field-service" },
        { title: "Helpdesk", path: "/apps/helpdesk" },
        { title: "Planning", path: "/apps/planning" },
        { title: "Appointments", path: "/apps/appointments" },
      ],
    },
  ],
  [
    {
      heading: "Supply Chain",
      color: "text-purple-600",
      items: [
        { title: "Inventory", path: "/apps/inventory" },
        { title: "Manufacturing", path: "/apps/manufacturing" },
        { title: "PLM", path: "/apps/plm" },
        { title: "Purchase", path: "/apps/purchase" },
        { title: "Maintenance", path: "/apps/maintenance" },
        { title: "Quality", path: "/apps/quality" },
      ],
    },
    {
      heading: "Productivity",
      color: "text-purple-600",
      items: [
        { title: "Discuss", path: "/apps/discuss" },
        { title: "Artificial Intelligence", path: "/apps/artificial-intelligence" },
        { title: "IoT", path: "/apps/iot" },
        { title: "VoIP", path: "/apps/voip" },
        { title: "Knowledge", path: "/apps/knowledge" },
        { title: "WhatsApp", path: "/apps/whatsapp" },
      ],
    },
  ],
];

// INDUSTRIES: 4 columns x 2 category groups (matches reference layout)
const INDUSTRIES_MENU = [
  [
    {
      heading: "Retail",
      color: "text-teal-600",
      items: [
        { title: "Book Store", path: "/industries/book-store" },
        { title: "Clothing Store", path: "/industries/clothing-store" },
        { title: "Furniture Store", path: "/industries/furniture-store" },
        { title: "Grocery Store", path: "/industries/grocery-store" },
        { title: "Hardware Store", path: "/industries/hardware-store" },
        { title: "Toy Store", path: "/industries/toy-store" },
      ],
    },
    {
      heading: "Manufacturing",
      color: "text-white-800",
      items: [
        { title: "Textile", path: "/industries/textile" },
        { title: "Metal", path: "/industries/metal" },
        { title: "Furnitures", path: "/industries/furnitures" },
        { title: "Food", path: "/industries/food" },
        { title: "Brewery", path: "/industries/brewery" },
        { title: "Corporate Gifts", path: "/industries/corporate-gifts" },
      ],
    },
  ],
  [
    {
      heading: "Food & Hospitality",
      color: "text-teal-600",
      items: [
        { title: "Bar and Pub", path: "/industries/bar-and-pub" },
        { title: "Restaurant", path: "/industries/restaurant" },
        { title: "Fast Food", path: "/industries/fast-food" },
        { title: "Guest House", path: "/industries/guest-house" },
        { title: "Beverage Distributor", path: "/industries/beverage-distributor" },
        { title: "Hotel", path: "/industries/hotel" },
      ],
    },
    {
      heading: "Health & Fitness",
      color: "text-orange-500",
      items: [
        { title: "Sports Club", path: "/industries/sports-club" },
        { title: "Eyewear Store", path: "/industries/eyewear-store" },
        { title: "Fitness Center", path: "/industries/fitness-center" },
        { title: "Wellness Practitioners", path: "/industries/wellness-practitioners" },
        { title: "Pharmacy", path: "/industries/pharmacy" },
        { title: "Hair Salon", path: "/industries/hair-salon" },
      ],
    },
  ],
  [
    {
      heading: "Real Estate",
      color: "text-rose-500",
      items: [
        { title: "Real Estate Agency", path: "/industries/real-estate-agency" },
        { title: "Architecture Firm", path: "/industries/architecture-firm" },
        { title: "Construction", path: "/industries/construction" },
        { title: "Property Management", path: "/industries/property-management" },
        { title: "Gardening", path: "/industries/gardening" },
        { title: "Property Owner Association", path: "/industries/property-owner-association" },
      ],
    },
    {
      heading: "Trades",
      color: "text-rose-500",
      items: [
        { title: "Handyman", path: "/industries/handyman" },
        { title: "IT Hardware & Support", path: "/industries/it-hardware-support" },
        { title: "Solar Energy Systems", path: "/industries/solar-energy-systems" },
        { title: "Shoe Maker", path: "/industries/shoe-maker" },
        { title: "Cleaning Services", path: "/industries/cleaning-services" },
        { title: "HVAC Services", path: "/industries/hvac-services" },
      ],
    },
  ],
  [
    {
      heading: "Consulting",
      color: "text-purple-600",
      items: [
        { title: "Accounting Firm", path: "/industries/accounting-firm" },
        { title: "Abacco Partner", path: "/industries/abacco-partner" },
        { title: "Marketing Agency", path: "/industries/marketing-agency" },
        { title: "Law firm", path: "/industries/law-firm" },
        { title: "Talent Acquisition", path: "/industries/talent-acquisition" },
        { title: "Audit & Certification", path: "/industries/audit-certification" },
      ],
    },
    {
      heading: "Others",
      color: "text-purple-600",
      items: [
        { title: "Nonprofit Organization", path: "/industries/nonprofit-organization" },
        { title: "Environmental Agency", path: "/industries/environmental-agency" },
        { title: "Billboard Rental", path: "/industries/billboard-rental" },
        { title: "Photography", path: "/industries/photography" },
        { title: "Bike Leasing", path: "/industries/bike-leasing" },
        { title: "Software Reseller", path: "/industries/software-reseller" },
      ],
    },
  ],
];

// COMMUNITY: 4 columns; some columns have multiple unlabeled item groups
const COMMUNITY_MENU = [
  [
    {
      heading: "Learn",
      color: "text-orange-500",
      items: [
        { title: "Tutorials", path: "/community/tutorials" },
        { title: "Documentation", path: "/community/documentation" },
        { title: "Certifications", path: "/community/certifications" },
        { title: "Training", path: "/community/training" },
        { title: "Blog", path: "/community/blog" },
        { title: "Podcast", path: "/community/podcast" },
      ],
    },
    {
      heading: "Empower Education",
      color: "text-orange-500",
      items: [
        { title: "Education Program", path: "/community/education-program" },
        { title: "Scale Up! Business Game", path: "/community/scale-up-business-game" },
        { title: "Visit Abacco", path: "/community/visit-abacco" },
      ],
    },
  ],
  [
    {
      heading: "Get the Software",
      color: "text-teal-600",
      items: [
        { title: "Download", path: "/community/download" },
        { title: "Compare Editions", path: "/community/compare-editions" },
        { title: "Releases", path: "/community/releases" },
      ],
    },
  ],
  [
    {
      heading: "Collaborate",
      color: "text-purple-600",
      items: [
        { title: "Github", path: "/community/github" },
        { title: "Forum", path: "/community/forum" },
        { title: "Events", path: "/community/events" },
        { title: "Translations", path: "/community/translations" },
      ],
    },
    {
      items: [
        { title: "Become a Partner", path: "/community/become-a-partner" },
        { title: "Services for Partners", path: "/community/services-for-partners" },
        { title: "Register your Accounting Firm", path: "/community/register-accounting-firm" },
      ],
    },
    {
      items: [{ title: "Affiliate Program", path: "/community/affiliate-program" }],
    },
  ],
  [
    {
      heading: "Get Services",
      color: "text-teal-600",
      items: [
        { title: "Find a Partner", path: "/community/find-a-partner" },
        { title: "Find an Accountant", path: "/community/find-an-accountant" },
      ],
    },
    {
      items: [
        { title: "Meet an advisor", path: "/community/meet-an-advisor" },
        { title: "Implementation Services", path: "/community/implementation-services" },
        { title: "Customer References", path: "/community/customer-references" },
      ],
    },
    {
      items: [
        { title: "Support", path: "/community/support" },
        { title: "Upgrades", path: "/community/upgrades" },
      ],
    },
  ],
];

export default function PremiumNavbar() {
  const [openMenu, setOpenMenu] = useState(null); // null | "apps" | "industries" | "community"
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileOpenSection, setMobileOpenSection] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (key) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const toggleMobileSection = (key) => {
    setMobileOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/10 shadow-lg"
    >
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <img src="/Logo/icon.png" className="h-10 w-10 object-contain" />
          <div className="leading-tight text-white">
            <p className="font-bold text-[19px] tracking-wide">Abacco Technology</p>
            <p className="text-[11px] text-gray-300">Smart Solutions for a Digital World</p>
          </div>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-7 text-sm text-white font-medium pr-6 md:pr-30">
          <a href="/" className="hover:text-green-400 transition flex items-center gap-1.5">
            <Home size={16} /> Home
          </a>

          {/* Apps trigger */}
          <button
            onClick={() => toggleMenu("apps")}
            className="hover:text-green-400 transition flex items-center gap-1.5"
          >
            <Briefcase size={16} /> Apps
            <ChevronDown
              size={14}
              className={`${openMenu === "apps" ? "rotate-180" : ""} transition`}
            />
          </button>

          {/* Industries trigger */}
          <button
            onClick={() => toggleMenu("industries")}
            className="hover:text-green-400 transition flex items-center gap-1.5"
          >
            <Landmark size={16} /> Industries
            <ChevronDown
              size={14}
              className={`${openMenu === "industries" ? "rotate-180" : ""} transition`}
            />
          </button>

          {/* Community trigger */}
          <button
            onClick={() => toggleMenu("community")}
            className="hover:text-green-400 transition flex items-center gap-1.5"
          >
            <Users size={16} /> Community
            <ChevronDown
              size={14}
              className={`${openMenu === "community" ? "rotate-180" : ""} transition`}
            />
          </button>

          <a href="/pricing" className="hover:text-green-400 transition flex items-center gap-1.5">
            <GiReceiveMoney size={16} /> Pricing
          </a>
          <a href="/contact" className="hover:text-green-400 transition flex items-center gap-1.5">
            <Phone size={16} /> Contact Us
          </a>
        </nav>

        {/* Mobile Menu Icon */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden text-white">
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Mega Menus — centered under the whole navbar, not the trigger */}
      <div className="hidden lg:block">
        {openMenu === "apps" && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] max-w-[92vw] bg-[#0b0f19]/100 backdrop-blur-xl border border-white/10 rounded-b-xl shadow-2xl p-6 grid grid-cols-4 gap-6 animate-fade-slide">
            {APPS_MENU.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-6">
                {column.map((group) => (
                  <div key={group.heading}>
                    <p
                      className={`text-xs font-semibold uppercase tracking-wide mb-2 pb-1.5 border-b border-white/10 ${group.color}`}
                    >
                      {group.heading}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {group.items.map((item) => (
                        <a
                          key={item.title}
                          href={item.path}
                          className="text-xs text-gray-300 hover:text-green-400 transition"
                          onClick={() => setOpenMenu(null)}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {openMenu === "industries" && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] max-w-[92vw] bg-[#0b0f19]/100 backdrop-blur-xl border border-white/10 rounded-b-xl shadow-2xl p-6 animate-fade-slide">
            <div className="grid grid-cols-4 gap-6">
              {INDUSTRIES_MENU.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-6">
                  {column.map((group) => (
                    <div key={group.heading}>
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide mb-2 pb-1.5 border-b border-white/10 ${group.color}`}
                      >
                        {group.heading}
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {group.items.map((item) => (
                          <a
                            key={item.title}
                            href={item.path}
                            className="text-xs text-gray-300 hover:text-green-400 transition"
                            onClick={() => setOpenMenu(null)}
                          >
                            {item.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <a
              href="/industries"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-green-400 mt-6 pt-4 border-t border-white/10"
              onClick={() => setOpenMenu(null)}
            >
              Browse all Industries <span aria-hidden="true">→</span>
            </a>
          </div>
        )}

       {openMenu === "community" && (
          <div className="absolute top-full right-5 mt-3 
          w-[820px] max-w-[92vw] 
          bg-[#0b0f19]/100 backdrop-blur-xl 
          border border-white/10 rounded-b-xl shadow-2xl 
          p-6 grid grid-cols-4 gap-6 animate-fade-slide">

            {COMMUNITY_MENU.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-5">
                {column.map((group, groupIdx) => (
                  <div key={groupIdx}>
                    {group.heading && (
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 pb-1.5 border-b border-white/10 ${group.color}`}>
                        {group.heading}
                      </p>
                    )}
                    <div className="flex flex-col gap-1.5">
                      {group.items.map((item) => (
                        <a
                          key={item.title}
                          href={item.path}
                          className="text-xs text-gray-300 hover:text-green-400 transition"
                          onClick={() => setOpenMenu(null)}
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div className="lg:hidden bg-black/95 text-white flex flex-col gap-1 px-6 py-4 text-sm max-h-[calc(100vh-64px)] overflow-y-auto animate-slide-down">
          <a href="/" className="py-2.5 border-b border-white/10">
            Home
          </a>

          {/* Apps */}
          <div>
            <button
              onClick={() => toggleMobileSection("apps")}
              className="w-full text-left py-2.5 border-b border-white/10 flex justify-between items-center"
            >
              <span>Apps</span>
              <ChevronDown
                size={16}
                className={`${mobileOpenSection === "apps" ? "rotate-180" : ""} transition`}
              />
            </button>
            {mobileOpenSection === "apps" && (
              <div className="pl-3 py-2 space-y-3">
                {APPS_MENU.flat().map((group) => (
                  <div key={group.heading}>
                    <p className="text-[11px] text-green-400/90 font-semibold mb-1">
                      {group.heading}
                    </p>
                    {group.items.map((item) => (
                      <a
                        key={item.title}
                        href={item.path}
                        className="block py-1.5 text-xs text-gray-300 hover:text-white"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Industries */}
          <div>
            <button
              onClick={() => toggleMobileSection("industries")}
              className="w-full text-left py-2.5 border-b border-white/10 flex justify-between items-center"
            >
              <span>Industries</span>
              <ChevronDown
                size={16}
                className={`${mobileOpenSection === "industries" ? "rotate-180" : ""} transition`}
              />
            </button>
            {mobileOpenSection === "industries" && (
              <div className="pl-3 py-2 space-y-3">
                {INDUSTRIES_MENU.flat().map((group) => (
                  <div key={group.heading}>
                    <p className="text-[11px] text-green-400/90 font-semibold mb-1">
                      {group.heading}
                    </p>
                    {group.items.map((item) => (
                      <a
                        key={item.title}
                        href={item.path}
                        className="block py-1.5 text-xs text-gray-300 hover:text-white"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                ))}
                <a href="/industries" className="block py-1.5 text-xs font-semibold text-white">
                  Browse all Industries →
                </a>
              </div>
            )}
          </div>

          {/* Community */}
          <div>
            <button
              onClick={() => toggleMobileSection("community")}
              className="w-full text-left py-2.5 border-b border-white/10 flex justify-between items-center"
            >
              <span>Community</span>
              <ChevronDown
                size={16}
                className={`${mobileOpenSection === "community" ? "rotate-180" : ""} transition`}
              />
            </button>
            {mobileOpenSection === "community" && (
              <div className="pl-3 py-2 space-y-3">
                {COMMUNITY_MENU.flat().map((group, idx) => (
                  <div key={group.heading || idx}>
                    {group.heading && (
                      <p className="text-[11px] text-green-400/90 font-semibold mb-1">
                        {group.heading}
                      </p>
                    )}
                    {group.items.map((item) => (
                      <a
                        key={item.title}
                        href={item.path}
                        className="block py-1.5 text-xs text-gray-300 hover:text-white"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href="/pricing" className="py-2.5">
            Pricing
          </a>
        </div>
      )}
    </header>
  );
}