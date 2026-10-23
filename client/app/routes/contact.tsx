import { PageBanner } from "~/components/layout/PageBanner";

export function meta() {
  return [
    { title: "Contact Us | Sakthi Dental Clinic" },
    {
      name: "description",
      content:
        "Book an appointment or ask a question. Sakthi Dental Clinic, B2/8, SBM Layout, Anthivadi, Hosur, Tamil Nadu 635109.",
    },
  ];
}

/* Day 6 fills this in: contact form, Reach us panel, map link. */
export default function Contact() {
  return (
    <PageBanner
      eyebrow="Contact"
      title="Contact Us"
      description="Book an appointment, ask a question, or find us in Hosur."
    />
  );
}
