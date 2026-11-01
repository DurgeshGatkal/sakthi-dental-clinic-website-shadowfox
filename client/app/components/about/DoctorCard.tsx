import type { Doctor } from "~/lib/api";
import { SHOWCASE_QUALIFICATIONS } from "~/lib/showcase";

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/*
 * Section 5 — one doctor. Photos arrive with `photo`; until then a neutral
 * monogram, never a stock portrait.
 */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const founder = doctor.isFounder;

  return (
    <article
      className={`relative flex h-full flex-col items-center rounded-card border p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glass ${
        founder ? "border-gold-400/70 bg-lavender-50" : "border-lavender-100 bg-white"
      }`}
    >
      {founder ? (
        <span className="absolute top-4 right-4 rounded-full bg-gold-400 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.12em] text-navy-900 uppercase">
          Founder
        </span>
      ) : null}
      {doctor.photo ? (
        <img
          src={doctor.photo.src}
          alt={doctor.photo.alt}
          width={96}
          height={96}
          loading="lazy"
          className="size-24 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-24 items-center justify-center rounded-full bg-navy-900 font-heading text-2xl font-semibold text-gold-400"
        >
          {initials(doctor.name)}
        </span>
      )}

      <h3 className="mt-4 text-base font-semibold text-ink-900">{doctor.name}</h3>
      <p className="mt-1 text-small text-ink-600">{doctor.specialty}</p>
      <p className="mt-2 text-xs text-ink-600">
        {(doctor.qualifications?.length
          ? doctor.qualifications
          : SHOWCASE_QUALIFICATIONS[doctor.name]
        )?.join(", ")}
      </p>
    </article>
  );
}
