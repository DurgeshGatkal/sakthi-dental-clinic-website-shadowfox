import type { Doctor } from "~/lib/api";

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
      className={`flex h-full flex-col items-center rounded-card p-6 text-center shadow-soft transition-transform duration-200 hover:-translate-y-1 ${
        founder ? "border-2 border-lavender-300 bg-lavender-50" : "bg-white"
      }`}
    >
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
          className="flex size-24 items-center justify-center rounded-full bg-lavender-100 font-heading text-2xl font-bold text-lavender-700"
        >
          {initials(doctor.name)}
        </span>
      )}

      <h3 className="mt-4 text-base font-semibold text-ink-900">{doctor.name}</h3>
      <p className="mt-1 text-small text-ink-600">{doctor.specialty}</p>
    </article>
  );
}
