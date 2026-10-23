import { PageBanner } from "~/components/layout/PageBanner";

export function meta() {
  return [
    { title: "Treatments | Sakthi Dental Clinic" },
    {
      name: "description",
      content:
        "From teeth cleaning and fillings to implants, braces and clear aligners, explore every treatment at Sakthi Dental Clinic in Hosur.",
    },
  ];
}

/* Day 5 fills this in: jump list and 15 alternating treatment blocks. */
export default function Treatments() {
  return (
    <PageBanner
      eyebrow="Treatments"
      title="Our Treatments"
      description="Modern, gentle dentistry for every age, from routine cleaning to implants and orthodontics."
    />
  );
}
