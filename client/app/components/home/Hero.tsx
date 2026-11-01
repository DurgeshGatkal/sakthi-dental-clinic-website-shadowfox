import { useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Clinic } from "~/lib/api";
import { HERO_SIZES } from "~/lib/images";
import { AppointmentButton } from "../cta/AppointmentButton";
import { EmergencyButton } from "../cta/EmergencyButton";
import { Picture } from "../ui/Picture";

/* Trust strip labels are fixed by the plan (section 5, Home item 1). */
const trust = ["Since 2004", "20+ years of expertise", "9 specialist doctors", "Open daily"];

export function Hero({ clinic }: { clinic: Clinic }) {
  const frameRef = useRef<HTMLDivElement>(null);

  /*
   * A gentle pointer tilt on the hero photo. Pointer events only, so touch
   * devices keep the plain image; reduced-motion users opt out entirely.
   */
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const element = frameRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    element.style.transform = `perspective(1000px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
  };

  const onPointerLeave = () => {
    const element = frameRef.current;
    if (element) element.style.transform = "";
  };

  return (
    <section className="mesh-bg noise relative isolate overflow-hidden">
      {/* Decorative blurred shapes — pure ornament, hidden from assistive tech. */}
      <div
        aria-hidden="true"
        className="float-slow pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-lavender-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="float-slower pointer-events-none absolute top-24 -right-40 size-[34rem] rounded-full bg-gold-400/20 blur-3xl"
      />

      <div className="container-page relative grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-28">
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-lavender-300/60 bg-white/60 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-lavender-700 uppercase backdrop-blur">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-400" />
            {clinic.hero.eyebrow}
          </p>

          <h1 className="mt-6 text-h1">{clinic.hero.headline}</h1>

          <p className="mt-6 max-w-xl text-body text-ink-600">{clinic.hero.subtext}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <AppointmentButton location="hero" size="lg" />
            <EmergencyButton location="hero" size="lg" />
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-lavender-300/50 pt-7 text-small font-medium text-ink-600 sm:grid-cols-4">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={frameRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative transition-transform duration-300 ease-out will-change-transform"
        >
          {/* Offset frame gives the photo an editorial, layered feel. */}
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-[2.25rem] border border-lavender-300/60 md:-inset-5"
          />
          <Picture
            src={clinic.hero.image.src}
            alt={clinic.hero.image.alt}
            width={2000}
            height={1333}
            sizes={HERO_SIZES}
            loading="eager"
            fetchPriority="high"
            className="aspect-[4/5] w-full rounded-[1.9rem] object-cover shadow-glass sm:aspect-[4/3] lg:aspect-[4/5]"
          />

          {/* Floating glass credential card. */}
          <div className="glass absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-glass sm:left-6">
            <span className="flex size-10 items-center justify-center rounded-full bg-lavender-700 text-white">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-small font-semibold text-ink-900">Complete dental care</p>
              <p className="text-xs text-ink-600">All specialties under one roof</p>
            </div>
          </div>

          <a
            href="#why-choose"
            className="link-underline absolute top-4 right-4 hidden items-center gap-1 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-lavender-700 uppercase backdrop-blur sm:inline-flex"
          >
            Discover more
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
