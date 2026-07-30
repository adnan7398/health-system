import { motion as Motion } from "framer-motion";
import { ArrowRight, Play, Shield, CheckCircle, Activity } from "lucide-react";
import { Button } from "../../ui/button";

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-100 opacity-70 blur-3xl animate-blob dark:bg-primary-900/30" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary-100 opacity-70 blur-3xl animate-blob animation-delay-2000 dark:bg-secondary-900/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300">
              <Shield className="h-4 w-4" />
              <span>Trusted by 50,000+ patients</span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-surface-900 dark:text-white md:text-6xl">
              <span className="text-primary-600 dark:text-primary-400">AI-powered</span> healthcare
              for a better tomorrow
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-surface-600 dark:text-surface-400">
              Experience the future of medicine with Arogyam — smart diagnostics, instant doctor
              connections, and a unified health record, all in one secure platform.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="rounded-full" onClick={onGetStarted}>
                Start your journey <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <a href="#how-it-works">
                  <Play className="h-5 w-5" /> See how it works
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-surface-500 dark:text-surface-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-500" />
                <span>HIPAA-minded data handling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            <div className="group relative overflow-hidden rounded-[2rem] border-8 border-white shadow-soft-lg dark:border-surface-900">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src="/home1.png"
                alt="Doctor consulting with a patient"
                className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-4 p-8 text-white transition-transform duration-500 group-hover:translate-y-0">
                <p className="mb-1 text-xl font-bold">Compassionate, connected care</p>
                <p className="text-sm font-medium tracking-wide opacity-90">
                  Providing world-class care, every day
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 flex items-center gap-5 rounded-2xl border border-surface-100 bg-white p-5 shadow-soft-lg dark:border-surface-800 dark:bg-surface-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/10">
                <Activity className="h-7 w-7" />
              </div>
              <div>
                <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-surface-400">
                  Health score
                </p>
                <p className="text-xl font-extrabold text-surface-900 dark:text-white">98% Excellent</p>
              </div>
            </div>
          </Motion.div>
        </div>

        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-surface-100 pt-10 dark:border-surface-800 md:flex-row"
        >
          <p className="whitespace-nowrap text-sm font-semibold text-surface-400">
            TRUSTED BY HEALTHCARE TEAMS
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 md:justify-end">
            {["ClinicCare", "HealthPlus", "MediLife", "CuraSys"].map((name) => (
              <span key={name} className="flex items-center gap-2 text-xl font-bold text-surface-400">
                <span className="h-6 w-6 rounded-full bg-surface-300" /> {name}
              </span>
            ))}
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
