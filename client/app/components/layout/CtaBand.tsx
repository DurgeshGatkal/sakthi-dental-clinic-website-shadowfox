import { useReveal } from "~/lib/useReveal";
import { AppointmentButton } from "../cta/AppointmentButton";
import { CallButton } from "../cta/CallButton";

/* Section 5 — closing band that repeats the two primary actions. */
export function CtaBand() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="reveal relative isolate overflow-hidden bg-lavender-700">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-20 size-[28rem] rounded-full bg-gold-400/20 blur-3xl"
      />
      <div className="container-page relative flex flex-col items-start gap-7 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">
            Your smile, our priority
          </p>
          <h2 className="max-w-xl text-h2 text-white">Ready for a healthier smile?</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <AppointmentButton location="page-cta" size="lg" />
          <CallButton size="lg" />
        </div>
      </div>
    </section>
  );
}
