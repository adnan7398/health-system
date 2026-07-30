import { motion as Motion } from "framer-motion";
import { cn } from "../../../lib/utils";

export default function SectionHeading({ eyebrow, title, description, className, align = "center" }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className={cn(
        "mx-auto mb-16 max-w-2xl",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-surface-600 dark:text-surface-400">{description}</p>
      )}
    </Motion.div>
  );
}
