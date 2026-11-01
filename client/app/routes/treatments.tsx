import { CtaBand } from "~/components/layout/CtaBand";
import { PageBanner } from "~/components/layout/PageBanner";
import { TreatmentDetail } from "~/components/treatments/TreatmentDetail";
import { TreatmentIndex } from "~/components/treatments/TreatmentIndex";
import { getTreatments, type Treatment } from "~/lib/api";
import { PAGE_TITLES, breadcrumbs, seoMeta } from "~/lib/seo";
import { TREATMENTS_INTRO } from "~/lib/showcase";

export async function loader() {
  return { treatments: await getTreatments() };
}

export function meta() {
  return seoMeta({
    title: PAGE_TITLES.treatments,
    description:
      "From teeth cleaning and fillings to implants, braces and clear aligners, explore every treatment at Sakthi Dental Clinic in Hosur.",
    path: "/treatments",
    jsonLd: [breadcrumbs({ name: "Treatments", path: "/treatments" })],
  });
}

export default function Treatments({ loaderData }: { loaderData: { treatments: Treatment[] } }) {
  const { treatments } = loaderData;

  return (
    <>
      <PageBanner eyebrow="What we do" title="Our Treatments" description={TREATMENTS_INTRO} />
      <TreatmentIndex treatments={treatments} />

      <section className="section-y bg-white">
        <div className="container-page space-y-16 lg:space-y-24">
          {treatments.map((treatment, index) => (
            <TreatmentDetail key={treatment.slug} treatment={treatment} index={index} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
