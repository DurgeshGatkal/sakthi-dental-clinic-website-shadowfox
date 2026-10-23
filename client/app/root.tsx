import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
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

export function meta() {
  return [
    { title: "Sakthi Dental Clinic | Dental Care in Hosur" },
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
