import { CTA_LABELS } from "@sakthi/shared";
import { Button } from "../ui/Button";
import { ctaHandlers, type CtaLocation } from "./ctaConfig";

type Props = {
  location: CtaLocation;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function EmergencyButton({ location, size = "md", className }: Props) {
  return (
    <Button
      variant="secondary"
      size={size}
      className={className}
      data-cta="emergency-support"
      data-cta-location={location}
      onClick={() => ctaHandlers.emergency(location)}
    >
      {CTA_LABELS.emergency}
    </Button>
  );
}
