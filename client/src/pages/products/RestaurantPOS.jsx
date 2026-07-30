import React from "react";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Receipt,
  LayoutGrid,
  ChefHat,
  ShoppingBag,
  Package,
  Wallet,
  BarChart3,
  Cloud,
  Zap,
  Gauge,
  Headphones,
  ArrowUpRight,
  PlayCircle,
  Soup,
  Timer,
} from "lucide-react";
import Layout from '../../Components/Layout'

const POS_URL = "https://abacco-restaurant.onrender.com";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const features = [
  { icon: Receipt, title: "POS Billing", desc: "Fast, accurate billing built for busy counters and dine-in." },
  { icon: LayoutGrid, title: "Table Management", desc: "Real-time table status, merge, split, and reservations." },
  { icon: ChefHat, title: "Kitchen Display (KDS)", desc: "Digital order tickets synced live to the kitchen screen." },
  { icon: ShoppingBag, title: "Online Ordering", desc: "Accept and manage orders from your own online storefront." },
  { icon: Timer, title: "Takeaway Management", desc: "Streamlined takeaway queue with order tracking." },
  { icon: Package, title: "Inventory Management", desc: "Track stock, recipes, and wastage in real time." },
  { icon: Wallet, title: "Payment & Billing", desc: "Multiple payment modes with instant, error-free settlement." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Sales, staff, and menu insights across every branch." },
];

const benefits = [
  { icon: Zap, title: "Fast Billing", desc: "Serve more customers with quick, reliable checkout." },
  { icon: Cloud, title: "Cloud Based", desc: "Manage every branch from anywhere, in real time." },
  { icon: Gauge, title: "Real-Time Reports", desc: "Live sales and performance data whenever you need it." },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated support to keep your operations running." },
];

export default function RestaurantPOS() {
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
              <UtensilsCrossed className="h-4 w-4" />
              Abacco Technology · Product Overview
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
            >
              Abacco{" "}
              <span className="text-emerald-400">Restaurant POS</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 text-lg text-slate-300 leading-relaxed max-w-xl">
              A complete cloud-based Restaurant Management & POS Software
              designed for Restaurants, Cafes, Hotels, Food Courts, Cloud
              Kitchens, and Multi-Branch Food Businesses.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href={POS_URL}
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

          {/* Restaurant-themed illustration */}
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
                <Soup className="h-20 w-20 text-[#0B1220]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 left-4 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <Receipt className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Billing</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-6 right-2 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <ChefHat className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Kitchen</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-10 flex items-center gap-2 rounded-2xl bg-[#111C2E] px-4 py-3 shadow-xl ring-1 ring-slate-700"
              >
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Sales</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Restaurant POS */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight">
            About Restaurant POS
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-slate-300 leading-relaxed">
            Abacco Restaurant POS brings billing, table management, and kitchen
            operations together in one connected system. From fast POS billing
            and live table status to a Kitchen Display System that keeps orders
            moving, every part of the front and back of house stays in sync.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-slate-300 leading-relaxed">
            Take orders online or as takeaway, manage inventory and recipes,
            and process payments and billing without the usual friction. The
            platform covers the full order lifecycle, from the first click to
            the final receipt.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-slate-300 leading-relaxed">
            With built-in reports and analytics, and a fully cloud based,
            secure, and easy-to-use platform, Abacco Restaurant POS helps
            restaurants, cafes, and multi-branch food businesses run smoother
            service every day.
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
            <p className="mt-3 text-slate-400">Everything your restaurant needs, built in.</p>
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

      {/* 4. Why Choose Abacco Restaurant POS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Abacco Restaurant POS</h2>
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
              Ready to Simplify Your Restaurant Operations?
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto leading-relaxed">
              Visit our dedicated Restaurant POS website to explore all
              features, modules, pricing, and request a live demo.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={POS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-[#0B1220] shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.03] hover:bg-emerald-400"
              >
                Visit Restaurant POS Website
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={POS_URL}
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