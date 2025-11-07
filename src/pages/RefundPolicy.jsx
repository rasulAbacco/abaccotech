import React from "react";
import {
  ShieldCheck,
  FileText,
  Database,
  Code2,
  Layers,
  RefreshCw,
  AlertCircle,
  Clock,
  Mail,
  Globe,
} from "lucide-react";
import Layout from "../Components/Layout";

// Tailwind-only, production-ready, single-file React component
// Modern styling, smooth hover effects, anchors, and subtle ornaments

const Section = ({ id, icon: Icon, title, children }) => (
  <section id={id} className="scroll-mt-28">
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] hover:bg-white/10">
      <div className="flex items-start gap-4">
        <div className="rounded-xl p-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          <div className="mt-4 text-gray-100/90 leading-relaxed">{children}</div>
        </div>
      </div>
      {/* Decorative corner */}
      <div className="pointer-events-none absolute -top-3 -right-3 h-12 w-12 rounded-full bg-gradient-to-br from-green-500/40 to-emerald-600/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </section>
);

const Bullet = ({ children }) => (
  <li className="relative pl-6">
    <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-500/20" />
    {children}
  </li>
);

const DividerShape = () => (
  <div className="relative my-12">
    <svg
      aria-hidden
      className="mx-auto h-8 text-emerald-400/30"
      viewBox="0 0 200 24"
      fill="currentColor"
    >
      <path d="M0 12h70l8-8 8 8h114v2H86l-8 8-8-8H0z" />
    </svg>
  </div>
);

const Anchor = ({ href, children }) => (
  <a
    href={href}
    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
  >
    {children}
  </a>
);

export default function RefundPolicy() {
  return (
    <Layout>
    <main className="min-h-screen ">
      {/* Top gradient ring */}
      <div className="pointer-events-none fixed inset-0 -z-10 [mask-image:radial-gradient(55%_40%_at_50%_0%,black,transparent)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-500/20 to-transparent" />
      </div>

      {/* Container */}
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        {/* Hero */}
        <header className="pt-20 md:pt-28">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                Transparent & Fair Use Policy
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-white">
                Refund Policy
              </h1>
              <p className="mt-3 max-w-2xl text-white/80">
                Clear, honest terms for website design, data services, and software development—
                designed to protect both our clients and our team.
              </p>
            </div>

            {/* Quick anchors */}
            <nav className="flex flex-wrap gap-2">
              <Anchor href="#general">General</Anchor>
              <Anchor href="#web">Website</Anchor>
              <Anchor href="#database">Database</Anchor>
              <Anchor href="#software">Software</Anchor>
              <Anchor href="#subscription">Subscriptions</Anchor>
              <Anchor href="#dispute">Disputes</Anchor>
              <Anchor href="#contact">Contact</Anchor>
            </nav>
          </div>

          {/* Card banner */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/0 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-500/20 p-3 ring-1 ring-green-500/30">
                  <FileText className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-sm md:text-base text-white/80">
                  Each project begins with consultation, scope clarity, and agreed deliverables.
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-white font-medium shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl hover:translate-y-[-1px]"
              >
                Need help? Contact us
              </a>
            </div>
          </div>
        </header>

        <DividerShape />

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 pb-24">
          {/* 1. General Policy */}
          <Section id="general" icon={Layers} title="1. General Policy">
            <p>
              All projects are initiated after thorough consultation, requirement gathering,
              and mutual agreement on deliverables. Once a project has started, refunds are
              handled on a case-by-case basis as outlined below.
            </p>
          </Section>

          {/* 2. Website Design & Development */}
          <Section id="web" icon={Code2} title="2. Website Design & Development">
            <div className="grid gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">Before project initiation</h3>
                <p className="mt-1 text-white/80">
                  If a cancellation request is made before the project has started
                  (no design or development work has been performed), a full refund will be issued.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">After project initiation</h3>
                <p className="mt-1 text-white/80">
                  Once initial design concepts, layouts, or code have been created, only a partial refund
                  may be considered based on the amount of work completed (typically up to 50% of the
                  total project value).
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">After final delivery or approval</h3>
                <p className="mt-1 text-white/80">
                  No refunds will be issued once the website is completed, delivered, and approved by the client.
                </p>
              </div>
            </div>
          </Section>

          {/* 3. Database Delivery */}
          <Section id="database" icon={Database} title="3. Database Delivery">
            <ul className="mt-2 grid gap-2">
              <Bullet>
                <span className="font-semibold text-white">Before data delivery:</span> If the order is cancelled
                before the data verification or processing begins, a full refund will be issued.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-white">After data delivery:</span> Since databases and contact lists are
                digital and non-returnable products, no refunds will be issued once the file(s) have been delivered or downloaded.
              </Bullet>
              <Bullet>
                <span className="font-semibold text-white">Replacement policy:</span> In case of data inaccuracy or delivery errors,
                Abacco Technology will offer a replacement list or correction within 5 business days of the complaint — not a monetary refund.
              </Bullet>
            </ul>
          </Section>

          {/* 4. Data Management & Software Development */}
          <Section id="software" icon={RefreshCw} title="4. Data Management & Software Development">
            <div className="grid gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">Initial planning stage</h3>
                <p className="mt-1 text-white/80">
                  If cancellation occurs during the planning or requirements phase (before coding begins),
                  a 75% refund of the project fee will be issued.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">Development in progress</h3>
                <p className="mt-1 text-white/80">
                  If cancellation occurs during development, a pro‑rated refund will be calculated based on completed milestones.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">Post‑deployment</h3>
                <p className="mt-1 text-white/80">
                  Once the software or data management solution has been deployed, no refunds will be issued.
                  However, we will offer support and bug fixes under the agreed maintenance terms.
                </p>
              </div>
            </div>
          </Section>

          {/* 5. Monthly or Subscription-Based Services */}
          <Section id="subscription" icon={Clock} title="5. Monthly or Subscription-Based Services">
            <ul className="mt-2 grid gap-2">
              <Bullet>
                For ongoing or subscription services (such as hosting, data maintenance, or CRM access), refunds
                are not available for the current billing period once the service has started.
              </Bullet>
              <Bullet>
                Clients may cancel the subscription for the next billing cycle by providing a 15‑day written notice.
              </Bullet>
            </ul>
          </Section>

          {/* 6. Dispute Resolution */}
          <Section id="dispute" icon={AlertCircle} title="6. Dispute Resolution">
            <p>
              All refund‑related disputes will be reviewed by our Project and Finance teams. A decision will be
              provided within <span className="font-semibold text-white">10 business days</span> of the refund request.
            </p>
          </Section>

          <DividerShape />

          {/* 8. Contact Information */}
          <Section id="contact" icon={Mail} title="7. Contact Information">
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="mailto:info@abaccotech.com"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:translate-y-[-2px] hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-green-500/20 p-2 ring-1 ring-green-500/30">
                    <Mail className="h-5 w-5 text-green-400" />
                  </span>
                  <div>
                    <p className="text-sm text-white/70">Email</p>
                    <p className="font-medium text-white">info@abaccotech.com</p>
                  </div>
                </div>
                <span className="text-xs text-white/60 group-hover:text-white">Write to us →</span>
              </a>

              <a
                href="https://www.abaccotech.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 transition-all hover:translate-y-[-2px] hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-green-500/20 p-2 ring-1 ring-green-500/30">
                    <Globe className="h-5 w-5 text-green-400" />
                  </span>
                  <div>
                    <p className="text-sm text-white/70">Website</p>
                    <p className="font-medium text-white">www.abaccotech.com</p>
                  </div>
                </div>
                <span className="text-xs text-white/60 group-hover:text-white">Visit site →</span>
              </a>
            </div>

            <p className="mt-4 text-sm text-white/60">
              Prefer a call? Share your number in the email and our team will reach out.
            </p>
          </Section>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="mt-2 bg-gradient-to-t from-black/40 to-transparent">
        <svg aria-hidden viewBox="0 0 1440 120" className="w-full opacity-40">
          <path
            fill="currentColor"
            className="text-emerald-500/40"
            d="M0,64L60,80C120,96,240,128,360,133.3C480,139,600,117,720,112C840,107,960,117,1080,101.3C1200,85,1320,43,1380,21.3L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </main>
    </Layout>
  );
}
