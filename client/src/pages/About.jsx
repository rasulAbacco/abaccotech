import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  BookOpen,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Palette,
  Rocket,
  ShieldCheck,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
  UtensilsCrossed,
  Store,
  CarFront,
} from "lucide-react";
import Layout from "../Components/Layout";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const values = [
  {
    title: "Innovation",
    description:
      "We explore useful technologies and approaches to create thoughtful, forward-looking solutions.",
    icon: Lightbulb,
  },
  {
    title: "Quality",
    description:
      "We value dependable work, careful implementation, and testing that supports a better user experience.",
    icon: Star,
  },
  {
    title: "Collaboration",
    description:
      "We work closely with clients, sharing context and decisions as we move toward common goals.",
    icon: Users,
  },
  {
    title: "Integrity",
    description:
      "We believe that transparent communication and honest relationships are essential to lasting trust.",
    icon: ShieldCheck,
  },
];

const services = [
  {
    title: "Custom Web Development",
    description:
      "Responsive websites and web applications designed around your audience, workflows, and business goals.",
    icon: Code2,
    number: "01",
  },
  {
    title: "Mobile Applications",
    description:
      "Mobile experiences that bring useful services and day-to-day business workflows closer to users.",
    icon: Smartphone,
    number: "02",
  },
  {
    title: "CRM & ERP Systems",
    description:
      "Connected systems that organize customer relationships, operations, records, and business processes.",
    icon: Database,
    number: "03",
  },
  {
    title: "Cloud & Database Solutions",
    description:
      "Practical cloud and database support to help applications manage information and run reliably.",
    icon: Cloud,
    number: "04",
  },
  {
    title: "UI/UX Design",
    description:
      "Clear, usable interfaces that make digital products easier to understand and navigate.",
    icon: Palette,
    number: "05",
  },
  {
    title: "Digital Transformation",
    description:
      "Modernize manual processes with digital tools, integrated workflows, and business-focused software.",
    icon: TrendingUp,
    number: "06",
  },
];

const products = [
  {
    name: "The Motor Desk",
    category: "Automotive workshop management",
    description:
      "A workshop-focused CRM for organizing vehicle service operations, appointments, and invoicing.",
    url: "https://themotordesk.com/",
    domain: "themotordesk.com",
    icon: Wrench,
    tone: "bg-[#e9f4ec] text-[#247443]",
  },
  {
    name: "Motor Konnect",
    category: "Automotive services",
    description:
      "A connected automotive platform built around service discovery and customer-to-service connections.",
    url: "https://www.motorkonnect.com/",
    domain: "motorkonnect.com",
    icon: CarFront,
    tone: "bg-[#eaf1fb] text-[#315e9e]",
  },
  {
    name: "Abacco Education ERP",
    category: "Education management",
    description:
      "An education-focused ERP solution for bringing school and institutional workflows into a digital system.",
    url: "https://eduabaccotech.com/",
    domain: "eduabaccotech.com",
    icon: GraduationCap,
    tone: "bg-[#f8efdc] text-[#886524]",
  },
  {
    name: "Restaurant Billing",
    category: "Restaurant operations",
    description:
      "Billing software designed for restaurant transactions and everyday food-service operations.",
    url: "https://www.restaurantsbilling.com/",
    domain: "restaurantsbilling.com",
    icon: UtensilsCrossed,
    tone: "bg-[#f8e9e4] text-[#9b4e3b]",
  },
  {
    name: "Super Market Billing",
    category: "Retail point of sale",
    description:
      "A billing solution for supermarket and retail checkout workflows.",
    url: "https://www.supermarketbilling.com/",
    domain: "supermarketbilling.com",
    icon: Store,
    tone: "bg-[#eee9fa] text-[#6950a1]",
  },
];

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We start by learning about your business, users, challenges, and desired outcomes.",
    icon: Target,
  },
  {
    number: "02",
    title: "Plan",
    description:
      "We define the scope, priorities, and a practical path toward the right solution.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Design & develop",
    description:
      "We shape the experience and build the product around the agreed requirements.",
    icon: Blocks,
  },
  {
    number: "04",
    title: "Test & support",
    description:
      "We validate the experience and help prepare the solution for use and ongoing improvement.",
    icon: CheckCircle2,
  },
];

function SectionEyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#237548]">
      <span className="h-px w-7 bg-[#5d9a72]" />
      {children}
    </span>
  );
}

function About() {
  return (
    <Layout>
      <div className="abacco-about-page overflow-hidden bg-[#f7faf7] text-[#18251e]">
        {/* Hero */}
        <section className="relative isolate border-b border-[#e3ece5]">
          <div className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#dceee1] blur-3xl opacity-70" />
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#e9f2e9] blur-3xl opacity-80" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8 lg:px-10 lg:py-20">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
              <motion.div variants={reveal}>
                <SectionEyebrow>About Abacco Technology</SectionEyebrow>
              </motion.div>
              <motion.h1
                variants={reveal}
                className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#172b20] sm:text-5xl lg:text-[3.7rem]"
              >
                Building digital solutions for{" "}
                <span className="text-[#23804b]">real business challenges.</span>
              </motion.h1>
              <motion.p variants={reveal} className="mt-6 max-w-xl text-base leading-7 text-[#5d6d62] sm:text-lg sm:leading-8">
                We combine technology, creativity, and business understanding to help
                organizations build smarter digital experiences and more efficient operations.
              </motion.p>
              <motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/Services/website-designing"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1e7041] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1e7041]/15 transition hover:-translate-y-0.5 hover:bg-[#195d36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c8b51] focus-visible:ring-offset-2"
                >
                  Explore our services <ArrowRight size={17} />
                </a>
                <a
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c9d9cd] bg-white/80 px-6 py-3 text-sm font-semibold text-[#244331] transition hover:border-[#2e8050] hover:bg-[#edf6ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c8b51] focus-visible:ring-offset-2"
                >
                  Discuss your project <ArrowUpRight size={16} />
                </a>
              </motion.div>
              <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#506456]">
                {[
                  "Business-focused solutions",
                  "Thoughtful user experiences",
                  "Connected digital workflows",
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-[#328153]" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-[620px]"
            >
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#d9ecdf] via-[#eef5ef] to-[#c6dfce] blur-lg" />
              <div className="relative overflow-hidden rounded-[1.6rem] border border-white bg-white shadow-[0_25px_75px_-35px_rgba(24,58,38,0.35)]">
                <img
                  src="/Images/about-technology-hero.svg"
                  alt="Illustration of Abacco's connected digital workflows, CRM and ERP systems, web applications, and cloud data"
                  className="block h-auto w-full"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-[#e3ebe4] bg-white px-4 py-3 shadow-xl shadow-[#244c32]/10 sm:-left-5 sm:bottom-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f2e8] text-[#257647]">
                  <Workflow size={21} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#20372a]">One connected approach</span>
                  <span className="mt-0.5 block text-xs text-[#748279]">From discovery to delivery</span>
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Who we are */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal}>
            <SectionEyebrow>Who we are</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#1a2d21] sm:text-4xl">
              Technology should make work simpler.
            </h2>
            <p className="mt-5 leading-7 text-[#5c6b60]">
              Abacco Technology is a software and IT solutions provider focused on web
              design, CRM development, mobile and web applications, and cloud and database
              management. We bring technical implementation and business context together
              to create digital tools that serve real operational needs.
            </p>
            <p className="mt-4 leading-7 text-[#5c6b60]">
              From industry-specific software to tailored workflows, we work to understand
              what your organization needs and shape solutions around those requirements.
            </p>
            <a href="/why-choose-us" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#237548] transition hover:gap-3">
              Discover how we work <ArrowRight size={16} />
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              { icon: Code2, title: "Web & mobile", text: "Digital experiences for customers and teams." },
              { icon: Database, title: "CRM & ERP", text: "Tools to organize information and operations." },
              { icon: Cloud, title: "Cloud & data", text: "Infrastructure and database-focused solutions." },
              { icon: Workflow, title: "Automation", text: "Connected workflows built around business needs." },
            ].map(({ icon: Icon, title, text }) => (
              <motion.div key={title} variants={reveal} className="rounded-2xl border border-[#e1ebe3] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#244c32]/5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f3ea] text-[#26784a]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#203629]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#69776d]">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Mission and vision */}
        <section className="border-y border-[#e0eae2] bg-[#eef5ef]">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-2 md:py-16 lg:px-10">
            <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="relative overflow-hidden rounded-3xl border border-[#d9e7dc] bg-white p-7 sm:p-9">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#e7f3e9]" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f2e7] text-[#257849]"><Target size={25} /></span>
              <h2 className="relative mt-5 text-2xl font-semibold text-[#203629]">Our mission</h2>
              <p className="relative mt-3 leading-7 text-[#5b6b60]">
                To empower businesses through innovative technology, reliable infrastructure,
                and user-centric design. We aim to simplify complexity and deliver solutions
                that help organizations operate smarter, faster, and more efficiently.
              </p>
            </motion.article>
            <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="relative overflow-hidden rounded-3xl border border-[#d9e7dc] bg-white p-7 sm:p-9">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#e7f3e9]" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f2e7] text-[#257849]"><Rocket size={25} /></span>
              <h2 className="relative mt-5 text-2xl font-semibold text-[#203629]">Our vision</h2>
              <p className="relative mt-3 leading-7 text-[#5b6b60]">
                To be a trusted global partner for digital transformation and intelligent
                automation, enabling seamless, scalable, and secure digital ecosystems that
                help shape the future of business technology.
              </p>
            </motion.article>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>What guides us</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1b2d21] sm:text-4xl">Our core values</h2>
            <p className="mt-4 leading-7 text-[#68766c]">The principles that guide how we approach our work and relationships.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, description, icon: Icon }, index) => (
              <motion.article key={title} variants={reveal} className="group rounded-2xl border border-[#e0e9e2] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b5d4be] hover:shadow-xl hover:shadow-[#173d27]/5 sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f4eb] text-[#287a49] transition group-hover:bg-[#287a49] group-hover:text-white">
                  <Icon size={23} />
                </span>
                <p className="mt-5 text-xs font-bold tracking-[0.16em] text-[#8a9a8e]">0{index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#1e3426]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#69786d]">{description}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* Services */}
        <section className="border-y border-[#e0eae2] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <SectionEyebrow>Our capabilities</SectionEyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1a2d21] sm:text-4xl">What we do</h2>
                <p className="mt-4 leading-7 text-[#67766b]">Practical technology services to design, develop, and support the tools your business needs.</p>
              </div>
              <a href="/Services/website-designing" className="inline-flex items-center gap-2 text-sm font-bold text-[#237548] hover:gap-3 transition-all">
                Explore services <ArrowRight size={16} />
              </a>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ title, description, icon: Icon, number }) => (
                <motion.article key={title} variants={reveal} className="group relative overflow-hidden rounded-2xl border border-[#e2ebe4] bg-[#f9fbf9] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c0dbc7] hover:bg-[#f2f8f3] hover:shadow-lg hover:shadow-[#244c32]/5 sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#2a7b4b] shadow-sm ring-1 ring-[#e1ebe3]"><Icon size={23} /></span>
                    <span className="text-sm font-semibold tracking-wider text-[#b1c3b6]">{number}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#21382a]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#69776c]">{description}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Product portfolio */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>Our product portfolio</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1b2d21] sm:text-4xl">Software shaped for real industries</h2>
            <p className="mt-4 leading-7 text-[#68766c]">Explore Abacco products created for different operational needs, from automotive services to education and retail.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(({ name, category, description, url, domain, icon: Icon, tone }) => (
              <motion.article key={name} variants={reveal} className="group flex h-full flex-col rounded-2xl border border-[#dfe9e1] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173d27]/7">
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}><Icon size={23} /></span>
                  <span className="rounded-full bg-[#f2f6f2] px-3 py-1.5 text-[11px] font-semibold text-[#607065]">{category}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#203629]">{name}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#69776c]">{description}</p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#edf1ed] pt-4">
                  <span className="truncate text-xs text-[#77857b]">{domain}</span>
                  <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} official website`} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d1e3d6] px-3.5 py-2 text-xs font-bold text-[#267748] transition hover:border-[#267748] hover:bg-[#eaf5ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c8b51]">
                    Visit website <ArrowUpRight size={14} />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* Process */}
        <section className="border-y border-[#deeadf] bg-[#eef5ef]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <SectionEyebrow>Our approach</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1b2d21] sm:text-4xl">A clear path from challenge to solution</h2>
              <p className="mt-4 leading-7 text-[#68766c]">A collaborative process with the business need at the centre of every decision.</p>
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ number, title, description, icon: Icon }, index) => (
                <motion.article key={number} variants={reveal} className="relative rounded-2xl border border-[#d9e6dc] bg-white p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold tracking-[0.16em] text-[#8ba893]">{number}</span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f4eb] text-[#287a49]"><Icon size={21} /></span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-[#203629]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#69776c]">{description}</p>
                  {index < steps.length - 1 && <ArrowRight className="absolute -right-3 top-11 z-10 hidden text-[#80ad8d] lg:block" size={22} />}
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Custom development */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="grid overflow-hidden rounded-[2rem] bg-[#172b20] shadow-xl shadow-[#162c20]/10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-[#a8d4b4]">
                <HeartHandshake size={15} /> Built around your requirements
              </span>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Custom development for your business
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-[#c3d2c7]">
                Every organization has its own processes. We help shape CRMs, ERPs,
                billing applications, dashboards, and digital workflows around specific
                business needs—rather than forcing every team into the same template.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Custom CRM and ERP workflows",
                  "Billing applications and business dashboards",
                  "Web and mobile application experiences",
                  "Industry-specific tools and process automation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#e2ece5]">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#8fcca0]" />{item}
                  </li>
                ))}
              </ul>
              <a href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#a6d9b4] px-6 py-3 text-sm font-bold text-[#173523] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#172b20]">
                Discuss your project <ArrowRight size={16} />
              </a>
            </div>
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#254d34] to-[#11261a] p-7 sm:p-10">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-white/10" />
              <div className="absolute -bottom-16 -left-14 h-64 w-64 rounded-full border border-white/10" />
              <div className="relative w-full max-w-md space-y-3">
                {[
                  { icon: Code2, title: "Custom applications", detail: "Interfaces built for your workflow" },
                  { icon: Database, title: "CRM & ERP systems", detail: "Information and operations connected" },
                  { icon: TrendingUp, title: "Business dashboards", detail: "Useful views of day-to-day activity" },
                  { icon: Workflow, title: "Process automation", detail: "Less repetition, clearer processes" },
                ].map(({ icon: Icon, title, detail }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#a7d7b4]/15 text-[#a7d7b4]"><Icon size={21} /></span>
                    <span><span className="block font-semibold text-white">{title}</span><span className="mt-1 block text-xs text-[#b9cec0]">{detail}</span></span>
                    <ArrowUpRight className="ml-auto shrink-0 text-[#8fc79f]" size={17} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#235d39] via-[#267647] to-[#173c27] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -left-14 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-28 -right-10 h-80 w-80 rounded-full border border-white/10" />
            <div className="relative mx-auto max-w-3xl">
              <SectionEyebrow>Have a challenge in mind?</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                Let’s build something meaningful together.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#d5e7da]">
                Share your goals and requirements. Let’s talk about a digital solution that fits your business.
              </p>
              <a href="/contact" className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#205b37] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#eaf5ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#245f3a]">
                Contact us <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default About;
