import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import type { Testimonial } from "~/lib/api";
import { useReveal } from "~/lib/useReveal";
import { SectionHeading } from "../ui/SectionHeading";

/*
 * Section 5 — three cards side by side from lg up. Below lg it becomes a
 * one-card carousel that advances every 6 s, with dots, arrows and a pause
 * button. Rotation stops on hover, on focus and under reduced motion.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const ref = useReveal<HTMLElement>();
  const [index, setIndex] = useState(0);
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!compact || hovered || userPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /*
     * A timeout keyed on `index` rather than an interval: any manual choice
     * restarts the six-second clock, so the carousel never yanks a card away
     * a moment after the visitor picked it.
     */
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [compact, hovered, userPaused, index, items.length]);

  const goTo = (next: number) => setIndex((next + items.length) % items.length);

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const from = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!from || !touch || !compact) return;

    const dx = touch.clientX - from.x;
    const dy = touch.clientY - from.y;

    // Ignore vertical swipes and short accidental drags.
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    goTo(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section ref={ref} className="reveal section-y bg-lavender-50">
      <div className="container-page">
        <SectionHeading title="What Our Patients Say" />

        <div
          className="mt-12"
          role="group"
          aria-roledescription="carousel"
          aria-label="Patient testimonials"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
        >
          <div
            className="overflow-hidden lg:overflow-visible"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <ul
              className="flex lg:grid lg:grid-cols-3 lg:gap-6"
              style={
                compact
                  ? {
                      transform: `translateX(-${index * 100}%)`,
                      transition: "transform 300ms ease-out",
                    }
                  : undefined
              }
            >
              {items.map((testimonial, position) => (
                <li
                  key={testimonial.author}
                  className="w-full shrink-0 lg:w-auto"
                  aria-hidden={compact && position !== index ? true : undefined}
                >
                  <figure className="flex h-full flex-col rounded-card bg-white p-6 shadow-soft">
                    <blockquote className="text-base text-ink-600">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-auto flex items-center justify-between gap-3 pt-6">
                      <span className="font-semibold text-ink-900">{testimonial.author}</span>
                      {testimonial.rating ? (
                        <span
                          className="flex gap-0.5 text-rose-600"
                          aria-label={`${testimonial.rating} out of 5 stars`}
                        >
                          {Array.from({ length: testimonial.rating }).map((_, star) => (
                            <Star key={star} aria-hidden="true" className="size-4 fill-current" />
                          ))}
                        </span>
                      ) : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous testimonial"
              className="inline-flex size-12 items-center justify-center rounded-full border border-lavender-300 bg-white text-lavender-700 hover:bg-lavender-50"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>

            <div className="flex items-center gap-1">
              {items.map((testimonial, position) => (
                <button
                  key={testimonial.author}
                  type="button"
                  onClick={() => goTo(position)}
                  aria-label={`Show testimonial ${position + 1}`}
                  aria-current={position === index}
                  className="inline-flex size-12 items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className={`size-2.5 rounded-full ${
                      position === index ? "bg-lavender-700" : "bg-lavender-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setUserPaused((paused) => !paused)}
              aria-label={userPaused ? "Play testimonials" : "Pause testimonials"}
              aria-pressed={userPaused}
              className="inline-flex size-12 items-center justify-center rounded-full border border-lavender-300 bg-white text-lavender-700 hover:bg-lavender-50"
            >
              {userPaused ? (
                <Play aria-hidden="true" className="size-5" />
              ) : (
                <Pause aria-hidden="true" className="size-5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next testimonial"
              className="inline-flex size-12 items-center justify-center rounded-full border border-lavender-300 bg-white text-lavender-700 hover:bg-lavender-50"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
