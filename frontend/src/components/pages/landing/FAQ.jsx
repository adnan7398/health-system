import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { cn } from "../../../lib/utils";

const faqs = [
  {
    q: "Is my medical data secure on Arogyam?",
    a: "Medical files you upload are encrypted before storage, and your health card only exposes the information you choose to include.",
  },
  {
    q: "Can I use Arogyam without registering a health card?",
    a: "You can sign in and browse doctors right away. A one-time health card / QR verification is required before booking appointments or viewing records, to keep your medical data protected.",
  },
  {
    q: "How do I book an appointment with a doctor?",
    a: "Go to \"All Doctors\", pick a specialist based on availability and specialization, choose an open time slot, and confirm — you'll see it under \"My Appointments\" immediately.",
  },
  {
    q: "Are the AI tools (diagnostics, lab analysis) a replacement for a doctor?",
    a: "No. They're meant to give you a preliminary, informational view of your health data. Always confirm any concerning result with a qualified doctor.",
  },
  {
    q: "I'm a doctor — how do I join Arogyam?",
    a: "Use \"Doctor sign in\" from the navigation bar and choose Sign up to create your professional profile with your specialization and experience.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24" id="faq">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />

        <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((item, idx) => (
            <Accordion.Item
              key={idx}
              value={`item-${idx}`}
              className="overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    "group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-surface-900 dark:text-white"
                  )}
                >
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-surface-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden px-5 text-sm leading-relaxed text-surface-600 data-[state=open]:pb-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:text-surface-400">
                {item.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
