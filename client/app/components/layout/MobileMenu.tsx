import { useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { AppointmentButton } from "../cta/AppointmentButton";
import { CallButton } from "../cta/CallButton";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/treatments", label: "Treatments" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

/*
 * Section 5 — slide-in menu. Escape closes, Tab stays inside, the page
 * behind does not scroll, and the trigger gets focus back on close.
 */
export function MobileMenu({ open, onClose, triggerRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const location = useLocation();
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    onCloseRef.current();
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;

      const first = items[0]!;
      const last = items[items.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (panel?.contains(document.activeElement)) triggerRef.current?.focus();
    };
  }, [open, triggerRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${open ? "" : "pointer-events-none"}`}
      inert={!open}
    >
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className={`absolute inset-0 bg-ink-900/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute top-0 right-0 flex h-full w-[min(20rem,85vw)] flex-col gap-6 overflow-y-auto bg-white p-6 shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold">
            Menu
          </h2>
          <button
            type="button"
            onClick={() => {
              onClose();
              triggerRef.current?.focus();
            }}
            className="inline-flex size-12 items-center justify-center rounded-full text-ink-900 hover:bg-lavender-50"
            aria-label="Close menu"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center border-b border-lavender-100 text-lg font-medium ${
                      isActive ? "text-lavender-700" : "text-ink-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <AppointmentButton location="mobile-menu" size="lg" />
          <CallButton size="lg" />
        </div>

        <Link
          to="/privacy-policy"
          className="inline-flex min-h-12 items-center text-small text-ink-600 underline underline-offset-4"
        >
          Privacy Policy
        </Link>
      </div>
    </div>,
    document.body,
  );
}
