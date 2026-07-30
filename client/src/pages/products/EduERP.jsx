import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  CreditCard,
  FileSpreadsheet,
  MessageCircle,
  UserCog,
  BarChart3,
  Cloud,
  ShieldCheck,
  MousePointerClick,
  Headphones,
  ArrowUpRight,
  PlayCircle,
  BookOpen,
  Award,
} from "lucide-react";
import Layout from '../../Components/Layout'
const EDU_ERP_URL = "https://www.eduabaccotech.com";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const features = [
  { icon: Users, title: "Student Management", desc: "Centralized student records, profiles, and academic history." },
  { icon: ClipboardCheck, title: "Admission Management", desc: "Digitize enquiries, applications, and enrollment workflows." },
  { icon: MousePointerClick, title: "Attendance", desc: "Automated daily attendance tracking for students and staff." },
  { icon: CreditCard, title: "Fee Management", desc: "Online fee collection, invoicing, and payment tracking." },
  { icon: FileSpreadsheet, title: "Examination", desc: "Exam scheduling, grading, and digital report cards." },
  { icon: MessageCircle, title: "Parent Portal", desc: "Real-time updates on attendance, grades, and fees." },
  { icon: UserCog, title: "Teacher Portal", desc: "Lesson planning, gradebooks, and classroom tools." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Actionable insights across every module in one view." },
];

const benefits = [
  { icon: Cloud, title: "Cloud Based", desc: "Access your institution's data anytime, from anywhere." },
  { icon: ShieldCheck, title: "Secure Platform", desc: "Enterprise-grade security protecting sensitive data." },
  { icon: MousePointerClick, title: "Easy to Use", desc: "Intuitive interface built for staff, teachers, and parents." },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated support whenever your institution needs it." },
];

export default function EduERP() {
  return (
    <Layout>
    <div className="min-h-screen bg-[#0B1220] text-white antialiased">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B2E] to-[#0B1220]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-40 -left-32 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-14 items-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400"
            >
              <GraduationCap className="h-4 w-4" />
              Abacco Technology · Product Overview
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
            >
              Abacco{" "}
              <span className="text-emerald-400">Edu ERP</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 text-lg text-slate-300 leading-relaxed max-w-xl">
              A complete cloud-based Education Management Software designed for
              Schools, Colleges, Universities, and Educational Institutions.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href={EDU_ERP_URL}
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

          {/* Education-themed illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative h-80 md:h-96"
          >
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-2xl" />
            <div className="relative h-full w-full flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-40 w-40 items-center justify-center rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-500/30"
              >
                <GraduationCap className="h-20 w-20 text-[#0B1220]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <BookOpen className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Curriculum</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-6 right-2 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <Award className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Results</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-10 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Insights</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Edu ERP */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight">
            About Edu ERP
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-slate-300 leading-relaxed">
            Abacco Edu ERP brings every part of running an educational institution
            into a single, connected platform. From student management and
            admissions to attendance and fee management, institutions can replace
            scattered spreadsheets and paperwork with one streamlined system.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-slate-300 leading-relaxed">
            The platform covers the full academic lifecycle — examinations,
            report cards, and dedicated portals for parents and teachers — so
            everyone stays informed and connected in real time.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-slate-300 leading-relaxed">
            Being fully cloud based, secure, and easy to use, Abacco Edu ERP
            helps schools, colleges, and universities focus on education while
            the software handles the administration.
          </motion.p>
        </motion.div>
      </section>

      {/* 3. Key Features */}
      <section className="bg-[#0F1B2E] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
            <p className="mt-3 text-slate-400">Everything your institution needs, built in.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-[#111C2E] p-6 ring-1 ring-slate-700/60 transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 hover:ring-emerald-500/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
                  <Icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Abacco Edu ERP */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Abacco Edu ERP</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {benefits.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-700/60 p-6 text-center transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/30"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
                <Icon className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 5. Final CTA */}
      <section id="book-demo" className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl bg-[#0F1B2E] border border-emerald-500/20 px-8 py-16 text-center"
        >
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Want to Learn More About Abacco Edu ERP?
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto leading-relaxed">
              Visit our dedicated Education ERP website to explore all features,
              modules, pricing, and request a live demo.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={EDU_ERP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#0B1220] shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.03] hover:bg-emerald-400"
              >
                Visit Edu ERP Website
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={EDU_ERP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                <PlayCircle className="h-4 w-4" />
                Book Demo
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
    </Layout>
  );
}