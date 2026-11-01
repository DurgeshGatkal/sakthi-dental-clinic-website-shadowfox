import type { Amenity } from "~/lib/api";
import { getIcon } from "~/lib/icons";
import { useReveal } from "~/lib/useReveal";
import { SectionHeading } from "../ui/SectionHeading";

export function Amenities({ items }: { items: Amenity[] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal section-y relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 size-[28rem] rounded-full bg-lavender-100/70 blur-3xl"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Comfort first"
          title="Clinic Facilities"
          description="Thoughtful details that make every visit calm, accessible and stress-free."
        />

        <ul className="reveal-stagger mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {items.map((amenity, position) => {
            const Icon = getIcon(amenity.icon);

            return (
              <li
                key={amenity.title}
                className={`group flex flex-col items-center gap-4 rounded-card border border-lavender-100 bg-lavender-50/60 px-4 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-lavender-300 hover:bg-white hover:shadow-glass ${
                  items.length % 2 === 1 && position === items.length - 1
                    ? "col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-14 items-center justify-center rounded-full bg-white text-lavender-700 shadow-soft transition-colors group-hover:bg-lavender-700 group-hover:text-white"
                >
                  <Icon className="size-7" />
                </span>
                <span className="text-base font-medium text-ink-900">{amenity.title}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
