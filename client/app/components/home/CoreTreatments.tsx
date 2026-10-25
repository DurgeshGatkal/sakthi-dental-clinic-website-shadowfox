import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { Treatment } from "~/lib/api";
import { getIcon } from "~/lib/icons";
import { useReveal } from "~/lib/useReveal";
import { buttonClasses } from "../ui/Button";
import { IconBadge } from "../ui/IconBadge";
import { SectionHeading } from "../ui/SectionHeading";

export function CoreTreatments({ items }: { items: Treatment[] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal section-y bg-white">
      <div className="container-page">
        <SectionHeading title="Explore Our Services" />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((treatment) => (
            <li key={treatment.slug}>
              <article className="flex h-full flex-col rounded-card border border-lavender-100 bg-white p-6 shadow-soft transition-transform duration-200 hover:-translate-y-1">
                <IconBadge icon={getIcon(treatment.icon)} />
                <h3 className="mt-5 text-h3">{treatment.homeTitle}</h3>
                <p className="mt-2 flex-1 text-base text-ink-600">{treatment.homeSummary}</p>
                <Link
                  to={`/treatments#${treatment.slug}`}
                  className="mt-5 inline-flex min-h-12 items-center gap-1 font-medium text-lavender-700 hover:underline"
                >
                  Learn more
                  <ArrowRight aria-hidden="true" className="size-4" />
                  <span className="sr-only"> about {treatment.homeTitle}</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link to="/treatments" className={buttonClasses("secondary", "lg")}>
            View Full List of Treatments
          </Link>
        </div>
      </div>
    </section>
  );
}
