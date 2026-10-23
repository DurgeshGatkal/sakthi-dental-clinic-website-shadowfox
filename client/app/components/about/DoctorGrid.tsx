import type { Doctor } from "~/lib/api";
import { useReveal } from "~/lib/useReveal";
import { SectionHeading } from "../ui/SectionHeading";
import { DoctorCard } from "./DoctorCard";

/* Section 5 — 9 doctors, 3 across on desktop, founder card highlighted. */
export function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal section-y bg-white">
      <div className="container-page">
        <SectionHeading title="Our Team of Doctors" />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <li key={doctor.name}>
              <DoctorCard doctor={doctor} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
