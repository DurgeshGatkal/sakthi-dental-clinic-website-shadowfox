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

const inputCls = "mt-1 w-full rounded-xl border border-lavender-300 px-4 py-3";

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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-card bg-white p-6 shadow-soft"
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

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Full name</span>
                <input required className={inputCls} />
              </label>
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Date of birth</span>
                <input type="date" className={inputCls} />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Gender</span>
                <select className={inputCls}>
                  <option value="">Select</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Phone number</span>
                <input required type="tel" className={inputCls} />
              </label>
            </div>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">Email</span>
              <input required type="email" className={inputCls} />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Preferred doctor</span>
                <select className={inputCls}>
                  {DOCTORS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Specialization</span>
                <input className={inputCls} placeholder="e.g. Orthodontist" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Preferred date</span>
                <input type="date" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-small font-semibold text-ink-900">Preferred time</span>
                <select className={inputCls}>
                  <option>Morning (9am–12pm)</option>
                  <option>Afternoon (12pm–4pm)</option>
                  <option>Evening (4pm–7pm)</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">
                Reason for visit / symptoms
              </span>
              <textarea rows={3} className={inputCls} placeholder="Describe your concern" />
            </label>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">
                Known allergies / medical conditions
              </span>
              <textarea
                rows={2}
                className={inputCls}
                placeholder="e.g. diabetes, penicillin allergy"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-small font-semibold text-ink-900">
                  Emergency contact name
                </span>
                <input className={inputCls} />
              </label>
              <label className="block">
                <span className="text-small font-semibold text-ink-900">
                  Emergency contact phone
                </span>
                <input type="tel" className={inputCls} />
              </label>
            </div>

            <label className="block">
              <span className="text-small font-semibold text-ink-900">
                Insurance / TPA (if any)
              </span>
              <input className={inputCls} placeholder="e.g. Star Health" />
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
