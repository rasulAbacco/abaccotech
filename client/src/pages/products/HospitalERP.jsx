// src/pages/HospitalERP.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  UserPlus,
  ClipboardList,
  CalendarCheck,
  UserCog,
  Pill,
  FlaskConical,
  Receipt,
  BarChart3,
  FileText,
  Cloud,
  ShieldCheck,
  Building2,
  Gauge,
  Network,
  Activity,
  ArrowUpRight,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";

const WEBSITE_URL = "https://healthcare-t5hc.onrender.com/";
import Layout from '../../Components/Layout'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const aboutPoints = [
  "Patient Registration",
  "OPD Management",
  "IPD Management",
  "Appointment Scheduling",
  "Doctor Management",
  "Pharmacy Management",
  "Laboratory Management",
  "Billing & Insurance",
  "Electronic Medical Records (EMR)",
  "Reports & Analytics",
];

const features = [
  { icon: UserPlus, title: "Patient Registration", desc: "Quick, structured intake for every patient across every branch." },
  { icon: Stethoscope, title: "OPD & IPD Management", desc: "Manage outpatient visits and inpatient admissions from one system." },
  { icon: CalendarCheck, title: "Appointment Scheduling", desc: "Doctor calendars, slots, and follow-ups organized in real time." },
  { icon: UserCog, title: "Doctor Management", desc: "Track doctor schedules, departments, and consultation history." },
  { icon: Pill, title: "Pharmacy Management", desc: "Stock, dispense, and reorder medicines without the paperwork." },
  { icon: FlaskConical, title: "Laboratory Management", desc: "Test orders, sample tracking, and reports in a single workflow." },
  { icon: Receipt, title: "Billing & Insurance", desc: "Accurate, itemized billing with built-in insurance handling." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Revenue, occupancy, and department performance at a glance." },
];

const benefits = [
  { icon: Activity, title: "Complete Hospital Automation", desc: "Every workflow, from registration to discharge, handled digitally." },
  { icon: Cloud, title: "Cloud Based & Secure", desc: "Your hospital data, protected and accessible from anywhere." },
  { icon: Gauge, title: "Faster Patient Care", desc: "Streamlined workflows cut wait times across every department." },
  { icon: Network, title: "Multi Hospital & Multi Branch Support", desc: "Run every location and every team from one account." },
];

export default function HospitalERP() {
  return (
    <Layout>
    <div className="min-h-screen bg-[#0B1220] text-white antialiased">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B2E] to-[#0B1220]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400"
            >
              <Stethoscope className="h-4 w-4" />
              Abacco Technology · Product Overview
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]"
            >
              Abacco <span className="text-emerald-400">Hospital ERP</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              A complete cloud-based Hospital Management Software designed for
              Hospitals, Clinics, Diagnostic Centers, Multi-Specialty
              Hospitals, and Healthcare Organizations.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#0B1220] shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.03] hover:bg-emerald-400"
              >
                Visit Website
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#book-demo"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                <PlayCircle className="h-4 w-4" />
                Book Demo
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Horizontal dashboard-style illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto max-w-5xl px-6 pb-20"
        >
          <div className="rounded-3xl bg-[#111C2E] ring-1 ring-slate-700/60 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-[#0B1220] p-5 ring-1 ring-slate-700/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                <UserPlus className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-400">Patients Today</p>
                <p className="font-semibold">1,204</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-[#0B1220] p-5 ring-1 ring-slate-700/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                <ClipboardList className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-400">Beds Occupied</p>
                <p className="font-semibold">86 / 120</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-[#0B1220] p-5 ring-1 ring-slate-700/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                <Receipt className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-400">Billing</p>
                <p className="font-semibold">Insurance Ready</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. About — split layout: text left, checklist right */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight">
            About Abacco Hospital ERP
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-slate-300 leading-relaxed">
            Abacco Hospital ERP helps hospitals, clinics, and diagnostic
            centers manage their entire operation from one platform — from
            the moment a patient registers to the final bill.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-slate-300 leading-relaxed">
            Built for multi-branch healthcare organizations, it's fully cloud
            based so administrators, doctors, and staff can manage patients,
            records, and inventory from anywhere, backed by secure,
            real-time reports and analytics.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="rounded-2xl bg-[#111C2E] ring-1 ring-slate-700/60 p-6 md:p-8"
        >
          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
            {aboutPoints.map((point) => (
              <div key={point} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-sm text-slate-200">{point}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Key Features — numbered list, two columns */}
      <section className="bg-[#0F1B2E] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
            <p className="mt-3 text-slate-400">Every step of your hospital workflow, covered.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-x-10 gap-y-8"
          >
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-mono text-emerald-400/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                </div>
                <div className="pb-6 border-b border-slate-700/50 flex-1">
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose — asymmetric bento panel */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Abacco Hospital ERP</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-5"
        >
          {benefits.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`rounded-2xl ring-1 ring-slate-700/60 p-7 transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 hover:ring-emerald-500/30 ${
                i === 0 ? "bg-[#111C2E] md:col-span-2 flex items-center gap-6" : "bg-[#111C2E]"
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <Icon className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="font-semibold text-white text-lg">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. Final CTA — split layout */}
      <section id="book-demo" className="mx-auto max-w-6xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-[#0F1B2E] border border-emerald-500/20 px-8 py-14 md:py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center"
        >
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative text-center md:text-left">
            <div className="inline-flex md:hidden items-center justify-center h-12 w-12 rounded-full bg-emerald-500/15 mb-4">
              <Building2 className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ready to Transform Your Healthcare Management?
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl leading-relaxed">
              Visit our dedicated Hospital ERP website to explore all
              features, modules, pricing, and request a live demo.
            </p>
          </div>

          <div className="relative flex flex-col gap-3 w-full md:w-auto">
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#0B1220] shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.03] hover:bg-emerald-400 whitespace-nowrap"
            >
              Visit Hospital ERP Website
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-emerald-400 hover:text-emerald-400 whitespace-nowrap"
            >
              <PlayCircle className="h-4 w-4" />
              Book Demo
            </a>
          </div>
        </motion.div>
      </section>
    </div>
    </Layout>
  );
}