import { useEffect, useRef } from "react";

/*
 * Section 6 — fade-and-rise on scroll via IntersectionObserver, no library.
 * Sections start hidden in the server HTML and get `.is-visible` when they
 * enter the viewport. `noscript` CSS in the document head keeps the page
 * readable if JavaScript never runs.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
