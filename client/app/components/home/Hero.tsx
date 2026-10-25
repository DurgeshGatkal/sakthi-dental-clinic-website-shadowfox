import type { Clinic } from "~/lib/api";
import { HERO_SIZES } from "~/lib/images";
import { AppointmentButton } from "../cta/AppointmentButton";
import { EmergencyButton } from "../cta/EmergencyButton";
import { Picture } from "../ui/Picture";

/* Trust strip labels are fixed by the plan (section 5, Home item 1). */
const trust = ["Since 2004", "20+ years of expertise", "9 specialist doctors", "Open daily"];

export function Hero({ clinic }: { clinic: Clinic }) {
  return (
    <section className="bg-white">
      <div className="container-page grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <p className="text-small font-semibold tracking-wide text-lavender-700 uppercase">
            {clinic.hero.eyebrow}
          </p>
          <h1 className="mt-3 text-h1">{clinic.hero.headline}</h1>
          <p className="mt-5 max-w-xl text-body text-ink-600">{clinic.hero.subtext}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppointmentButton location="hero" size="lg" />
            <EmergencyButton location="hero" size="lg" />
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-lavender-100 pt-6 text-small font-medium text-ink-600 sm:grid-cols-4">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-rose-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Picture
          src={clinic.hero.image.src}
          alt={clinic.hero.image.alt}
          width={2000}
          height={1333}
          sizes={HERO_SIZES}
          loading="eager"
          fetchPriority="high"
          className="aspect-[4/3] w-full rounded-card object-cover shadow-soft"
        />
      </div>
    </section>
  );
}
