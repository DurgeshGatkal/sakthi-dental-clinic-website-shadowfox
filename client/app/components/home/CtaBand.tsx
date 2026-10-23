import { AppointmentButton } from "../cta/AppointmentButton";
import { CallButton } from "../cta/CallButton";

/* Section 5 — closing band that repeats the two primary actions. */
export function CtaBand() {
  return (
    <section className="bg-lavender-700">
      <div className="container-page flex flex-col items-start gap-6 py-14 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-h2 text-white">Ready for a healthier smile?</h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <AppointmentButton location="page-cta" size="lg" />
          <CallButton size="lg" />
        </div>
      </div>
    </section>
  );
}
