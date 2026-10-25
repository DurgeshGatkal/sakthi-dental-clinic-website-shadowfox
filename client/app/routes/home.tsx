import { Amenities } from "~/components/home/Amenities";
import { AssuranceBanner } from "~/components/home/AssuranceBanner";
import { CoreTreatments } from "~/components/home/CoreTreatments";
import { CtaBand } from "~/components/layout/CtaBand";
import { Hero } from "~/components/home/Hero";
import { TestimonialCarousel } from "~/components/home/TestimonialCarousel";
import { WhyChoose } from "~/components/home/WhyChoose";
import { getHome, type HomeContent } from "~/lib/api";
import { PAGE_TITLES, seoMeta } from "~/lib/seo";

export async function loader() {
  return { home: await getHome() };
}

export function meta({ data }: { data?: { home: HomeContent } }) {
  return seoMeta({
    title: PAGE_TITLES.home,
    description:
      data?.home.clinic.hero.subtext ??
      "Compassionate dental care for women, children and families in Hosur, with general, cosmetic and specialist treatments under one roof.",
    path: "/",
  });
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
