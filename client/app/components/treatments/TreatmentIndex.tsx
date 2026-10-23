import type { Treatment } from "~/lib/api";

/* Section 5 — 15 chips, one per anchor; scrolls sideways on phones. */
export function TreatmentIndex({ treatments }: { treatments: Treatment[] }) {
  return (
    <nav aria-label="Treatments on this page" className="border-b border-lavender-100 bg-white">
      <div className="container-page py-4">
        <ul className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center md:overflow-visible">
          {treatments.map((treatment) => (
            <li key={treatment.slug}>
              <a
                href={`#${treatment.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-lavender-300 px-4 text-sm font-medium whitespace-nowrap text-lavender-700 transition-colors hover:bg-lavender-50"
              >
                {treatment.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
