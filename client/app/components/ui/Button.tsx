import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/*
 * Section 6 — one button, three variants, 48 px minimum tap target.
 * Primary is the only pink element on a page; it is reserved for
 * "Fix an Appointment" and the contact form's Submit.
 */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = "") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium",
    "transition-colors focus-visible:outline-3 focus-visible:outline-offset-2",
    "min-h-12",
    size === "sm" && "px-3 text-sm",
    size === "md" && "px-6 text-base",
    variant === "primary" && "border-transparent bg-rose-600 text-white hover:bg-rose-600/90",
    variant === "secondary" &&
      "border-lavender-300 bg-white text-lavender-700 hover:bg-lavender-50",
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
