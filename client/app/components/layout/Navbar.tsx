import { NavLink } from "react-router";

const links = [
  { to: "/about", label: "About Us" },
  { to: "/treatments", label: "Treatments" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
];

export function Navbar({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Main" className={className}>
      <ul className="flex items-center gap-7 text-base font-medium">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `inline-flex min-h-12 items-center border-b-2 transition-colors ${
                  isActive
                    ? "border-lavender-700 text-lavender-700"
                    : "border-transparent text-ink-900 hover:text-lavender-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
