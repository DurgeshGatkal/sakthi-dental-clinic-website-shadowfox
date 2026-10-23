import { Link } from "react-router";
import { buttonClasses } from "~/components/ui/Button";

export function meta() {
  return [
    { title: "Page not found | Sakthi Dental Clinic" },
    { name: "robots", content: "noindex" },
  ];
}

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-lavender-700 uppercase">404</p>
        <h1 className="mt-3 text-h1">We couldn&rsquo;t find that page</h1>
        <p className="mt-4 text-ink-600">
          The link may be out of date. You can head back to the home page, or contact the clinic and
          we will help.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={buttonClasses("primary", "lg")}>
            Back to home
          </Link>
          <Link to="/contact" className={buttonClasses("secondary", "lg")}>
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
