import type { WhyChooseItem } from "~/lib/api";
import { getIcon } from "~/lib/icons";
import { useReveal } from "~/lib/useReveal";
import { IconBadge } from "../ui/IconBadge";
import { SectionHeading } from "../ui/SectionHeading";

export function WhyChoose({ items }: { items: WhyChooseItem[] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal section-y bg-lavender-50">
      <div className="container-page">
        <SectionHeading title="Why Choose Sakthi Dental Clinic?" />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-card bg-white p-6 shadow-soft transition-transform duration-200 hover:-translate-y-1"
            >
              <IconBadge icon={getIcon(item.icon)} />
              <h3 className="mt-5 text-h3">{item.title}</h3>
              <p className="mt-2 text-base text-ink-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
