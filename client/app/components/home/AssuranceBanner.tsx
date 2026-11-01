import { Phone } from "lucide-react";
import { PRIMARY_PHONE_DISPLAY, PRIMARY_PHONE_E164 } from "@sakthi/shared/site";
import { Picture } from "../ui/Picture";

/* Section 5 — the client's banner photo under a deep-navy wash, 280/200 px. */
export function AssuranceBanner({ line }: { line: string }) {
  return (
    <section className="relative isolate flex min-h-[220px] items-center overflow-hidden md:min-h-[320px]">
      <Picture
        src="/images/banners/banner-1.jpg"
        alt=""
        width={1806}
        height={566}
        sizes="100vw"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy-900/85" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-navy-900 via-navy-900/70 to-transparent"
      />

      <div className="container-page flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
            Patient promise
          </p>
          <p className="max-w-2xl text-h2 text-white">{line}</p>
        </div>
        <a
          href={`tel:${PRIMARY_PHONE_E164}`}
          className="shine inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-gold-400 px-7 text-base font-semibold text-navy-900 transition-colors hover:bg-gold-400/90"
        >
          <Phone aria-hidden="true" className="size-5" />
          Call {PRIMARY_PHONE_DISPLAY}
        </a>
      </div>
    </section>
  );
}
