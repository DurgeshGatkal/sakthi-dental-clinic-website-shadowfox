import { CTA_LABELS } from "@sakthi/shared";
import { Button } from "../ui/Button";
import { ctaHandlers, type CtaLocation } from "./ctaConfig";

type Props = {
  location: CtaLocation;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function AppointmentButton({ location, size = "md", className }: Props) {
  return (
    <Button
      variant="primary"
      size={size}
      className={className}
      data-cta="fix-appointment"
      data-cta-location={location}
      onClick={() => ctaHandlers.appointment(location)}
    >
      {CTA_LABELS.appointment}
    </Button>
  );
}
