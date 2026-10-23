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
        <SectionHeading title="Our Vision & Mission" />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-card bg-white p-6 shadow-soft md:p-8">
            <IconBadge icon={HeartHandshake} />
            <h3 className="mt-5 text-h3">Our Mission</h3>
            <p className="mt-3 text-body text-ink-600">{content.mission}</p>
          </article>

          <article className="rounded-card bg-white p-6 shadow-soft md:p-8">
            <IconBadge icon={Eye} />
            <h3 className="mt-5 text-h3">Our Vision</h3>
            <p className="mt-3 text-body text-ink-600">{content.vision}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
