import type { Treatment } from "~/lib/api";
import { AppointmentButton } from "../cta/AppointmentButton";

/* Section 5 — one anchor block; image side alternates from lg up. */
export function TreatmentDetail({ treatment, index }: { treatment: Treatment; index: number }) {
  const flip = index % 2 === 1;

  return (
    <article id={treatment.slug} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
      <img
        src={treatment.image.src}
        alt={treatment.image.alt}
        width={1600}
        height={1068}
        loading="lazy"
        className={`aspect-[4/3] w-full rounded-card object-cover ${flip ? "lg:order-2" : ""}`}
      />

      <div>
        <h2 className="text-h2">{treatment.title}</h2>
        <p className="mt-4 text-body text-ink-600">{treatment.description}</p>

        <div className="mt-6">
          <AppointmentButton location={`treatment:${treatment.slug}`} />
        </div>
      </div>
    </article>
  );
}
