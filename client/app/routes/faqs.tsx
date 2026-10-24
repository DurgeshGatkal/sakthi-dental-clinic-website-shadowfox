import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { Link } from "react-router";
import { FaqAccordion } from "~/components/faqs/FaqAccordion";
import { PageBanner } from "~/components/layout/PageBanner";
import { getFaqs, type Faq } from "~/lib/api";
import { useReveal } from "~/lib/useReveal";

export async function loader() {
  return { faqs: await getFaqs() };
}

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

export default function Faqs({ loaderData }: { loaderData: { faqs: Faq[] } }) {
  const ref = useReveal<HTMLElement>();

  return (
    <>
      <PageBanner title="Frequently Asked Questions" />

      <section ref={ref} className="reveal section-y bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <FaqAccordion faqs={loaderData.faqs} />
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-card bg-lavender-50 p-6 md:flex md:items-center md:justify-between md:gap-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-lavender-700">
                <MessageCircleQuestion aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2 className="text-h3">Still have questions?</h2>
                <p className="mt-1 text-body text-ink-600">
                  Send us a message or call the clinic and we will help.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border border-lavender-300 bg-white px-6 font-medium text-lavender-700 transition-colors hover:bg-lavender-100 md:mt-0 md:shrink-0"
            >
              Contact us
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
