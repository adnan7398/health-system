import { PhoneCall, Siren } from "lucide-react";
import { Button } from "../../ui/button";

export default function Emergency() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-danger-600 px-8 py-8 text-white shadow-soft-lg sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Siren className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">Medical emergency?</p>
              <p className="text-sm text-white/85">
                Call your local emergency number immediately — India: 108 / 112
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="rounded-full bg-white text-danger-700 hover:bg-white/90">
            <a href="tel:112">
              <PhoneCall className="h-5 w-5" /> Call 112 now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
