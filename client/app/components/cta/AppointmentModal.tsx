import { useEffect, useState } from "react";

const DOCTORS = [
  "Dr. Anupriya — Founder",
  "Dr. Ananya Iyer — Prosthodontist",
  "Dr. Meera Subramanian — Endodontist",
  "Dr. Arvind Kumar — Dental Surgeon",
  "Dr. Sneha N — Orthodontist",
  "Dr. Srinivas Rohit Ramanujam — Implantologist",
  "Dr. Balu — Laser Surgeon",
  "Dr. Vikram Raj Kishore — Aligners Partner",
  "Dr. Ajay Jumar — Oral & Maxillofacial Surgeon",
];

export function AppointmentModal() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const handler = () => {
      setDone(false);
      setOpen(true);
    };
    window.addEventListener("sakthi:open-appointment", handler);
    return () => window.removeEventListener("sakthi:open-appointment", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appt-title"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-card bg-white p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="appt-title" className="text-h2">
            Fix an Appointment
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-full text-ink-600 hover:bg-lavender-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {done ? (
          <p className="mt-6 text-h3 text-lavender-700">The upgrade is fixed.</p>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <p className="text-small text-ink-600">
              Brand: <span className="font-semibold text-ink-900">Sakthi Dental Clinic, Hosur</span>
            </p>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Full name</span>
              <input
                required
                className="mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Phone number</span>
              <input
                required
                type="tel"
                className="mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Email</span>
              <input
                required
                type="email"
                className="mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Preferred doctor</span>
              <select className="mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3">
                {DOCTORS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Specialization</span>
              <input
                className="mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3"
                placeholder="e.g. Orthodontist"
              />
            </label>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Preferred date</span>
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Any other requirements</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-600/90"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
