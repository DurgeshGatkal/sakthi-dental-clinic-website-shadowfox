import { Phone } from "lucide-react";
import { CTA_LABELS, PRIMARY_PHONE_DISPLAY, PRIMARY_PHONE_E164 } from "@sakthi/shared/site";
import { buttonClasses } from "../ui/Button";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

/* A real tel: link, not a CTA handler — calling must always work. */
export function CallButton({ size = "md", className, label = CTA_LABELS.call }: Props) {
  return (
    <a
      href={`tel:${PRIMARY_PHONE_E164}`}
      className={buttonClasses("secondary", size, className)}
      aria-label={`${label}: ${PRIMARY_PHONE_DISPLAY}`}
    >
      <Phone aria-hidden="true" className="size-5" />
      {label}
    </a>
  );
}
