import { Eye, HeartHandshake } from "lucide-react";
import type { Clinic } from "~/lib/api";
import { useReveal } from "~/lib/useReveal";
import { IconBadge } from "../ui/IconBadge";
import { SectionHeading } from "../ui/SectionHeading";

/* Section 5 — two cards, mission first as in the brief. */
export function VisionMission({ content }: { content: Clinic["visionMission"] }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal section-y bg-lavender-50">
      <div className="container-page">
        <SectionHeading eyebrow="What drives us" title="Our Vision & Mission" />

        <div className="reveal-stagger mt-12 grid gap-6 md:grid-cols-2">
          <article className="group rounded-card border border-lavender-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glass md:p-8">
            <IconBadge icon={HeartHandshake} />
            <h3 className="mt-5 text-h3">Our Mission</h3>
            <p className="mt-3 text-body text-ink-600">{content.mission}</p>
            <span
              aria-hidden="true"
              className="mt-6 block h-px w-10 bg-gold-400 transition-all duration-300 group-hover:w-20"
            />
          </article>

          <article className="group rounded-card border border-lavender-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glass md:p-8">
            <IconBadge icon={Eye} />
            <h3 className="mt-5 text-h3">Our Vision</h3>
            <p className="mt-3 text-body text-ink-600">{content.vision}</p>
            <span
              aria-hidden="true"
              className="mt-6 block h-px w-10 bg-gold-400 transition-all duration-300 group-hover:w-20"
            />
          </article>
        </div>
      </div>
    </section>
  );
}
