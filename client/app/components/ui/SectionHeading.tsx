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
        <p className="mb-3 text-sm font-semibold tracking-wide text-lavender-700 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-h2">{title}</Heading>
      {description ? <p className="mt-4 text-body text-ink-600">{description}</p> : null}
    </div>
  );
}
