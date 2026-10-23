import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  size?: "md" | "lg";
  className?: string;
};

/* Lucide icon at 24 px inside a 48 px lavender circle (section 6). */
export function IconBadge({ icon: Icon, size = "md", className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-lavender-100 text-lavender-700 ${
        size === "lg" ? "size-14" : "size-12"
      } ${className}`}
    >
      <Icon className={size === "lg" ? "size-7" : "size-6"} />
    </span>
  );
}
