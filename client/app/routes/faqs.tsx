import { PageBanner } from "~/components/layout/PageBanner";

export function meta() {
  return [
    { title: "FAQs | Sakthi Dental Clinic" },
    {
      name: "description",
      content:
        "Answers to the questions patients ask us most, from scaling and sensitivity to braces and wisdom teeth.",
    },
  ];
}

/* Day 5 fills this in: the 14-question accordion. */
export default function Faqs() {
  return (
    <PageBanner
      eyebrow="Help centre"
      title="Frequently Asked Questions"
      description="Answers to the questions patients ask us most."
    />
  );
}
