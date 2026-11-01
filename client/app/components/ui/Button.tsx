import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/*
 * Section 6 — one button, three variants, 48 px minimum tap target.
 * Primary is the only champagne-gold element on a page; it is reserved for
 * "Fix an Appointment" and the contact form's Submit.
 */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = "") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium",
    "transition-colors focus-visible:outline-3 focus-visible:outline-offset-2",
    "min-h-12",
    size === "sm" && "px-3 text-small",
    size === "md" && "px-6 text-base",
    variant === "primary" &&
      "shine border-transparent bg-gold-400 text-navy-900 shadow-soft hover:bg-gold-400/90",
    variant === "secondary" &&
      "border-lavender-300 bg-white/80 text-lavender-700 backdrop-blur hover:border-lavender-700 hover:bg-white",
    variant === "ghost" &&
      "border-transparent bg-transparent text-lavender-700 hover:bg-lavender-50",
    size === "lg" && "min-h-14 px-8 text-lg",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
