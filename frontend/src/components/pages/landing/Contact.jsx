import { Mail, Phone, MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { Card, CardContent } from "../../ui/card";

const contacts = [
  {
    icon: Phone,
    label: "Call us",
    value: "+91 80000 00000",
    href: "tel:+918000000000",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "support@arogyam.health",
    href: "mailto:support@arogyam.health",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "Bengaluru, Karnataka, India",
    href: "https://maps.google.com/?q=Bengaluru",
  },
];

export default function Contact() {
  return (
    <section className="py-24" id="contact">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="We're here to help"
          description="Reach our support team directly — we typically respond within one business day."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {contacts.map((c) => (
            <a key={c.label} href={c.href} target={c.label === "Visit us" ? "_blank" : undefined} rel="noreferrer">
              <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-soft-lg">
                <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">{c.label}</p>
                  <p className="font-semibold text-surface-900 dark:text-white">{c.value}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
