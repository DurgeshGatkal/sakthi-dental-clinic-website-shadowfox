import { Amenities } from "~/components/home/Amenities";
import { AssuranceBanner } from "~/components/home/AssuranceBanner";
import { CoreTreatments } from "~/components/home/CoreTreatments";
import { CtaBand } from "~/components/home/CtaBand";
import { Hero } from "~/components/home/Hero";
import { TestimonialCarousel } from "~/components/home/TestimonialCarousel";
import { WhyChoose } from "~/components/home/WhyChoose";
import { getHome, type HomeContent } from "~/lib/api";

export async function loader() {
  return { home: await getHome() };
}

export function meta({ data }: { data?: { home: HomeContent } }) {
  return [
    { title: "Sakthi Dental Clinic | Dental Care in Hosur" },
    {
      name: "description",
      content:
        data?.home.clinic.hero.subtext ??
        "Experience compassionate, expert-led dental services tailored to your needs, all in a modern and welcoming environment.",
    },
  ];
}

export default function Home({ loaderData }: { loaderData: { home: HomeContent } }) {
  const { home } = loaderData;

  return (
    <>
      <Hero clinic={home.clinic} />
      <AssuranceBanner line={home.clinic.assurance} />
      <WhyChoose items={home.whyChoose} />
      <CoreTreatments items={home.coreTreatments} />
      <TestimonialCarousel items={home.testimonials} />
      <Amenities items={home.amenities} />
      <CtaBand />
    </>
  );
}
