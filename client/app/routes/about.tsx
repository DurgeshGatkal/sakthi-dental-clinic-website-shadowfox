import { DoctorGrid } from "~/components/about/DoctorGrid";
import { FounderProfile } from "~/components/about/FounderProfile";
import { VisionMission } from "~/components/about/VisionMission";
import { CtaBand } from "~/components/layout/CtaBand";
import { PageBanner } from "~/components/layout/PageBanner";
import { getClinicContent, getDoctors, type Clinic, type Doctor } from "~/lib/api";

export async function loader() {
  const [clinic, doctors] = await Promise.all([getClinicContent(), getDoctors()]);
  return { clinic, doctors };
}

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
