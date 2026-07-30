import { motion as Motion } from "framer-motion";

const stats = [
  { label: "Active users", value: "50K+" },
  { label: "Doctors online", value: "1,200+" },
  { label: "Consultations", value: "120K+" },
  { label: "Patient satisfaction", value: "99.9%" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-primary-900 py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 text-center md:grid-cols-4">
          {stats.map((stat, i) => (
            <Motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mb-2 text-4xl font-bold text-primary-200 lg:text-5xl">{stat.value}</div>
              <div className="font-medium text-primary-100 opacity-80">{stat.label}</div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
