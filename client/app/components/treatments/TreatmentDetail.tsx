import type { Treatment } from "~/lib/api";
import { IMAGE_SIZES } from "~/lib/images";
import { AppointmentButton } from "../cta/AppointmentButton";
import { Picture } from "../ui/Picture";

/*
 * Section 5 — one anchor block; image side alternates from lg up.
 * Deliberately not a `.reveal` target: the 16 px rise would move the block
 * after the jump list has scrolled to it.
 */
export function TreatmentDetail({ treatment, index }: { treatment: Treatment; index: number }) {
  const flip = index % 2 === 1;

  return (
    <article id={treatment.slug} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
      <Picture
        src={treatment.image.src}
        alt={treatment.image.alt}
        width={1600}
        height={1068}
        sizes={IMAGE_SIZES}
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : undefined}
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
