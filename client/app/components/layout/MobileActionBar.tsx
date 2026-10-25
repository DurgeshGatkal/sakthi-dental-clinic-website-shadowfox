import { useEffect, useState } from "react";
import { AppointmentButton } from "../cta/AppointmentButton";
import { CallButton } from "../cta/CallButton";

/*
 * Section 5 — phone-only action bar: appointment plus a call link.
 * It hides while the contact form is focused so the keyboard never
 * covers a field.
 */
export function MobileActionBar() {
  const [formFocused, setFormFocused] = useState(false);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.closest("form")) {
        setFormFocused(true);
      }
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Element) || !event.relatedTarget.closest("form")) {
        setFormFocused(false);
      }
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-lavender-100 bg-white px-3 pt-3 md:hidden ${
        formFocused ? "hidden" : ""
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex gap-2">
        <CallButton className="flex-1" label="Call" />
        <AppointmentButton location="mobile-bar" className="flex-[2]" />
      </div>
    </div>
  );
}
