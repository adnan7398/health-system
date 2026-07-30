import { motion as Motion } from "framer-motion";
import { CalendarCheck, FlaskConical, Bot, ScrollText, Activity, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";

const services = [
  {
    icon: CalendarCheck,
    title: "Book appointments",
    description: "Find and book verified doctors across specialties in a few taps.",
    href: "/bookappointment",
  },
  {
    icon: FlaskConical,
    title: "Lab report analysis",
    description: "Upload a lab report and get flagged values explained instantly.",
    href: "/labreport",
  },
  {
    icon: Bot,
    title: "Health assistant",
    description: "Ask everyday health questions and get guided remedies.",
    href: "/chatbot",
  },
  {
    icon: ScrollText,
    title: "Medical records",
    description: "Securely store and share encrypted medical documents.",
    href: "/medicalReport",
  },
  {
    icon: Activity,
    title: "Fitness & wellness",
    description: "Track BMR, calories, and everyday wellness metrics.",
    href: "/fitness",
  },
  {
    icon: QrCode,
    title: "Digital health card",
    description: "Carry your emergency medical profile as a scannable QR card.",
    href: "/arogyamcard",
  },
];

export default function Services() {
  return (
    <section className="bg-surface-50 py-24 dark:bg-surface-950" id="services">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="One platform for every part of your care"
          description="From booking a doctor to understanding your lab results, Arogyam keeps it all in one place."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <Motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              <Link
                to={service.href}
                className="group flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg dark:border-surface-800 dark:bg-surface-900 dark:hover:border-primary-800"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-transform group-hover:scale-110 dark:bg-primary-950 dark:text-primary-400">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 font-bold text-surface-900 dark:text-white">{service.title}</h3>
                <p className="text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                  {service.description}
                </p>
              </Link>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
