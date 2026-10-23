import { Phone } from "lucide-react";
import { PRIMARY_PHONE_DISPLAY, PRIMARY_PHONE_E164 } from "@sakthi/shared";

/* Section 5 — the client's banner photo under a lavender wash, 280/200 px. */
export function AssuranceBanner({ line }: { line: string }) {
  return (
    <section className="relative isolate flex min-h-[200px] items-center overflow-hidden md:min-h-[280px]">
      <img
        src="/images/banners/banner-1.jpg"
        alt=""
        aria-hidden="true"
        width={1806}
        height={566}
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-lavender-700/85" />

      <div className="container-page flex flex-col items-start gap-5 py-10 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-h2 text-white">{line}</p>
        <a
          href={`tel:${PRIMARY_PHONE_E164}`}
          className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-base font-medium text-lavender-700 transition-colors hover:bg-lavender-50"
        >
          <Phone aria-hidden="true" className="size-5" />
          Call {PRIMARY_PHONE_DISPLAY}
        </a>
      </div>
    </section>
  );
}
