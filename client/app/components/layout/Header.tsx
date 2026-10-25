import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Link } from "react-router";
import { PRIMARY_PHONE_E164 } from "@sakthi/shared";
import type { Clinic } from "~/lib/api";
import { AppointmentButton } from "../cta/AppointmentButton";
import { MobileMenu } from "./MobileMenu";
import { Navbar } from "./Navbar";

/* Section 5 — sticky header that shrinks from 80 to 64 px once you scroll. */
export function Header({ clinic }: { clinic: Clinic | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-lavender-100 bg-white/95 backdrop-blur">
      <div
        className={`container-page flex items-center gap-8 transition-[height] duration-200 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link to="/" className="flex min-h-12 shrink-0 items-center">
          <img
            src="/images/logo/sdc-logo.png"
            alt={clinic?.name ?? "Sakthi Dental Clinic"}
            width={694}
            height={313}
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <Navbar className="hidden lg:flex" />

        <div className="ml-auto" />

        <a
          href={`tel:${PRIMARY_PHONE_E164}`}
          className="inline-flex size-12 items-center justify-center rounded-full text-lavender-700 hover:bg-lavender-50 lg:hidden"
          aria-label="Call the clinic"
        >
          <Phone aria-hidden="true" className="size-6" />
        </a>

        <div className="hidden md:block">
          <AppointmentButton location="header" />
        </div>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex size-12 items-center justify-center rounded-full text-ink-900 hover:bg-lavender-50 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} triggerRef={triggerRef} />
    </header>
  );
}
