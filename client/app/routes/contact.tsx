import { PRIMARY_PHONE_DISPLAY, PRIMARY_PHONE_E164 } from "@sakthi/shared/site";
import { ContactForm } from "~/components/contact/ContactForm";
import { ReachUs } from "~/components/contact/ReachUs";
import { PageBanner } from "~/components/layout/PageBanner";
import { getClinicContent, type Clinic } from "~/lib/api";
import { PAGE_TITLES, breadcrumbs, seoMeta } from "~/lib/seo";

export async function loader() {
  return { clinic: await getClinicContent() };
}

export function meta() {
  return seoMeta({
    title: PAGE_TITLES.contact,
    description:
      "Book an appointment or ask a question. Sakthi Dental Clinic, B2/8, SBM Layout, Anthivadi, Hosur, Tamil Nadu 635109.",
    path: "/contact",
    jsonLd: [breadcrumbs({ name: "Contact Us", path: "/contact" })],
  });
}

export default function Contact({ loaderData }: { loaderData: { clinic: Clinic } }) {
  return (
    <>
      <PageBanner title="Contact Us" />

      {/* No reveal here: the form is the LCP surface on this route. */}
      <section className="section-y bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <div>
            <h2 className="text-h2">We would love to hear from you</h2>
            <p className="mt-3 text-body text-ink-600">
              Send us a message and our front desk will get back to you during clinic hours.
            </p>

            <div className="mt-8">
              <ContactForm phoneDisplay={PRIMARY_PHONE_DISPLAY} phoneE164={PRIMARY_PHONE_E164} />
            </div>
          </div>

          <ReachUs clinic={loaderData.clinic} />
        </div>
      </section>
    </>
  );
}
