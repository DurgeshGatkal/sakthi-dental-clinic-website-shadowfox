import { NotFoundContent, meta as notFoundMeta } from "./not-found";

/*
 * Section 5 — a real route at /404 so React Router can prerender the page.
 * The splat route throws (it must answer with HTTP 404), which a prerender
 * cannot write, so this twin renders the same component and the build copies
 * it to 404.html. No indexable URL is added: the page carries noindex.
 */
export function meta() {
  return notFoundMeta();
}

export default function PreRenderedNotFound() {
  return <NotFoundContent status={404} />;
}
