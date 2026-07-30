import { motion as Motion } from "framer-motion";
import { UserPlus, QrCode, CalendarCheck, HeartPulse } from "lucide-react";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    description: "Sign up in under a minute and set up your secure patient profile.",
  },
  {
    icon: QrCode,
    title: "Get your health card",
    description: "Generate a personal QR health card carrying your key medical details.",
  },
  {
    icon: CalendarCheck,
    title: "Book an appointment",
    description: "Browse verified doctors by specialty and book a slot that works for you.",
  },
  {
    icon: HeartPulse,
    title: "Track your health",
    description: "Review records, prescriptions, and AI insights from one dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Get quality care in four simple steps"
          description="Arogyam is designed to get you from sign-up to seeing a doctor as quickly and simply as possible."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <Motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 font-bold text-white shadow-soft">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="absolute right-6 top-6 text-3xl font-black text-surface-100 dark:text-surface-800">
                0{idx + 1}
              </span>
              <h3 className="mb-2 text-base font-bold text-surface-900 dark:text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                {step.description}
              </p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
