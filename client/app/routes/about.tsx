import { PageBanner } from "~/components/layout/PageBanner";

export function meta() {
  return [
    { title: "About Us | Sakthi Dental Clinic" },
    {
      name: "description",
      content:
        "Your Trusted Partner in Dental Care. Meet Dr. Anupriya and the team at Sakthi Dental Clinic, Hosur.",
    },
  ];
}

/* Day 4 fills this in: founder story, credential panel, vision, mission, doctors. */
export default function About() {
  return (
    <PageBanner
      eyebrow="About us"
      title="Get to Know Dr. Anupriya"
      description="Your Trusted Partner in Dental Care"
    />
  );
}
