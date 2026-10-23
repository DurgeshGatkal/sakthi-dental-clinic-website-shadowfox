import { CtaBand } from "~/components/layout/CtaBand";
import { PageBanner } from "~/components/layout/PageBanner";
import { TreatmentDetail } from "~/components/treatments/TreatmentDetail";
import { TreatmentIndex } from "~/components/treatments/TreatmentIndex";
import { getTreatments, type Treatment } from "~/lib/api";

export async function loader() {
  return { treatments: await getTreatments() };
}

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

export default function Treatments({ loaderData }: { loaderData: { treatments: Treatment[] } }) {
  const { treatments } = loaderData;

  return (
    <>
      <PageBanner title="Our Treatments" />
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
