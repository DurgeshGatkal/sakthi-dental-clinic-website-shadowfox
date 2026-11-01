import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { Treatment } from "~/lib/api";
import { getIcon } from "~/lib/icons";
import { useReveal } from "~/lib/useReveal";
import { buttonClasses } from "../ui/Button";

export function CoreTreatments({ items }: { items: Treatment[] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="reveal section-y relative isolate overflow-hidden bg-navy-900 text-white"
    >
      {/* Gold glow + hairline grid for depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 size-[36rem] rounded-full bg-gold-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <div className="container-page relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
              Our expertise
            </p>
            <h2 className="text-h2 text-white">Explore Our Services</h2>
            <p className="mt-4 text-body text-white/70">
              General, cosmetic and specialist dentistry, delivered by nine doctors under one roof.
            </p>
          </div>

          <Link
            to="/treatments"
            className="link-underline inline-flex min-h-12 shrink-0 items-center gap-2 text-small font-semibold text-gold-400"
          >
            View all treatments
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <ul className="reveal-stagger mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((treatment, index) => {
            const Icon = getIcon(treatment.icon);

            return (
              <li key={treatment.slug}>
                <article className="group flex h-full flex-col rounded-card border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/40 hover:bg-white/[0.07]">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-400 transition-colors group-hover:bg-gold-400 group-hover:text-navy-900"
                    >
                      <Icon className="size-6" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-heading text-sm font-semibold text-white/25"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 text-h3 text-white">{treatment.homeTitle}</h3>
                  <p className="mt-2 flex-1 text-base text-white/65">{treatment.homeSummary}</p>

                  <Link
                    to={`/treatments#${treatment.slug}`}
                    className="mt-6 inline-flex min-h-12 items-center gap-1 text-small font-semibold text-gold-400"
                  >
                    Learn more
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1"
                    />
                    <span className="sr-only"> about {treatment.homeTitle}</span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 text-center">
          <Link
            to="/treatments"
            className={buttonClasses(
              "secondary",
              "lg",
              "border-white/20 bg-white/5 text-white hover:border-gold-400 hover:bg-white/10",
            )}
          >
            View Full List of Treatments
          </Link>
        </div>
      </div>
    </section>
  );
}
