import React, { useEffect, useState } from "react";
import {
  ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown, Clock3, Code2,
  Database, Globe2, Mail, MapPin, MessageCircle, Phone, ShieldCheck,
  Smartphone, Workflow, Building2, BriefcaseBusiness
} from "lucide-react";
import Layout from "../Components/Layout";
import "./Contact.css";

const CONTACT = {
  email: "info@abaccotech.com",
  phoneDisplay: "+91 99724 52044",
  phoneLink: "+919972452044",
  address: "No 12, 13 & 12/A, Kirthan Arcade, 3rd Floor, Aditya Nagar, Sandeep Unnikrishnan Road, Bangalore - 560097",
};
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONTACT.address);

const INTEREST_OPTIONS = [
  "The Motor Desk",
  "Motor Konnect",
  "Abacco Education ERP",
  "Restaurant Billing",
  "Super Market Billing",
  "Custom CRM",
  "Custom ERP",
  "Website Development",
  "Mobile App Development",
  "Other",
];

const projectTypes = [
  { icon: Globe2, title: "Websites & web applications", text: "Business websites, portals, and tailored web experiences." },
  { icon: Smartphone, title: "Mobile applications", text: "Mobile app concepts, builds, and connected digital services." },
  { icon: Database, title: "Custom CRM & ERP", text: "Business systems aligned to your team's real workflows." },
  { icon: BriefcaseBusiness, title: "Billing & business software", text: "Billing, inventory, sales, and operations software." },
  { icon: Workflow, title: "Integrations & automation", text: "Connect systems and reduce repetitive manual steps." },
  { icon: Code2, title: "Product improvements", text: "Discuss an existing product, enhancement, or technical requirement." },
];

const faqs = [
  {
    question: "How do I request a quote?",
    answer: "Share your requirements using the enquiry form or contact us directly by email or phone. Helpful details include your main goal, the users involved, and any deadline or existing system we should consider.",
  },
  {
    question: "Which Abacco product is right for my business?",
    answer: "Choose a product from the Interested In list and tell us about your day-to-day needs. Our team can discuss the product's intended use and help you identify the best next step.",
  },
  {
    question: "Can you build a custom CRM or ERP?",
    answer: "Yes, you can contact us to discuss a custom CRM, ERP, billing system, reporting dashboard, integration, or workflow automation. The scope and delivery approach are defined after understanding your requirements.",
  },
  {
    question: "Does submitting this form send my enquiry directly?",
    answer: "This page currently prepares an email in your device's default email application. You must review and send that email yourself. Direct website submission requires a backend or an approved form service to be connected.",
  },
];

function ContactInfoCard({ icon: Icon, title, value, detail, href, external = false }) {
  const content = (
    <>
      <span className="contact-info-icon"><Icon size={21} aria-hidden="true" /></span>
      <span className="contact-info-copy">
        <span className="contact-info-title">{title}</span>
        <strong>{value}</strong>
        <span className="contact-info-detail">{detail}</span>
      </span>
      <ArrowUpRight className="contact-info-arrow" size={17} aria-hidden="true" />
    </>
  );
  return href ? <a className="contact-info-card" href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{content}</a> : <div className="contact-info-card">{content}</div>;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessEmail: "",
    phone: "",
    company: "",
    interestedIn: "",
    budget: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const oldTitle = document.title;
    const descriptionText = "Contact Abacco Technology to discuss business software, automotive and education products, websites, mobile apps, custom CRM and ERP development.";
    document.title = "Contact Us | Abacco Technology";
    let description = document.querySelector('meta[name="description"]');
    const created = !description;
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    const oldDescription = description.content;
    description.content = descriptionText;
    return () => {
      document.title = oldTitle;
      if (created) description.remove();
      else description.content = oldDescription;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (formStatus.type) setFormStatus({ type: "", message: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setFormStatus({ type: "error", message: "Please check the highlighted fields and try again." });
      return;
    }

    setFormStatus({ type: "preparing", message: "Preparing an email draft…" });
    const subject = "Project enquiry — " + formData.interestedIn;
    const body = [
      "Project enquiry for Abacco Technology",
      "",
      "Full name: " + formData.fullName,
      "Business email: " + formData.businessEmail,
      "Phone: " + formData.phone,
      "Company: " + (formData.company || "Not provided"),
      "Interested in: " + formData.interestedIn,
      "Project budget: " + (formData.budget || "Not specified"),
      "",
      "Message:",
      formData.message,
    ].join("\n");

    try {
      window.location.href = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      setFormStatus({
        type: "draft",
        message: "Your email application should open with a prepared draft. Review it and press Send in that application. This website has not sent the enquiry directly.",
      });
    } catch {
      setFormStatus({
        type: "error",
        message: "We couldn't open your email application. Please email " + CONTACT.email + " directly instead.",
      });
    }
  };

  return (
    <Layout>
      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-orb contact-orb-one" aria-hidden="true" />
          <div className="contact-hero-orb contact-orb-two" aria-hidden="true" />
          <div className="contact-container contact-hero-inner">
            <div className="contact-hero-copy">
              <span className="contact-eyebrow"><span /> CONTACT ABACCO</span>
              <h1>Let's Talk About Your <em>Next Project</em></h1>
              <p>Tell us about your business requirements, software idea, or questions about our products. Our team is ready to discuss the next steps.</p>
              <a className="contact-button contact-button-primary" href="#contact-form">Tell Us About Your Project <ArrowRight size={17} /></a>
              <div className="contact-hero-reassurance"><ShieldCheck size={16} /> Your enquiry details are used to help respond to your request.</div>
            </div>
            <div className="contact-hero-art" aria-hidden="true">
              <div className="contact-art-halo" />
              <div className="contact-art-window">
                <div className="contact-art-window-top"><span /><span /><span /><b>Project workspace</b></div>
                <div className="contact-art-window-content"><div className="contact-art-sidebar"><i /><i /><i /><i /></div><div className="contact-art-main"><div className="contact-art-heading" /><div className="contact-art-cards"><i /><i /><i /></div><div className="contact-art-lines"><i /><i /><i /><i /></div><div className="contact-art-progress"><span /></div></div></div>
              </div>
              <div className="contact-art-message"><MessageCircle size={18} /><span><b>Let's connect</b><small>Ideas start with a conversation</small></span></div>
              <div className="contact-art-code"><Code2 size={22} /></div>
            </div>
          </div>
        </section>

        <section className="contact-details-section" aria-labelledby="contact-details-title">
          <div className="contact-container">
            <div className="contact-section-heading contact-heading-left">
              <span className="contact-eyebrow">GET IN TOUCH</span>
              <h2 id="contact-details-title">We're easy to reach.</h2>
              <p>Choose the contact method that works best for you.</p>
            </div>
            <div className="contact-info-grid">
              <ContactInfoCard icon={Mail} title="Email our team" value={CONTACT.email} detail="Send us your project questions" href={"mailto:" + CONTACT.email} />
              <ContactInfoCard icon={Phone} title="Call our team" value={CONTACT.phoneDisplay} detail="Talk through your requirements" href={"tel:" + CONTACT.phoneLink} />
              <ContactInfoCard icon={MapPin} title="Visit our office" value="Bengaluru, Karnataka" detail="View the published office address" href={MAPS_URL} external />
            </div>
            <div className="contact-address-strip"><MapPin size={19} /><div><strong>Office address</strong><p>{CONTACT.address}</p></div><a href={MAPS_URL} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={15} /></a></div>
          </div>
        </section>

        <section className="contact-form-section" id="contact-form">
          <div className="contact-container contact-form-layout">
            <div className="contact-form-intro">
              <span className="contact-eyebrow">START A CONVERSATION</span>
              <h2>Tell us what you have in mind.</h2>
              <p>Whether you have a clear specification or are still exploring an idea, share a few details and we can take it from there.</p>
              <div className="contact-form-points">
                <div><span><CheckCircle2 size={18} /></span><p><strong>Understand your needs</strong><small>Tell us about your goals and current challenges.</small></p></div>
                <div><span><CheckCircle2 size={18} /></span><p><strong>Discuss the right approach</strong><small>We can explore existing products or custom development.</small></p></div>
                <div><span><CheckCircle2 size={18} /></span><p><strong>Plan the next step</strong><small>Share any useful context, budget, or timing.</small></p></div>
              </div>
              <div className="contact-direct-note"><Mail size={18} /><span>Prefer email? <a href={"mailto:" + CONTACT.email}>{CONTACT.email}</a></span></div>
            </div>

            <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
              <div className="contact-form-card-heading"><span className="contact-form-symbol"><MessageCircle size={20} /></span><div><h3>Project enquiry</h3><p>Fields marked * are required.</p></div></div>
              <div className="contact-form-grid">
                <div className="contact-field"><label htmlFor="contact-fullName">Full Name <span>*</span></label><input id="contact-fullName" name="fullName" autoComplete="name" placeholder="Your full name" value={formData.fullName} onChange={handleChange} required minLength={2} /></div>
                <div className="contact-field"><label htmlFor="contact-businessEmail">Business Email <span>*</span></label><input id="contact-businessEmail" name="businessEmail" type="email" autoComplete="email" placeholder="you@company.com" value={formData.businessEmail} onChange={handleChange} required /></div>
                <div className="contact-field"><label htmlFor="contact-phone">Phone Number <span>*</span></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 ..." value={formData.phone} onChange={handleChange} required minLength={7} /></div>
                <div className="contact-field"><label htmlFor="contact-company">Company Name <small>(optional)</small></label><input id="contact-company" name="company" autoComplete="organization" placeholder="Your company" value={formData.company} onChange={handleChange} /></div>
                <div className="contact-field"><label htmlFor="contact-interestedIn">Interested In <span>*</span></label><div className="contact-select-wrap"><select id="contact-interestedIn" name="interestedIn" value={formData.interestedIn} onChange={handleChange} required><option value="" disabled>Select a product or service</option>{INTEREST_OPTIONS.map((option) => <option value={option} key={option}>{option}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div></div>
                <div className="contact-field"><label htmlFor="contact-budget">Project Budget <small>(optional)</small></label><div className="contact-select-wrap"><select id="contact-budget" name="budget" value={formData.budget} onChange={handleChange}><option value="">Choose a budget range</option><option value="Not decided yet">Not decided yet</option><option value="Under ₹50,000">Under ₹50,000</option><option value="₹50,000–₹2,00,000">₹50,000–₹2,00,000</option><option value="₹2,00,000–₹5,00,000">₹2,00,000–₹5,00,000</option><option value="₹5,00,000+">₹5,00,000+</option><option value="Prefer to discuss">Prefer to discuss</option></select><ChevronDown size={16} aria-hidden="true" /></div></div>
                <div className="contact-field contact-field-full"><label htmlFor="contact-message">Message <span>*</span></label><textarea id="contact-message" name="message" placeholder="Tell us a little about your project, requirements, or questions..." rows={5} value={formData.message} onChange={handleChange} required minLength={10} /></div>
              </div>
              {formStatus.message && <div className={"contact-form-status " + formStatus.type} role="status" aria-live="polite">{formStatus.type === "preparing" && <span className="contact-loading-spinner" aria-hidden="true" />}{formStatus.type === "draft" && <CheckCircle2 size={18} />}{formStatus.type === "error" && <ShieldCheck size={18} />}{formStatus.message}</div>}
              <button className="contact-button contact-button-primary contact-submit" type="submit" disabled={formStatus.type === "preparing"}>{formStatus.type === "preparing" ? "Preparing email…" : "Prepare Email Enquiry"} <ArrowRight size={16} /></button>
              <p className="contact-privacy-note"><ShieldCheck size={15} /> Please avoid including passwords or sensitive personal information. Selecting the button opens your email application; you must send the message from there.</p>
            </form>
          </div>
        </section>

        <section className="contact-projects-section">
          <div className="contact-container">
            <div className="contact-section-heading"><span className="contact-eyebrow">HOW WE CAN HELP</span><h2>Let's make your next idea practical.</h2><p>Talk to us about a new digital product or a better way to manage your business operations.</p></div>
            <div className="contact-project-grid">{projectTypes.map(({icon: Icon,title,text})=><article className="contact-project-card" key={title}><span><Icon size={21} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>

        <section className="contact-map-section">
          <div className="contact-container contact-map-panel">
            <div className="contact-map-copy"><span className="contact-eyebrow">FIND OUR OFFICE</span><h2>Let's meet in Bengaluru.</h2><p>{CONTACT.address}</p><a className="contact-button contact-button-primary" href={MAPS_URL} target="_blank" rel="noopener noreferrer">Open Google Maps <ArrowUpRight size={16} /></a></div>
            <a className="contact-map-visual" href={MAPS_URL} target="_blank" rel="noopener noreferrer" aria-label="Open Abacco Technology's published office address in Google Maps"><div className="contact-map-grid" aria-hidden="true" /><div className="contact-map-road road-one" /><div className="contact-map-road road-two" /><div className="contact-map-road road-three" /><div className="contact-map-pin"><MapPin size={28} fill="currentColor" /><span>Abacco Technology</span></div><div className="contact-map-caption"><MapPin size={15} /> Open location in Google Maps <ArrowUpRight size={15} /></div></a>
          </div>
        </section>

        <section className="contact-faq-section">
          <div className="contact-container contact-faq-layout">
            <div className="contact-faq-heading"><span className="contact-eyebrow">QUICK ANSWERS</span><h2>Questions before we talk?</h2><p>Here are a few useful things to know before sending your enquiry.</p><a href={"mailto:" + CONTACT.email}>Still have a question? Email us <ArrowRight size={15} /></a></div>
            <div className="contact-faq-list">{faqs.map((faq,index)=><details className="contact-faq-item" key={faq.question} open={index===0}><summary>{faq.question}<ChevronDown size={18} /></summary><p>{faq.answer}</p></details>)}</div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
