// src/pages/ComingSoon.jsx
// Shared placeholder for navbar dropdown items (Apps / Industries / Community)
// whose dedicated pages are still under development. Also renders a friendly
// "page not found" state for unknown URLs so no route ever shows a blank screen.
import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Hammer,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  Tag,
  Compass,
  SearchX,
} from "lucide-react";
import Layout from "../Components/Layout";
import { findComingSoonPage, LIVE_SOLUTIONS } from "../data/comingSoonPages";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function ComingSoon({ section }) {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const page = section ? findComingSoonPage(section, slug) : null;

  useEffect(() => {
    document.title = page
      ? `${page.title} | Coming Soon | Abacco Technology`
      : "Page Not Found | Abacco Technology";
    window.scrollTo(0, 0);
  }, [page, pathname]);

  return (
    <Layout>
      <div className="min-h-screen bg-[#0B1220] text-white antialiased">
        {page ? <Placeholder page={page} /> : <NotFound />}
      </div>
    </Layout>
  );
}

/* ---------------------------------------------------------------- */

function Placeholder({ page }) {
  const { section, title, group } = page;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B2E] to-[#0B1220]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-40 -left-32 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 md:pt-36 md:pb-24 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            {/* Breadcrumb */}
            <motion.nav
              variants={fadeUp}
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs text-slate-400"
            >
              <a href="/" className="hover:text-emerald-400 transition">Home</a>
              <span>/</span>
              <span>{section.label}</span>
              {group && (
                <>
                  <span>/</span>
                  <span>{group}</span>
                </>
              )}
            </motion.nav>

            <motion.span
              variants={fadeUp}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400"
            >
              <Sparkles className="h-4 w-4" />
              Coming Soon · {section.eyebrow}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="text-emerald-400">{title}</span>
              <br />
              We're Updating This Page
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg text-slate-300 leading-relaxed max-w-xl"
            >
              {section.intro}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-base text-slate-400 leading-relaxed max-w-xl"
            >
              The full <span className="text-slate-200 font-medium">{title}</span> page is
              currently under development and will be available soon. In the meantime,
              our team is happy to walk you through what's possible today.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#0B1220] shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.03] hover:bg-emerald-400"
              >
                Talk to Our Team
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative h-72 md:h-96"
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-2xl" />
            <div className="relative h-full w-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute h-56 w-56 md:h-64 md:w-64 rounded-full border-2 border-dashed border-emerald-500/40"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-36 w-36 md:h-40 md:w-40 items-center justify-center rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-500/30"
              >
                <Hammer className="h-16 w-16 md:h-20 md:w-20 text-[#0B1220]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 left-0 md:top-4 md:left-4 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">In Progress</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-4 right-0 md:bottom-6 md:right-2 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Launching Soon</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What to expect */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold">
            What to expect
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-slate-400 max-w-2xl">
            Here's what we're preparing for the {title} page.
          </motion.p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {section.expectations.map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                className="rounded-2xl bg-[#111C2E] p-6 ring-1 ring-slate-800 transition hover:ring-emerald-500/40"
              >
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <p className="mt-4 text-sm text-slate-300 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* In the meantime */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-5"
        >
          <MeantimeCard
            icon={MessageSquare}
            title="Speak with an expert"
            desc={`Tell us about your requirements for ${title} and we'll show you how Abacco can help today.`}
            href="/contact"
            cta="Contact us"
          />
          <MeantimeCard
            icon={Tag}
            title="See our pricing"
            desc="Simple, transparent plans for businesses of every size, with no hidden costs."
            href="/pricing"
            cta="View pricing"
          />
          <motion.div
            variants={fadeUp}
            className="rounded-2xl bg-[#111C2E] p-6 ring-1 ring-slate-800"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Compass className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Explore live solutions</h3>
            <ul className="mt-3 space-y-2">
              {LIVE_SOLUTIONS.map((s) => (
                <li key={s.path}>
                  <a
                    href={s.path}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-emerald-400 transition"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

function MeantimeCard({ icon: Icon, title, desc, href, cta }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col rounded-2xl bg-[#111C2E] p-6 ring-1 ring-slate-800"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-400 leading-relaxed">{desc}</p>
      <a
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  );
}

function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B2E] to-[#0B1220]" />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="relative mx-auto max-w-3xl px-6 pt-36 pb-28 text-center"
      >
        <motion.div
          variants={fadeUp}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 ring-1 ring-emerald-500/30"
        >
          <SearchX className="h-10 w-10 text-emerald-400" />
        </motion.div>
        <motion.h1 variants={fadeUp} className="mt-8 text-4xl md:text-5xl font-bold tracking-tight">
          Page not found
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-300">
          The page you're looking for doesn't exist or may have moved. Use the menu above
          to find what you need, or head back to the homepage.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#0B1220] shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.03] hover:bg-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-emerald-400 hover:text-emerald-400"
          >
            Contact Us
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}