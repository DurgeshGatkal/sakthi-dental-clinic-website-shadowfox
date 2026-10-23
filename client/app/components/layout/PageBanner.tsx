type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/* Section 5 — compact lavender banner that opens every inner page. */
export function PageBanner({ eyebrow, title, description }: Props) {
  return (
    <section className="bg-lavender-100 py-16 md:py-20">
      <div className="container-page">
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold tracking-wide text-lavender-700 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-h1 text-ink-900">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-body text-ink-600">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
