import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { buttonClasses } from "~/components/ui/Button";

export function meta() {
  return [
    { title: "Page not found | Sakthi Dental Clinic" },
    { name: "robots", content: "noindex" },
  ];
}

/*
 * Section 5 — the splat route must answer with a real 404 status, so the
 * loader throws and the route's own error boundary draws the page inside
 * the normal header and footer.
 */
export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export function NotFoundContent({ status }: { status: number }) {
  return (
    <section className="mesh-bg noise relative isolate overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-heading text-[9rem] leading-none font-semibold text-lavender-300/25 select-none md:text-[16rem]"
      >
        {status}
      </span>

      <div className="container-page relative max-w-2xl py-24 text-center md:py-32">
        <p className="inline-flex items-center gap-2 rounded-full border border-lavender-300/60 bg-white/60 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-lavender-700 uppercase backdrop-blur">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gold-400" />
          Error {status}
        </p>

        <h1 className="mt-6 text-h1">We couldn&rsquo;t find that page</h1>
        <p className="mx-auto mt-5 max-w-md text-body text-ink-600">
          The link may be out of date. You can head back to the home page, or contact the clinic and
          we will help.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
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

export default function NotFound() {
  return <NotFoundContent status={404} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <NotFoundContent status={isRouteErrorResponse(error) ? error.status : 500} />;
}
