import { useQuery } from "@tanstack/react-query";
import { motion as Motion } from "framer-motion";
import { Star, ArrowRight, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import SectionHeading from "./SectionHeading";
import { Button } from "../../ui/button";
import { SkeletonCard } from "../../ui/skeleton";
import { EmptyState } from "../../ui/empty-state";
import { API_BASE } from "../../../utils/api";

function useTopDoctors() {
  return useQuery({
    queryKey: ["doctors", "preview"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/doctors`);
      return Array.isArray(data) ? data : data?.doctors || [];
    },
  });
}

export default function DoctorsPreview() {
  const { data: doctors = [], isLoading, isError } = useTopDoctors();
  const preview = doctors.slice(0, 4);

  return (
    <section className="py-24" id="doctors">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our doctors"
          title="Meet verified specialists on Arogyam"
          description="Real doctors registered on the platform, ready to take your appointment."
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError || preview.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="Doctors will appear here"
            description="Once doctors register on Arogyam, their profiles show up in this section."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {preview.map((doc, idx) => (
              <Motion.div
                key={doc._id || doc.email || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-col items-center rounded-2xl border border-surface-200 bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-lg font-bold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                  {doc.profileImage ? (
                    <img
                      src={doc.profileImage}
                      alt={`Dr. ${doc.firstName} ${doc.lastName}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    `${doc.firstName?.[0] || "D"}${doc.lastName?.[0] || ""}`
                  )}
                </div>
                <p className="font-bold text-surface-900 dark:text-white">
                  Dr. {doc.firstName} {doc.lastName}
                </p>
                <p className="mb-3 text-sm text-primary-600 dark:text-primary-400">{doc.specialization}</p>
                <div className="mb-4 flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400">
                  <Star className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />
                  <span>{doc.experience ? `${doc.experience} yrs experience` : "Verified doctor"}</span>
                </div>
                <Button asChild size="sm" variant="outline" className="mt-auto w-full rounded-full">
                  <Link to="/bookappointment">Book appointment</Link>
                </Button>
              </Motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="ghost">
            <Link to="/alldoctors">
              View all doctors <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
