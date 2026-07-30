import { motion as Motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    quote:
      "Booking a specialist used to take days of phone calls. With Arogyam I found a doctor and had an appointment confirmed in minutes.",
    name: "Priya S.",
    role: "Patient, Bengaluru",
  },
  {
    quote:
      "The digital health card is genuinely useful in emergencies — my blood group and allergies are one scan away for any doctor who needs them.",
    name: "Arjun M.",
    role: "Patient, Pune",
  },
  {
    quote:
      "As a physician, having appointment history and patient notes in one dashboard instead of scattered notebooks has saved me real time every day.",
    name: "Dr. Kavya R.",
    role: "General Physician",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by patients and doctors alike"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <Motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col rounded-2xl border border-surface-200 bg-white p-7 shadow-soft dark:border-surface-800 dark:bg-surface-900"
            >
              <div className="mb-4 flex gap-0.5 text-warning-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-surface-700 dark:text-surface-300">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{item.role}</p>
                </div>
              </figcaption>
            </Motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
