type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
};

/* Section 6 — repeated section header: eyebrow, heading, one-line lead. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
}: Props) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-lavender-700 uppercase">
          <span aria-hidden="true" className="h-px w-6 bg-gold-400" />
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-h2">{title}</Heading>
      {description ? <p className="mt-4 text-body text-ink-600">{description}</p> : null}
    </div>
  );
}
