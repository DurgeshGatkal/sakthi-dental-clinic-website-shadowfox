import { PageBanner } from "~/components/layout/PageBanner";
import { PolicyMarkdown } from "~/components/ui/PolicyMarkdown";
import { getPrivacyPolicy, type PrivacyPolicy as Policy } from "~/lib/api";
import { useReveal } from "~/lib/useReveal";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* Module-level formatting keeps prerender and browser output identical. */
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export async function loader() {
  return { policy: await getPrivacyPolicy() };
}

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

export default function PrivacyPolicy({ loaderData }: { loaderData: { policy: Policy } }) {
  const { policy } = loaderData;
  const ref = useReveal<HTMLElement>();

  return (
    <>
      <PageBanner title="Privacy Policy" />

      <section ref={ref} className="reveal section-y bg-white">
        <div className="container-page">
          <article className="mx-auto max-w-prose">
            <p className="text-small font-medium text-lavender-700">
              Last updated {formatDate(policy.updatedAt)}
            </p>

            <div className="mt-8">
              <PolicyMarkdown markdown={policy.markdown} />
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
