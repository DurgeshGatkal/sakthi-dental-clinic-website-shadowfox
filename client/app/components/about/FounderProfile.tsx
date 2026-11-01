import { Check } from "lucide-react";
import type { Clinic } from "~/lib/api";
import { useReveal } from "~/lib/useReveal";

/*
 * Section 5 — founder story. The clinic has not supplied a portrait yet, so
 * the left column uses a neutral monogram instead of a stock face: putting a
 * model's photo next to a named doctor's biography would misrepresent her.
 */
export function FounderProfile({ founder }: { founder: Clinic["founder"] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal section-y bg-white">
      <div className="container-page grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="relative flex aspect-[3/2] flex-col items-center justify-center gap-3 overflow-hidden rounded-card bg-navy-900 text-white shadow-glass lg:aspect-[4/5]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-gold-400/15 blur-3xl"
            />
            <span aria-hidden="true" className="font-heading text-7xl font-semibold text-gold-400">
              A
            </span>
            <span className="text-small font-semibold tracking-[0.18em] uppercase">
              Dr. Anupriya
            </span>
            <span className="text-small text-white/60">Founder</span>
          </div>

          <ul className="mt-6 space-y-3 rounded-card border border-lavender-100 bg-lavender-50/60 p-5">
            {founder.credentials.map((credential) => (
              <li key={credential.label} className="flex gap-3">
                <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-400" />
                <span className="text-small text-ink-600">
                  <strong className="text-ink-900">{credential.value}</strong> {credential.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-lavender-700 uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-gold-400" />
            Our founder
          </p>
          <h2 className="text-h2">Get to Know Dr. Anupriya</h2>
          <p className="mt-3 text-lg font-medium text-lavender-700">{founder.subtitle}</p>

          <div className="mt-6 space-y-4 text-body text-ink-600">
            {founder.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
