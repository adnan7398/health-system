import { Users, ArrowRight, Stethoscope, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForProfessionals() {
  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-surface-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300">
              <Users className="h-4 w-4" />
              <span>Join our network</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-surface-900 dark:text-white md:text-4xl">
              Are you a doctor or hospital administrator?
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-surface-600 dark:text-surface-400">
              Join the Arogyam network to expand your reach. Manage appointments, access unified
              patient records, and collaborate with specialists — all in one place.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950">
                  <Stethoscope className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-surface-900 dark:text-white">For doctors</h3>
                  <p className="mb-4 text-surface-600 dark:text-surface-400">
                    Digitize your practice, manage bookings, and streamline your workflow.
                  </p>
                  <Link
                    to="/doctor/signin"
                    className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Register as a doctor <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-100 dark:bg-secondary-950">
                  <Building2 className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-surface-900 dark:text-white">For hospitals</h3>
                  <p className="mb-4 text-surface-600 dark:text-surface-400">
                    Onboard your care team onto one platform for scheduling and records.
                  </p>
                  <a
                    href="mailto:partners@arogyam.health"
                    className="inline-flex items-center gap-2 font-semibold text-secondary-600 hover:text-secondary-700 dark:text-secondary-400"
                  >
                    Partner with us <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop"
              alt="Medical professionals collaborating"
              className="relative z-10 rounded-2xl border-4 border-white shadow-soft-lg dark:border-surface-900"
            />
            <div className="absolute -bottom-10 -right-10 -z-10 h-64 w-64 rounded-full bg-surface-100 opacity-50 blur-3xl dark:bg-surface-800" />
            <div className="absolute -top-10 -left-10 -z-10 h-64 w-64 rounded-full bg-surface-200 opacity-50 blur-3xl dark:bg-surface-800" />
          </div>
        </div>
      </div>
    </section>
  );
}
