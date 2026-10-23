import type { Amenity } from "~/lib/api";
import { getIcon } from "~/lib/icons";
import { useReveal } from "~/lib/useReveal";
import { IconBadge } from "../ui/IconBadge";
import { SectionHeading } from "../ui/SectionHeading";

export function Amenities({ items }: { items: Amenity[] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal section-y bg-white">
      <div className="container-page">
        <SectionHeading title="Clinic Facilities" />

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5">
          {items.map((amenity, position) => (
            <li
              key={amenity.title}
              className={`flex flex-col items-center gap-4 text-center ${
                items.length % 2 === 1 && position === items.length - 1
                  ? "col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <IconBadge icon={getIcon(amenity.icon)} size="lg" />
              <span className="text-base font-medium text-ink-900">{amenity.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
