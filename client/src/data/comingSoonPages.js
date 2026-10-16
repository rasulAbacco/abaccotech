// src/data/comingSoonPages.js
// Placeholder ("Coming Soon") content for navbar dropdown items that don't
// have a dedicated page yet. Keys are the URL slugs used in Navbar.jsx.
//
// When a real page is built for an item, add its own <Route> in App.jsx —
// static routes always win over the "/:slug" placeholder routes, so the
// entry here can simply be removed afterwards.

export const COMING_SOON_SECTIONS = {
  apps: {
    label: "Apps",
    eyebrow: "Abacco Apps",
    intro:
      "We're building this app as part of the Abacco business suite: one connected platform where every app shares the same data, users and workflows.",
    expectations: [
      "Fully integrated with the rest of the Abacco suite",
      "Cloud-hosted, secure and accessible from any device",
      "Clean, intuitive interface your team can adopt quickly",
      "Configurable workflows that fit the way you work",
    ],
    groups: {
      Finance: {
        accounting: "Accounting",
        invoicing: "Invoicing",
        expenses: "Expenses",
        "spreadsheet-bi": "Spreadsheet (BI)",
        documents: "Documents",
        sign: "Sign",
      },
      "Human Resources": {
        employees: "Employees",
        recruitment: "Recruitment",
        "time-off": "Time Off",
        appraisals: "Appraisals",
        referrals: "Referrals",
        fleet: "Fleet",
      },
      Sales: {
        crm: "CRM",
        sales: "Sales",
        "pos-shop": "POS Shop",
        "pos-restaurant": "POS Restaurant",
        subscriptions: "Subscriptions",
        rental: "Rental",
      },
      Marketing: {
        "social-marketing": "Social Marketing",
        "email-marketing": "Email Marketing",
        "sms-marketing": "SMS Marketing",
        events: "Events",
        "marketing-automation": "Marketing Automation",
        surveys: "Surveys",
      },
      Websites: {
        "website-builder": "Website Builder",
        ecommerce: "eCommerce",
        blog: "Blog",
        forum: "Forum",
        "live-chat": "Live Chat",
        elearning: "eLearning",
      },
      Services: {
        project: "Project",
        timesheets: "Timesheets",
        "field-service": "Field Service",
        helpdesk: "Helpdesk",
        planning: "Planning",
        appointments: "Appointments",
      },
      "Supply Chain": {
        inventory: "Inventory",
        manufacturing: "Manufacturing",
        plm: "PLM",
        purchase: "Purchase",
        maintenance: "Maintenance",
        quality: "Quality",
      },
      Productivity: {
        discuss: "Discuss",
        "artificial-intelligence": "Artificial Intelligence",
        iot: "IoT",
        voip: "VoIP",
        knowledge: "Knowledge",
        whatsapp: "WhatsApp",
      },
    },
  },

  industries: {
    label: "Industries",
    eyebrow: "Industry Solutions",
    intro:
      "We're preparing a dedicated solution page for this industry, covering the workflows, modules and real-world use cases that matter most to businesses like yours.",
    expectations: [
      "Industry-specific modules and ready-to-use workflows",
      "Real-world use cases and implementation guidance",
      "Transparent pricing tailored to your business size",
      "Live demo and onboarding support from our team",
    ],
    groups: {
      Retail: {
        "book-store": "Book Store",
        "clothing-store": "Clothing Store",
        "furniture-store": "Furniture Store",
        "grocery-store": "Grocery Store",
        "hardware-store": "Hardware Store",
        "toy-store": "Toy Store",
      },
      Manufacturing: {
        textile: "Textile",
        metal: "Metal",
        furnitures: "Furnitures",
        food: "Food",
        brewery: "Brewery",
        "corporate-gifts": "Corporate Gifts",
      },
      "Food & Hospitality": {
        "bar-and-pub": "Bar and Pub",
        "fast-food": "Fast Food",
        "guest-house": "Guest House",
        "beverage-distributor": "Beverage Distributor",
        hotel: "Hotel",
      },
      "Health & Fitness": {
        "sports-club": "Sports Club",
        "eyewear-store": "Eyewear Store",
        "fitness-center": "Fitness Center",
        "wellness-practitioners": "Wellness Practitioners",
        pharmacy: "Pharmacy",
        "hair-salon": "Hair Salon",
      },
      "Real Estate": {
        "real-estate-agency": "Real Estate Agency",
        "architecture-firm": "Architecture Firm",
        construction: "Construction",
        "property-management": "Property Management",
        gardening: "Gardening",
        "property-owner-association": "Property Owner Association",
      },
      Trades: {
        handyman: "Handyman",
        "it-hardware-support": "IT Hardware & Support",
        "solar-energy-systems": "Solar Energy Systems",
        "shoe-maker": "Shoe Maker",
        "cleaning-services": "Cleaning Services",
        "hvac-services": "HVAC Services",
      },
      Consulting: {
        "accounting-firm": "Accounting Firm",
        "abacco-partner": "Abacco Partner",
        "marketing-agency": "Marketing Agency",
        "law-firm": "Law Firm",
        "talent-acquisition": "Talent Acquisition",
        "audit-certification": "Audit & Certification",
      },
      Others: {
        "billboard-rental": "Billboard Rental",
        photography: "Photography",
        "bike-leasing": "Bike Leasing",
        "software-reseller": "Software Reseller",
      },
    },
  },

  community: {
    label: "Community",
    eyebrow: "Abacco Community",
    intro:
      "We're putting together this part of the Abacco community: resources, programs and people to help you learn, grow and get the most out of our platform.",
    expectations: [
      "Practical resources curated by the Abacco team",
      "Opportunities to connect with partners and peers",
      "Regular updates as new content is published",
      "Direct access to our support and advisory teams",
    ],
    groups: {
      Learn: {
        tutorials: "Tutorials",
        documentation: "Documentation",
        certifications: "Certifications",
        training: "Training",
        blog: "Blog",
        podcast: "Podcast",
      },
      "Empower Education": {
        "education-program": "Education Program",
        "scale-up-business-game": "Scale Up! Business Game",
        "visit-abacco": "Visit Abacco",
      },
      "Get the Software": {
        download: "Download",
        "compare-editions": "Compare Editions",
        releases: "Releases",
      },
      Collaborate: {
        github: "GitHub",
        forum: "Forum",
        events: "Events",
        translations: "Translations",
        "become-a-partner": "Become a Partner",
        "services-for-partners": "Services for Partners",
        "register-accounting-firm": "Register your Accounting Firm",
        "affiliate-program": "Affiliate Program",
      },
      "Get Services": {
        "find-a-partner": "Find a Partner",
        "find-an-accountant": "Find an Accountant",
        "meet-an-advisor": "Meet an Advisor",
        "implementation-services": "Implementation Services",
        "customer-references": "Customer References",
        support: "Support",
        upgrades: "Upgrades",
      },
    },
  },
};

// Pages that are already live, shown on placeholders as "explore in the meantime".
export const LIVE_SOLUTIONS = [
  { title: "Restaurant POS", path: "/industries/restaurant" },
  { title: "Education ERP", path: "/industries/EduERP" },
  { title: "Abacco Garage ERP", path: "/industries/AbaccoGarage" },
];

/** Look up a placeholder entry. Returns null for unknown slugs. */
export function findComingSoonPage(section, slug) {
  const sec = COMING_SOON_SECTIONS[section];
  if (!sec) return null;
  if (!slug) {
    // Section index page, e.g. "/industries" (Browse all Industries)
    return { section: sec, title: `All ${sec.label}`, group: null };
  }
  const key = slug.toLowerCase();
  for (const [group, items] of Object.entries(sec.groups)) {
    if (items[key]) return { section: sec, title: items[key], group };
  }
  return null;
}