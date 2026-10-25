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
          <div className="flex aspect-[3/2] flex-col items-center justify-center gap-3 rounded-card bg-lavender-100 text-lavender-700 lg:aspect-[4/5]">
            <span aria-hidden="true" className="font-heading text-7xl font-bold tracking-tight">
              A
            </span>
            <span className="text-small font-semibold tracking-wide uppercase">Dr. Anupriya</span>
            <span className="text-small text-ink-600">Founder</span>
          </div>

          <ul className="mt-6 space-y-3 rounded-card border border-lavender-100 p-5">
            {founder.credentials.map((credential) => (
              <li key={credential.label} className="flex gap-3">
                <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-lavender-700" />
                <span className="text-small text-ink-600">
                  <strong className="text-ink-900">{credential.value}</strong> {credential.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
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
