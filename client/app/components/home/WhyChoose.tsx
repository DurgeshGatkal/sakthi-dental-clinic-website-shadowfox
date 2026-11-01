import type { WhyChooseItem } from "~/lib/api";
import { getIcon } from "~/lib/icons";
import { useReveal } from "~/lib/useReveal";
import { IconBadge } from "../ui/IconBadge";
import { SectionHeading } from "../ui/SectionHeading";
import { WHY_CHOOSE_INTRO } from "~/lib/showcase";

export function WhyChoose({ items }: { items: WhyChooseItem[] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="why-choose"
      ref={ref}
      className="reveal section-y relative overflow-hidden bg-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-px w-2/3 bg-linear-to-l from-gold-400/60 to-transparent"
      />

      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Why Sakthi"
            title="Why Choose Sakthi Dental Clinic?"
            align="left"
          />
          <p className="max-w-xl text-body text-ink-600 lg:justify-self-end">{WHY_CHOOSE_INTRO}</p>
        </div>

        <ul className="reveal-stagger mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.title}
              className="group relative overflow-hidden rounded-card border border-lavender-100 bg-lavender-50/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-lavender-300 hover:bg-white hover:shadow-glass"
            >
              <span className="absolute top-5 right-5 grid size-9 place-items-center rounded-full bg-navy-900 text-xs font-semibold text-gold-400">
                {String(index + 1).padStart(2, "0")}
              </span>

              <IconBadge icon={getIcon(item.icon)} />

              <h3 className="mt-6 text-h3">{item.title}</h3>
              <p className="mt-2 text-base text-ink-600">{item.description}</p>

              <span
                aria-hidden="true"
                className="mt-6 block h-px w-10 bg-gold-400 transition-all duration-300 group-hover:w-20"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
