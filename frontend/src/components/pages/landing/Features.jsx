import { motion as Motion } from "framer-motion";
import { Bot, Clock, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Bot,
      title: t("home.features.aiDiagnostics.title", "AI-powered diagnostics"),
      description: t(
        "home.features.aiDiagnostics.description",
        "Get instant health insights and preliminary diagnoses powered by advanced artificial intelligence."
      ),
      color: "bg-secondary-50 text-secondary-600 dark:bg-secondary-950 dark:text-secondary-400",
    },
    {
      icon: Clock,
      title: t("home.features.access.title", "24/7 access"),
      description: t(
        "home.features.access.description",
        "Round-the-clock healthcare support and monitoring for your peace of mind."
      ),
      color: "bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400",
    },
    {
      icon: Stethoscope,
      title: t("home.features.expertCare.title", "Expert care"),
      description: t(
        "home.features.expertCare.description",
        "Connect with qualified healthcare professionals for personalized treatment plans."
      ),
      color: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
    },
  ];

  return (
    <section className="bg-surface-50 py-24 dark:bg-surface-950" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Arogyam"
          title="Comprehensive healthcare solutions"
          description="Everything you need to manage your health, from AI diagnostics to expert consultations, all in one place."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <Motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-2xl border border-surface-200 bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-surface-800 dark:bg-surface-900"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}
              >
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-surface-900 dark:text-white">{feature.title}</h3>
              <p className="leading-relaxed text-surface-600 dark:text-surface-400">{feature.description}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
