import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Clinic } from "~/lib/api";
import { PRIMARY_PHONE_E164, SECONDARY_PHONE_E164 } from "@sakthi/shared/site";

/* Section 5 — address, email, both phones and hours, each tappable. */
export function ReachUs({ clinic }: { clinic: Clinic }) {
  const { address } = clinic;
  const lines = [
    address.line1,
    address.area,
    `${address.city}, ${address.state} ${address.pincode}`,
    address.country,
  ];

  return (
    <div className="rounded-card border border-lavender-100 bg-white p-6 shadow-soft md:p-8 lg:self-start">
      <h2 className="text-h3">Reach us</h2>

      <ul className="mt-6 space-y-5">
        <li className="flex gap-3">
          <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-lavender-700" />
          <div>
            <p className="text-small font-semibold text-ink-900">Clinic address</p>
            <p className="mt-1 text-body text-ink-600">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </li>

        <li className="flex gap-3">
          <Mail aria-hidden="true" className="mt-1 size-5 shrink-0 text-lavender-700" />
          <div>
            <p className="text-small font-semibold text-ink-900">Email</p>
            {clinic.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="mt-1 inline-flex min-h-12 items-center text-body break-all text-ink-600 underline hover:text-lavender-700"
              >
                {email}
              </a>
            ))}
          </div>
        </li>

        <li className="flex gap-3">
          <Phone aria-hidden="true" className="mt-1 size-5 shrink-0 text-lavender-700" />
          <div>
            <p className="text-small font-semibold text-ink-900">Phone</p>
            {clinic.phones.map((phone, index) => (
              <a
                key={phone}
                href={`tel:${index === 0 ? PRIMARY_PHONE_E164 : SECONDARY_PHONE_E164}`}
                className="mt-1 inline-flex min-h-12 items-center text-body text-ink-600 underline hover:text-lavender-700"
              >
                {phone}
              </a>
            ))}
          </div>
        </li>

        <li className="flex gap-3">
          <Clock aria-hidden="true" className="mt-1 size-5 shrink-0 text-lavender-700" />
          <div>
            <p className="text-small font-semibold text-ink-900">Clinic hours</p>
            <p className="mt-1 text-body font-semibold text-ink-900">{clinic.timings}</p>
            <p className="mt-1 text-small text-ink-600">{clinic.doctorAvailability}</p>
          </div>
        </li>
      </ul>

      {/* Section 5 — no map iframe: one fast link out to Google Maps instead. */}
      <a
        href={clinic.mapUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex items-center gap-3 rounded-xl bg-lavender-50 p-4 transition-colors hover:bg-lavender-100"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-lavender-700">
          <MapPin aria-hidden="true" className="size-5" />
        </span>
        <span className="text-small">
          <span className="block font-semibold text-ink-900">Open in Google Maps</span>
          <span className="block text-ink-600">Get directions to the clinic</span>
        </span>
      </a>
    </div>
  );
}
