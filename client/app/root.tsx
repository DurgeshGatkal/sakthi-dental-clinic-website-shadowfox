import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import interBodyUrl from "@fontsource/inter/files/inter-latin-400-normal.woff2?url";
import headingUrl from "@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2?url";
import "./../src/styles/globals.css";

import type { ReactNode } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { MobileActionBar } from "./components/layout/MobileActionBar";
import { buttonClasses } from "./components/ui/Button";
import { getClinic, getCoreTreatments } from "./lib/api";
import { PAGE_TITLES, dentistJsonLd, serializeJsonLd } from "./lib/seo";

export function meta() {
  return [
    { title: PAGE_TITLES.home },
    {
      name: "description",
      content:
        "Experience compassionate, expert-led dental services tailored to your needs, all in a modern and welcoming environment.",
    },
  ];
}

export async function loader() {
  const [clinic, coreTreatments] = await Promise.all([getClinic(), getCoreTreatments()]);
  return { clinic, coreTreatments };
}

type RootData = {
  clinic: Awaited<ReturnType<typeof getClinic>>;
  coreTreatments: Awaited<ReturnType<typeof getCoreTreatments>>;
};

/* Section 11 — the document shell. Header, main and footer live in App. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/png" href="/icon-32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/icon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Section 14 — the two faces that paint the LCP text; the remaining
            weights load normally. crossOrigin is required for font preloads. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={interBodyUrl}
          crossOrigin="anonymous"
        />
        <link rel="preload" as="font" type="font/woff2" href={headingUrl} crossOrigin="anonymous" />
        <Meta />
        <Links />
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: { loaderData: RootData }) {
  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      {/* Section 14 — Dentist schema on every page; rendered here because a
          route's meta export replaces its parent's rather than merging. */}
      {loaderData.clinic ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(dentistJsonLd(loaderData.clinic)) }}
        />
      ) : null}

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-ink-900 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Header clinic={loaderData.clinic} />

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer clinic={loaderData.clinic} treatments={loaderData.coreTreatments} />
      <MobileActionBar />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <section className="section-y">
      <div className="container-page max-w-2xl text-center">
        <h1 className="text-h1">{notFound ? "Page not found" : "Something went wrong"}</h1>
        <p className="mt-4 text-ink-600">
          {notFound
            ? "The page you are looking for may have moved."
            : "Please try again in a moment, or call the clinic and we will help."}
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
