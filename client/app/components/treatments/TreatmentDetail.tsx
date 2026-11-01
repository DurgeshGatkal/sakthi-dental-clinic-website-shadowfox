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
    <article
      id={treatment.slug}
      className="grid scroll-mt-28 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      <div className={`relative ${flip ? "lg:order-2" : ""}`}>
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-[1.75rem] border border-lavender-300/50"
        />
        <Picture
          src={treatment.image.src}
          alt={treatment.image.alt}
          width={1600}
          height={1068}
          sizes={IMAGE_SIZES}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : undefined}
          className="aspect-[4/3] w-full rounded-[1.4rem] object-cover shadow-soft"
        />
      </div>

      <div>
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-lavender-700 uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-gold-400" />
          Treatment {String(index + 1).padStart(2, "0")}
        </p>

        <h2 className="text-h2">{treatment.title}</h2>
        <p className="mt-4 max-w-xl text-body text-ink-600">{treatment.description}</p>

        <div className="mt-8">
          <AppointmentButton location={`treatment:${treatment.slug}`} />
        </div>
      </div>
    </article>
  );
}
