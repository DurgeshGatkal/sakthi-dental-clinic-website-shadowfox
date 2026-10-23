import { PageBanner } from "~/components/layout/PageBanner";

export function meta() {
  return [
    { title: "Privacy Policy | Sakthi Dental Clinic" },
    {
      name: "description",
      content:
        "How Sakthi Dental Clinic collects, uses, stores and discloses information from visitors to this website.",
    },
  ];
}

/* Day 6 fills this in with the verbatim policy in a 720 px column. */
export default function PrivacyPolicy() {
  return <PageBanner title="Privacy Policy" description="Last updated 23 October 2026" />;
}
