type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/* Section 5 — compact banner that opens every inner page. */
export function PageBanner({ eyebrow, title, description }: Props) {
  return (
    <section className="mesh-bg noise relative isolate overflow-hidden border-b border-lavender-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 size-[24rem] rounded-full bg-gold-400/15 blur-3xl"
      />
      <div className="container-page relative py-16 md:py-24">
        {eyebrow ? (
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-lavender-700 uppercase">
            <span aria-hidden="true" className="h-px w-6 bg-gold-400" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-h1 text-ink-900">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-body text-ink-600">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
