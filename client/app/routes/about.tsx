import { DoctorGrid } from "~/components/about/DoctorGrid";
import { FounderProfile } from "~/components/about/FounderProfile";
import { VisionMission } from "~/components/about/VisionMission";
import { CtaBand } from "~/components/layout/CtaBand";
import { PageBanner } from "~/components/layout/PageBanner";
import { getClinicContent, getDoctors, type Clinic, type Doctor } from "~/lib/api";
import { PAGE_TITLES, breadcrumbs, seoMeta } from "~/lib/seo";

export async function loader() {
  const [clinic, doctors] = await Promise.all([getClinicContent(), getDoctors()]);
  return { clinic, doctors };
}

export function meta() {
  return seoMeta({
    title: PAGE_TITLES.about,
    description:
      "Meet Dr. Anupriya and the team at Sakthi Dental Clinic, Hosur. Nine specialists, 20+ years of experience and care for the whole family.",
    path: "/about",
    jsonLd: [breadcrumbs({ name: "About Us", path: "/about" })],
  });
}

export default function About({
  loaderData,
}: {
  loaderData: { clinic: Clinic; doctors: Doctor[] };
}) {
  const { clinic, doctors } = loaderData;

  return (
    <>
      <PageBanner title="About Us" />
      <FounderProfile founder={clinic.founder} />
      <VisionMission content={clinic.visionMission} />
      <DoctorGrid doctors={doctors} />
      <CtaBand />
    </>
  );
}
